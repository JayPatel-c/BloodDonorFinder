const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Validation Helpers
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

exports.registerDonor = async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city, gender, dob, mobile, lastDonation, weight, chronicDisease, address, district, pin, availabilityType, preferredContact } = req.body;

    // Manual Error Messages for wrong data entry
    if (!name || !email || !password || !bloodGroup || !city) {
      return res.status(400).json({ error: 'Please provide all required fields: name, email, password, bloodGroup, city.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email format.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long for security.' });
    }
    if (name.length < 3) {
      return res.status(400).json({ error: 'Name must be at least 3 characters long.' });
    }

    // Check if donor already exists
    const [existing] = await pool.query('SELECT id FROM donors WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert all fields
    const [result] = await pool.query(
      `INSERT INTO donors (name, email, password, bloodGroup, city, gender, dob, mobile, lastDonation, weight, chronicDisease, address, district, pin, availabilityType, preferredContact, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, bloodGroup, city, gender || null, dob || null, mobile || null, lastDonation || null, weight || null, chronicDisease ? 1 : 0, address || null, district || null, pin || null, availabilityType || 'both', preferredContact || 'phone', 'pending']
    );

    res.status(201).json({ message: 'Donor registered successfully', donorId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration. Please try again later.' });
  }
};

exports.loginDonor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password to log in.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format entered.' });
    }

    const [rows] = await pool.query('SELECT * FROM donors WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'No donor account found with that email address.' });
    }

    const donor = rows[0];
    if (donor.status === 'blocked') {
      return res.status(403).json({ error: 'Your account has been blocked by the admin. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign({ id: donor.id, role: 'donor' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    // Remove password from response
    delete donor.password;
    donor.role = 'donor';
    res.json({ message: 'Login successful', token, user: donor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login. Please try again later.' });
  }
};

exports.getDonorProfile = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM donors WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Donor not found.' });
    const donor = rows[0];
    delete donor.password;
    donor.role = 'donor';
    res.json(donor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching donor profile.' });
  }
};

exports.registerHospital = async (req, res) => {
  try {
    const { name, email, password, type, city, regNumber, contactPerson, designation, contactNumber, address, district } = req.body;

    // Manual Error Messages
    if (!name || !email || !password || !type || !city) {
      return res.status(400).json({ error: 'All fields are required: name, email, password, type, city.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Hospital password must be at least 6 characters long.' });
    }

    const [existing] = await pool.query('SELECT id FROM hospitals WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'A hospital with this email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO hospitals (name, email, password, type, city, regNumber, contactPerson, designation, contactNumber, address, district, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, type, city, regNumber || null, contactPerson || null, designation || null, contactNumber || null, address || null, district || null, 'pending']
    );

    res.status(201).json({ message: 'Hospital registration requested successfully. Pending admin approval.', hospitalId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during hospital registration.' });
  }
};

exports.loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
       return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [rows] = await pool.query('SELECT * FROM hospitals WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Hospital not found with this email.' });
    }

    const hospital = rows[0];
    
    // Check status
    if (hospital.status === 'pending') {
      return res.status(403).json({ error: 'Your hospital registration is still pending admin approval.' });
    }
    if (hospital.status === 'blocked') {
      return res.status(403).json({ error: 'This hospital account has been blocked.' });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect hospital password.' });
    }

    const token = jwt.sign({ id: hospital.id, role: 'hospital' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    delete hospital.password;
    hospital.role = 'hospital';
    res.json({ message: 'Hospital login successful', token, user: hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during hospital login.' });
  }
};

exports.getHospitalProfile = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hospitals WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Hospital not found.' });
    const hospital = rows[0];
    delete hospital.password;
    hospital.role = 'hospital';
    res.json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching hospital profile.' });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
       return res.status(400).json({ error: 'Email and password are required for Admin.' });
    }

    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Admin not found.' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect admin password.' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    delete admin.password;
    admin.role = 'admin';
    res.json({ message: 'Admin login successful', token, user: admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during admin login.' });
  }
};

exports.updateDonorProfile = async (req, res) => {
  try {
    const { name, gender, dob, mobile, bloodGroup, lastDonation, weight, chronicDisease, address, city, district, pin, availabilityType, preferredContact } = req.body;

    await pool.query(
      `UPDATE donors SET name=?, gender=?, dob=?, mobile=?, bloodGroup=?, lastDonation=?, weight=?, chronicDisease=?, address=?, city=?, district=?, pin=?, availabilityType=?, preferredContact=? WHERE id=?`,
      [name, gender || null, dob || null, mobile || null, bloodGroup, lastDonation || null, weight || null, chronicDisease ? 1 : 0, address || null, city, district || null, pin || null, availabilityType || 'both', preferredContact || 'phone', req.user.id]
    );

    // Return updated profile
    const [rows] = await pool.query('SELECT * FROM donors WHERE id = ?', [req.user.id]);
    const donor = rows[0];
    delete donor.password;
    donor.role = 'donor';
    res.json({ message: 'Profile updated successfully', user: donor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating donor profile.' });
  }
};

exports.updateHospitalProfile = async (req, res) => {
  try {
    const { name, type, regNumber, contactPerson, designation, contactNumber, address, city, district } = req.body;

    await pool.query(
      `UPDATE hospitals SET name=?, type=?, regNumber=?, contactPerson=?, designation=?, contactNumber=?, address=?, city=?, district=? WHERE id=?`,
      [name, type, regNumber || null, contactPerson || null, designation || null, contactNumber || null, address || null, city, district || null, req.user.id]
    );

    const [rows] = await pool.query('SELECT * FROM hospitals WHERE id = ?', [req.user.id]);
    const hospital = rows[0];
    delete hospital.password;
    hospital.role = 'hospital';
    res.json({ message: 'Profile updated successfully', user: hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating hospital profile.' });
  }
};


