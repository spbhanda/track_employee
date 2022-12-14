const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const table = require("console.table");
const inputCheck = require("../../utils/inputCheck");

// Get all department

router.get("/department", (req, res) => {
   const sql = "SELECT * FROM department";
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

// Get a department with an id:
router.get("/department/:id", (req, res) => {
   const sql = `SELECT * FROM department WHERE id = ?`;
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

// Create a new department
router.post("/department", ({ body }, res) => {
   // Data validation
   const errors = inputCheck(body, "name");
   if (errors) {
      res.status(400).json({ error: errors });
      return;
   }
   const sql = `INSERT INTO department (name) VALUES (?)`;
   const params = [body.name];

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

// Delete a department:
router.delete("/department/:id", (req, res) => {
   const sql = `DELETE FROM department WHERE id = ?`;
   const params = [req.params.id];
   db.query(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ error: res.message });
         // checks if anything was deleted
      } else if (!result.affectedRows) {
         res.json({
            message: "department not found",
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
