// Migration script to add missing columns to existing donors and hospitals tables
const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Helper: add column if it doesn't exist
  const addCol = async (table, col, type) => {
    try {
      await conn.query(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
      console.log(`  + ${table}.${col}`);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log(`  (skip) ${table}.${col} already exists`);
      } else {
        console.error(`  ERROR ${table}.${col}:`, e.message);
      }
    }
  };

  console.log('Migrating donors table...');
  await addCol('donors', 'gender', "VARCHAR(10) DEFAULT NULL");
  await addCol('donors', 'dob', "DATE DEFAULT NULL");
  await addCol('donors', 'mobile', "VARCHAR(15) DEFAULT NULL");
  await addCol('donors', 'lastDonation', "DATE DEFAULT NULL");
  await addCol('donors', 'weight', "VARCHAR(10) DEFAULT NULL");
  await addCol('donors', 'chronicDisease', "BOOLEAN DEFAULT 0");
  await addCol('donors', 'address', "VARCHAR(255) DEFAULT NULL");
  await addCol('donors', 'district', "VARCHAR(100) DEFAULT NULL");
  await addCol('donors', 'pin', "VARCHAR(10) DEFAULT NULL");
  await addCol('donors', 'availabilityType', "VARCHAR(20) DEFAULT 'both'");
  await addCol('donors', 'preferredContact', "VARCHAR(20) DEFAULT 'phone'");

  console.log('Migrating hospitals table...');
  await addCol('hospitals', 'regNumber', "VARCHAR(100) DEFAULT NULL");
  await addCol('hospitals', 'contactPerson', "VARCHAR(255) DEFAULT NULL");
  await addCol('hospitals', 'designation', "VARCHAR(100) DEFAULT NULL");
  await addCol('hospitals', 'contactNumber', "VARCHAR(15) DEFAULT NULL");
  await addCol('hospitals', 'address', "VARCHAR(255) DEFAULT NULL");
  await addCol('hospitals', 'district', "VARCHAR(100) DEFAULT NULL");

  console.log('Migration complete!');
  await conn.end();
}

migrate().catch(console.error);
