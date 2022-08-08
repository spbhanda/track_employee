// node modules
const fs = require("fs");
const inquirer = require("inquirer");

const menu = [
   {
      type: "list",
      name: "main_menu",
      message: "What would you like to do?",
      choices: [
         "View ALL Employee",
         "Add Employee",
         "Update Employee",
         "View All Roles",
         "Add Role",
         "View All Department",
         "Add Department",
      ],
   },
];
function start_app() {
   console.log("\t\t Main Menu \n====================================");
   inquirer.prompt(menu).then((menu_items) => {});
//    console.log("Selected" + menu_items.choices);
}

start_app();
