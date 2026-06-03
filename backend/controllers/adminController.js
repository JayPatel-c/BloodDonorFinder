const { pool } = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [donors] = await pool.query('SELECT COUNT(*) as total FROM donors');
    const [hospitals] = await pool.query('SELECT COUNT(*) as total FROM hospitals');
    
    // In a real app we might track donations and active requests, but for now we'll mock them or set to 0.
    res.json({
      totalDonors: donors[0].total,
      totalHospitals: hospitals[0].total,
      donations: 120, // stub
      activeRequests: 5 // stub
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
};

exports.getDonors = async (req, res) => {
  try {
    const [donors] = await pool.query(
      `SELECT id, name, email, bloodGroup, city, district, gender, dob, mobile, 
              address, pin, weight, lastDonation, availabilityType, preferredContact, 
              available, status, created_at 
       FROM donors ORDER BY created_at DESC`
    );
    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching donors' });
  }
};

exports.updateDonorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['verified', 'blocked', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be verified, blocked, or pending.' });
    }

    const [result] = await pool.query('UPDATE donors SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    
    res.json({ message: `Donor status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating donor status' });
  }
};

exports.getHospitals = async (req, res) => {
  try {
    const [hospitals] = await pool.query(
      `SELECT id, name, email, type, regNumber, contactPerson, designation, contactNumber, address, city, district, licenseFile, idProofFile, status, created_at 
       FROM hospitals ORDER BY created_at DESC`
    );
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching hospitals' });
  }
};

exports.updateHospitalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'blocked'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be approved, blocked, or pending.' });
    }

    const [result] = await pool.query('UPDATE hospitals SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json({ message: `Hospital status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating hospital status' });
  }
};
