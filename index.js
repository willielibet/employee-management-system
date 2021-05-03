let connection = require('./employeesDBConnection')
// const mysql = require('mysql');
const inquirer = require('inquirer');

//prompt the user for any of the possible actions they should take.
const databaseAction = () => {
    inquirer.prompt([
        {
          type: "list",
          name: "dbAction",
          message: "What would you like to do?",
          choices: ["View All Employees", 
                    "View All Employees by Department", 
                    "View All Employees by Role", 
                    "Add Employee", 
                    "Add Department",    
                    "Add Role", 
                    "Update Employee Role",
                    "Exit",
            ],
        },
      ])
      .then((dbSelection) => {
        switch (dbSelection.dbAction) {
          case "View All Employees":
            viewAllEmployees();
            break;
          case "View All Employees by Department":
            viewAllEmployeesByDept();
            break;
            case "View All Employees by Role":
            viewAllEmployeesByRole();
            break;
            case "Add Employee":
            addEmployee();
            break;
            case "Add Department":
            addDepartment();
            break;
            case "Add Role":
            addRole();
            break;
            case "Update Employee Role":
            updateEmployeeRole();
            break;
          default:
            endConnection();
            break;
        }
      });
  }

  const viewAllEmployees = () => {
    connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
      console.log(res);
      //connection.end();
      (err) => {
        if (err) throw err;
        console.log('Your task was successfull!');
        // re-prompt the user for if they want to query the database any further
        databaseAction();
      }
    });
  };

//   databaseAction()
//   viewAllEmployees();

  //connect to the mysql server and sql database
// connection.connect(err => {
//     if (err) throw err;
//     start()
//   })
// connection.end();

//connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    //run the start function after the connection is made to prompt the user
    databaseAction();
  });

  const endConnection = () => {
    connection.end();
  }