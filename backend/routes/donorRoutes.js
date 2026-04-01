const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/donors/search?bloodGroup=B+&city=Anand&available=true
// Public endpoint — only returns verified + available donors
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, city, available } = req.query;

    let sql = `SELECT id, name, bloodGroup, city, district, lastDonation, mobile, preferredContact, available, created_at,
               CASE WHEN lastDonation IS NULL OR DATEDIFF(CURDATE(), lastDonation) >= 90 THEN 1 ELSE 0 END AS eligible
               FROM donors WHERE status = 'verified' AND available = 1`;
    const params = [];

    if (bloodGroup) {
      sql += ' AND bloodGroup = ?';
      params.push(bloodGroup);
    }
    if (city) {
      sql += ' AND (city LIKE ? OR district LIKE ?)';
      params.push(`%${city}%`, `%${city}%`);
    }
    if (available === 'true') {
      // Also filter by donation eligibility (90-day rule)
      sql += ' AND (lastDonation IS NULL OR DATEDIFF(CURDATE(), lastDonation) >= 90)';
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error searching donors:', error);
    res.status(500).json({ error: 'Server error searching donors.' });
  }
});

// PUT /api/donors/availability — Toggle donor availability (requires auth)
router.put('/availability', authMiddleware('donor'), async (req, res) => {
  try {
    const { available } = req.body;
    await pool.query('UPDATE donors SET available = ? WHERE id = ?', [available ? 1 : 0, req.user.id]);
    res.json({ message: 'Availability updated', available: !!available });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Server error updating availability.' });
  }
});
// GET /api/donors/stats — Public endpoint for platform statistics
router.get('/stats', async (req, res) => {
  try {
    const [donors] = await pool.query("SELECT COUNT(*) as total FROM donors WHERE status = 'verified'");
    const [hospitals] = await pool.query("SELECT COUNT(*) as total FROM hospitals WHERE status = 'approved'");
    res.json({
      activeDonors: donors[0].total,
      partnerHospitals: hospitals[0].total
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({ error: 'Server error fetching stats.' });
  }
});

module.exports = router;
