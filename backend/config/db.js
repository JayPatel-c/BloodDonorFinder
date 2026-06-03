const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to initialize tables
const initDB = async () => {
  try {
    // Optionally create database if not exists (requires connection to no specific database first) 
    // Usually you create it manually in MySQL or we can try to do it via a separate temp connection:
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await tempConnection.end();

    console.log('Database verified/created.');

    // Create Donors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        bloodGroup VARCHAR(10) NOT NULL,
        gender VARCHAR(10),
        dob DATE,
        mobile VARCHAR(15),
        lastDonation DATE,
        weight VARCHAR(10),
        chronicDisease BOOLEAN DEFAULT 0,
        address VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        district VARCHAR(100),
        pin VARCHAR(10),
        availabilityType VARCHAR(20) DEFAULT 'both',
        preferredContact VARCHAR(20) DEFAULT 'phone',
        available BOOLEAN DEFAULT 1,
        status ENUM('pending', 'verified', 'blocked') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add available column if it doesn't exist (for existing tables)
    try {
      await pool.query(`ALTER TABLE donors ADD COLUMN available BOOLEAN DEFAULT 1`);
    } catch (e) {
      // Column already exists, ignore
    }

    // Update default status to pending for new registrations
    try {
      await pool.query(`ALTER TABLE donors ALTER COLUMN status SET DEFAULT 'pending'`);
    } catch (e) {
      // Ignore if already set
    }

    // Create Hospitals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        regNumber VARCHAR(100),
        contactPerson VARCHAR(255),
        designation VARCHAR(100),
        contactNumber VARCHAR(15),
        address VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        district VARCHAR(100),
        licenseFile VARCHAR(255) DEFAULT NULL,
        idProofFile VARCHAR(255) DEFAULT NULL,
        status ENUM('pending', 'approved', 'blocked') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add file columns if they don't exist (for existing tables)
    try {
      await pool.query(`ALTER TABLE hospitals ADD COLUMN licenseFile VARCHAR(255) DEFAULT NULL`);
    } catch (e) { /* Column already exists */ }
    try {
      await pool.query(`ALTER TABLE hospitals ADD COLUMN idProofFile VARCHAR(255) DEFAULT NULL`);
    } catch (e) { /* Column already exists */ }

    // Create Admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Blood Requests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blood_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hospital_id INT NOT NULL,
        donor_id INT DEFAULT NULL,
        bloodGroup VARCHAR(10) NOT NULL,
        units INT NOT NULL,
        urgency ENUM('Normal', 'High', 'Critical') DEFAULT 'Normal',
        notes TEXT,
        status ENUM('Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled') DEFAULT 'Pending',
        request_type ENUM('Direct', 'Emergency') DEFAULT 'Direct',
        city VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
        FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
      );
    `);

    // Seed default admin if missing
    const [admins] = await pool.query('SELECT id FROM admins LIMIT 1');
    if (admins.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedAdminPassword = await bcrypt.hash('admin@123', 10);
      await pool.query(
        'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
        ['Super Admin', 'admin@bloodlink.in', hashedAdminPassword]
      );
      console.log('Default admin seeded.');
    }

    console.log('All database tables initialized successfully.');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('\x1b[31m%s\x1b[0m', '---------------------------------------------------------');
      console.error('\x1b[31m%s\x1b[0m', 'DATABASE CONNECTION ERROR: Connection Refused (ECONNREFUSED)');
      console.error('\x1b[31m%s\x1b[0m', '1. Make sure your MySQL service is running on ' + (process.env.DB_HOST || 'localhost') + ':3306');
      console.error('\x1b[31m%s\x1b[0m', '2. On Windows, check "Services" for "MySQL" or "MySQL80"');
      console.error('\x1b[31m%s\x1b[0m', '3. You can also try starting it via: net start MySQL80');
      console.error('\x1b[31m%s\x1b[0m', '---------------------------------------------------------');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\x1b[31m%s\x1b[0m', '---------------------------------------------------------');
      console.error('\x1b[31m%s\x1b[0m', 'DATABASE ACCESS DENIED: Check your credentials in backend/.env');
      console.error('\x1b[31m%s\x1b[0m', 'Check DB_USER and DB_PASSWORD (current user is ' + process.env.DB_USER + ')');
      console.error('\x1b[31m%s\x1b[0m', '---------------------------------------------------------');
    } else {
      console.error('Error initializing database:', error);
    }
  }
};

module.exports = { pool, initDB };
