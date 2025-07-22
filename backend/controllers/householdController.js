// backend/controllers/householdController.js
const db = require('../db');

// GET all households
exports.getAllHouseholds = (req, res) => {
  const query = "SELECT * FROM households";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// GET single household by ID
exports.getHouseholdById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM households WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Household not found" });
    res.json(results[0]);
  });
};

// CREATE new household
exports.createHousehold = (req, res) => {
  const {
    id, household_name, address, location, size,
    composition, property_ownership_details
  } = req.body;

  const created_by = req.user.id;

  const query = `
    INSERT INTO households (
      id, household_name, address, location, size,
      composition, property_ownership_details, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  const values = [
    id, household_name, address, location, size,
    composition, property_ownership_details, created_by
  ];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Household created successfully" });
  });
};

// UPDATE household
exports.updateHousehold = (req, res) => {
  const { id } = req.params;
  const {
    household_name, address, location, size,
    composition, property_ownership_details
  } = req.body;

  const query = `
    UPDATE households SET
      household_name = ?, address = ?, location = ?, size = ?,
      composition = ?, property_ownership_details = ?, updated_at = NOW()
    WHERE id = ?
  `;

  const values = [
    household_name, address, location, size,
    composition, property_ownership_details, id
  ];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Household updated successfully" });
  });
};

// DELETE household
exports.deleteHousehold = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM households WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Household deleted successfully" });
  });
};
