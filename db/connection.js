const mysql = require("mysql2");
// Connect to database
const db = mysql.createConnection(
   {
      host: "localhost",
      // Your MySQL username
      user: "root",
      // MySQL password
      password: "",
      database: "employeeDatabase",
   },
   console.log("Connected to the employeeDatabase")
);

module.exports = db;
