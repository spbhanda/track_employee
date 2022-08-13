// node modules
const fs = require("fs");
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
// const { get } = require("http");

const logo = require("asciiart-logo");
const config = require("./package.json");
console.log(
   logo({
      name: "Track Employee!",
      lineChars: 10,
      padding: 2,
      margin: 3,
      borderColor: "grey",
      logoColor: "bold-green",
      textColor: "green",
   })
      .emptyLine()
      .right("version 1.1.000")
      .emptyLine()
      .render()
);

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
// get department lists:
let empDepartments = [];
function getDepartment() {
   db.query("SELECT * FROM department;", function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
         empDepartments.push(res[i].name);
      }
   });
   return empDepartments;
}
// --------------------------------

let empNames = [];
function getEmp() {
   db.query("SELECT employee.first_name, employee.last_name FROM employee;", function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
         empNames.push(res[i].first_name);
      }
   });
   return empNames;
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

const updateEmpRole = [
   {
      type: "list",
      name: "employee",
      message: "Chose employee's name to update the role?",
      choices: getEmp(),
   },
   {
      type: "list",
      name: "role",
      message: "Which role do you want to assign the selected employee?",
      choices: getRole(),
   },
];

const empRole = [
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
      choices: getRole(),
   },
];

const department = [
   {
      type: "input",
      name: "name",
      message: "What is the new department name?",
   },
];

const addNewRole = [
   {
      type: "input",
      name: "title",
      message: "What is the new role?",
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
      choices: getDepartment(),
   },
];

// Start app
function start_app() {
   console.log("\t\t Main Menu \n=============================================================================");
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
      } else if (selection === "Update Employee") {
         updateEmp();
      }
   });
}

// View employee
function viewAllEmp() {
   db.query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN employee manager on manager.id = employee.manager_id
        INNER JOIN role ON(role.id = employee.role_id)
        INNER JOIN department ON(department.id = role.department_id)`,

      function (err, res) {
         if (err) throw err;
         console.table(res);
         start_app();
      }
   );
}

// View All Roles
function viewAllRole() {
   db.query(
      "SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id=department.id",
      function (err, res) {
         if (err) throw err;
         console.table(res);
         start_app();
      }
   );
}

// View All Department
function viewAllDepartment() {
   db.query("SELECT * FROM department;", function (err, res) {
      if (err) throw err;
      console.table(res);
      start_app();
   });
}

// Add new employee
function addEmployee() {
   console.log("\t\t Add Employee \n===========================================================================");
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

// Update employee role NOT WORKING AT THE MOMENT
function updateEmp() {
   console.log("\t\t Update Role \n===========================================================================");
   inquirer.prompt(updateEmpRole).then((newUpdateRole) => {
      let roleID = getRole().indexOf(newUpdateRole.role) + 1;
      let empID = getEmp().indexOf(newUpdateRole.employee) + 1;

      console.log("value of emp:" + empID);
      db.query(
         `UPDATE employee SET role_id =? WHERE id = ?`,

         [roleID, empID],

         function (err) {
            if (err) throw err;
            console.table(newUpdateRole);
            start_app();
         }
      );
   });
}

// Add new role
function addRole() {
   console.log("\t\t Add Role \n==============================================================================");
   inquirer.prompt(addNewRole).then((newRole) => {
      let departmentID = getDepartment().indexOf(newRole.department) + 1;
      db.query(
         `INSERT INTO role SET ?`,
         {
            title: newRole.title,
            salary: newRole.salary,
            department_Id: departmentID,
         },

         function (err) {
            if (err) throw err;
            start_app();
         }
      );
   });
}

// add new department
function addDepartment() {
   console.log("\t\t Add Department \n==========================================================================");
   inquirer.prompt(department).then((newDepartment) => {
      db.query(
         `INSERT INTO department SET ?`,
         {
            name: newDepartment.name,
         },

         function (err) {
            if (err) throw err;
            start_app();
         }
      );
   });
}

start_app();
