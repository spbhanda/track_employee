const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const inputCheck = require("../../utils/inputCheck");

// Get all employee
router.get("/employee", (req, res) => {
   const sql = `SELECT * FROM employee`;

   db.query(sql, (err, rows) => {
      if (err) {
         res.status(500).json({ error: err.message });
         return;
      }
      res.json({
         message: "Success",
         data: rows,
      });
   });
});

// Get single employee
router.get("/employee/:id", (req, res) => {
   const sql = `SELECT * FROM employee WHERE id = ?`;
   const params = [req.params.id];

   db.query(sql, params, (err, row) => {
      if (err) {
         res.status(400).json({ error: err.message });
         return;
      }
      res.json({
         message: "success",
         data: row,
      });
   });
});

// Create a new employee
router.post("/employee", ({ body }, res) => {
   // Data validation
   const errors = inputCheck(body, "first_name", "last_name", "role_id", "manager_id");
   if (errors) {
      res.status(400).json({ error: errors });
      return;
   }
   const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?,?,?)`;
   const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

   db.query(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ error: err.message });
         return;
      }
      res.json({
         message: "success",
         data: body,
      });
   });
});

// Update employee's info:

router.put("/employee/:id", (req, res) => {
   // Data validation
   const errors = inputCheck(req.body, "role_id");
   if (errors) {
      res.status(400).json({ error: errors });
      return;
   }

   const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
   const params = [req.body.role_id, req.params.id];

   db.query(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ error: err.message });
      } else if (!result.affectedRows) {
         res.json({
            message: "employee not found",
         });
      } else {
         res.json({
            message: "success",
            data: req.body,
            changes: result.affectedRows,
         });
      }
   });
});

// Delete a employee
router.delete("/employee/:id", (req, res) => {
   const sql = `DELETE FROM employee WHERE id = ?`;

   db.query(sql, req.params.id, (err, result) => {
      if (err) {
         res.status(400).json({ error: res.message });
      } else if (!result.affectedRows) {
         res.json({
            message: "employee not found",
         });
      } else {
         res.json({
            message: "deleted",
            changes: result.affectedRows,
            id: req.params.id,
         });
      }
   });
});

module.exports = router;
