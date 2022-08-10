// node modules
const fs = require("fs");
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");

const selectMenu = [
   {
      type: "list",
      name: "startMenu",
      message: "What would you like to do?",
      choices: [
         "View All Employee",
         "Add Employee",
         "Update Employee",
         "View All Roles",
         "Add Role",
         "View All Department",
         "Add Department",
      ],
   },
];

let empRoles = [];
function getRole() {
   db.query("SELECT * FROM role;", function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
         empRoles.push(res[i].title);
      }
   });
   return empRoles;
}
let empManagers = [];
function getManager() {
   db.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL;", function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
         empManagers.push(res[i].first_name);
      }
   });
   return empManagers;
}

const empInfo = [
   {
      type: "input",
      name: "f_name",
      message: "Enter employee first name: ",
   },

   {
      type: "input",
      name: "l_name",
      message: "Enter employee last name:  ",
   },
   {
      type: "list",
      name: "role",
      message: "Choose employee role: ",
      choices: getRole(),
   },

   {
      type: "list",
      name: "manager",
      message: "Choose employee manager: ",
      choices: getManager(),
   },
];

const role = [
   {
      type: "input",
      name: "title",
      message: "What is the role of the employee?",
   },
   {
      type: "input",
      name: "salary",
      message: "What is the salary?",
   },
   {
      type: "list",
      name: "department",
      message: "Which department does the role belong to?",
      choices: ["Engineer", "HR", "IT"],
   },
];

const department = [
   {
      type: "input",
      name: "name",
      message: "What is the department?",
   },
];
// Start app
function start_app() {
   console.log("\t\t Main Menu \n====================================");
   inquirer.prompt(selectMenu).then((mainMenu) => {
      let selection = mainMenu.startMenu;
      if (selection === "View All Employee") {
         // console.log("shows employees");
         viewAllEmp();
      } else if (selection === "View All Roles") {
         // console.log("shows all roles");
         viewAllRole();
      } else if (selection === "View All Department") {
         // console.log("shows all departments");
         viewAllDepartment();
      } else if (selection === "Add Employee") {
         addEmployee();
      } else if (selection === "Add Role") {
         addRole();
      } else if (selection === "Add Department") {
         addDepartment();
      }
   });
}

// View employee
function viewAllEmp() {
   db.query("SELECT * FROM employee;", function (err, res) {
      if (err) throw err;
      console.table(res);
      start_app();
   });
}

// View All Roles
function viewAllRole() {
   db.query("SELECT * FROM role;", function (err, res) {
      if (err) throw err;
      console.table(res);
      start_app();
   });
}

// View All Department
function viewAllDepartment() {
   db.query("SELECT * FROM department;", function (err, res) {
      if (err) throw err;
      console.table(res);
      start_app();
   });
}

function addEmployee() {
   console.log("\t\t Add Employee \n====================================");
   inquirer.prompt(empInfo).then((newEmp) => {
      let roleID = getRole().indexOf(newEmp.role) + 1;
      let mgrID = getManager().indexOf(newEmp.manager) + 1;
      db.query(
         "INSERT INTO employee SET ?",
         {
            first_name: newEmp.f_name,
            last_name: newEmp.l_name,
            role_id: roleID,
            manager_id: mgrID,
         },
         function (err) {
            if (err) throw err;
            console.table(newEmp);
            start_app();
         }
      );
   });
}

function addRole() {
   console.log("\t\t Add Role \n====================================");
   inquirer.prompt(role).then((newRole) => {
      start_app();
   });
}

function addDepartment() {
   console.log("\t\t Add Department \n====================================");
   inquirer.prompt(department).then((newDepartment) => {
      start_app();
   });
}

start_app();
//module.exports = start_app();
