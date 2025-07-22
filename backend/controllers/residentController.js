// backend/controllers/residentController.js
const db = require('../db');

// GET all residents
exports.getAllResidents = (req, res) => {
  const query = "SELECT * FROM residents";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// GET single resident by ID
exports.getResidentById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM residents WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Resident not found" });
    res.json(results[0]);
  });
};

// CREATE new resident
exports.createResident = (req, res) => {
  const {
    id, first_name, last_name, national_id, date_of_birth, gender,
    phone, email, address, location, employment_status,
    property_ownership_details, household_id
  } = req.body;

  const created_by = req.user.id;

  const query = `
    INSERT INTO residents (
      id, first_name, last_name, national_id, date_of_birth, gender,
      phone, email, address, location, employment_status,
      property_ownership_details, household_id, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  const values = [
    id, first_name, last_name, national_id, date_of_birth, gender,
    phone, email, address, location, employment_status,
    property_ownership_details, household_id, created_by
  ];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Resident created successfully" });
  });
};

// UPDATE resident
exports.updateResident = (req, res) => {
  const { id } = req.params;
  const {
    first_name, last_name, national_id, date_of_birth, gender,
    phone, email, address, location, employment_status,
    property_ownership_details, household_id
  } = req.body;

  const query = `
    UPDATE residents SET
      first_name = ?, last_name = ?, national_id = ?, date_of_birth = ?, gender = ?,
      phone = ?, email = ?, address = ?, location = ?, employment_status = ?,
      property_ownership_details = ?, household_id = ?, updated_at = NOW()
    WHERE id = ?
  `;

  const values = [
    first_name, last_name, national_id, date_of_birth, gender,
    phone, email, address, location, employment_status,
    property_ownership_details, household_id, id
  ];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Resident updated successfully" });
  });
};

// DELETE resident
exports.deleteResident = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM residents WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Resident deleted successfully" });
  });
};
