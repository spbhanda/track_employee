const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const table = require("console.table");
const inputCheck = require("../../utils/inputCheck");

// Get all role:
router.get("/role", (req, res) => {
   const sql = `SELECT role.*
             FROM role 
             LEFT JOIN department 
             ON role.department_id = department.id`;
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

//Get a single role
router.get("/role/:id", (req, res) => {
   const sql = `SELECT role.*
             FROM role 
             LEFT JOIN department 
             ON role.department_id = department.id`;

   const params = [req.params.id];

   db.query(sql, params, (err, row) => {
      if (err) {
         res.status(400).json({ error: err.message });
         return;
      }
      res.json({
         message: "Success",
         data: row,
      });
   });
});

// Create a role
router.post("/role", ({ body }, res) => {
   const errors = inputCheck(body, "title", "salary", "department_id");
   if (errors) {
      res.status(400).json({ error: errors });
      return;
   }
   const sql = `INSERT INTO role (title, salary, department_id)
  VALUES (?,?,?)`;
   const params = [body.title, body.salary, body.department_id];

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

module.exports = router;
