const { pool } = require('../config/db');

// @desc Create a new blood request (Direct or Emergency)
// @route POST /api/requests
// @access Private (Hospital)
exports.createRequest = async (req, res) => {
  try {
    const { donor_id, bloodGroup, units, urgency, notes, request_type, city } = req.body;
    const hospital_id = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO blood_requests (hospital_id, donor_id, bloodGroup, units, urgency, notes, request_type, city)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [hospital_id, donor_id || null, bloodGroup, units, urgency, notes, request_type, city]
    );

    res.status(201).json({
      message: 'Blood request created successfully',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Error creating blood request:', error);
    res.status(500).json({ error: 'Server error creating request.' });
  }
};

// @desc Get request history for a hospital
// @route GET /api/requests/hospital
// @access Private (Hospital)
exports.getHospitalRequests = async (req, res) => {
  try {
    const hospital_id = req.user.id;
    const [rows] = await pool.query(
      `SELECT r.*, d.name as donorName, d.mobile as donorMobile
       FROM blood_requests r
       LEFT JOIN donors d ON r.donor_id = d.id
       WHERE r.hospital_id = ?
       ORDER BY r.created_at DESC`,
      [hospital_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hospital requests:', error);
    res.status(500).json({ error: 'Server error fetching requests.' });
  }
};

// @desc Get active requests for a donor
// @route GET /api/requests/donor
// @access Private (Donor)
exports.getDonorRequests = async (req, res) => {
  try {
    const donor_id = req.user.id;

    // Fetch donor profile to get bloodGroup and city
    const [donorRows] = await pool.query('SELECT bloodGroup, city FROM donors WHERE id = ?', [donor_id]);
    if (donorRows.length === 0) return res.status(404).json({ error: 'Donor not found' });

    const { bloodGroup, city } = donorRows[0];

    const [rows] = await pool.query(
      `SELECT r.*, h.name as hospitalName, h.address as hospitalAddress, h.city as hospitalCity, h.contactNumber as hospitalPhone
       FROM blood_requests r
       JOIN hospitals h ON r.hospital_id = h.id
       WHERE (r.donor_id = ? OR (r.request_type = 'Emergency' AND r.bloodGroup = ? AND r.city = ?))
       AND r.status = 'Pending'
       ORDER BY r.created_at DESC`,
      [donor_id, bloodGroup, city]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching donor requests:', error);
    res.status(500).json({ error: 'Server error fetching requests.' });
  }
};

// @desc Update request status (Accept/Reject)
// @route PUT /api/requests/:id
// @access Private (Donor)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const donor_id = req.user.id;

    // Verify if the request belongs to the donor or is an emergency request for their group/city
    const [request] = await pool.query('SELECT * FROM blood_requests WHERE id = ?', [id]);
    if (request.length === 0) return res.status(404).json({ error: 'Request not found' });

    const reqData = request[0];
    if (reqData.donor_id && reqData.donor_id !== donor_id) {
      return res.status(403).json({ error: 'Not authorized to respond to this request' });
    }

    // If it's an emergency request and the donor accepts, we might want to assign them
    let sql = 'UPDATE blood_requests SET status = ?';
    const params = [status];

    if (reqData.request_type === 'Emergency' && status === 'Accepted') {
      sql += ', donor_id = ?';
      params.push(donor_id);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    await pool.query(sql, params);

    // If accepted, update the donor's lastDonation date?
    // User might prefer manual update after actual donation, so we'll leave it for now.

    res.json({ message: `Request ${status.toLowerCase()} successfully` });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ error: 'Server error updating request.' });
  }
};
// @desc Delete/Remove a blood request
// @route DELETE /api/requests/:id
// @access Private (Hospital)
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const hospital_id = req.user.id;

    // Verify if the request belongs to the hospital
    const [request] = await pool.query('SELECT * FROM blood_requests WHERE id = ? AND hospital_id = ?', [id, hospital_id]);
    if (request.length === 0) {
      return res.status(404).json({ error: 'Request not found or not authorized' });
    }

    await pool.query('DELETE FROM blood_requests WHERE id = ?', [id]);

    res.json({ message: 'Blood request removed successfully' });
  } catch (error) {
    console.error('Error deleting blood request:', error);
    res.status(500).json({ error: 'Server error deleting request.' });
  }
};
