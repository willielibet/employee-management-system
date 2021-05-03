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
          case "View All Employees by Manager":
            viewAllEmployeesByManager();
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
    let sql = `SELECT e.id, e.first_name, e.Last_name, r.title, d.name as "Department", salary, 
    CONCAT (m.first_name," ", m.last_name) AS "Manager" 
    FROM employee e INNER JOIN employee m ON e.manager_id = m.id 
    LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d on r.department_id = d.id`
        connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        // console.log(res);
        //connection.end();
        databaseAction();
      });
      
  };

 


//   const viewAllEmployees = () => {
//     connection.query('SELECT * FROM department', (err, res) => {
//       if (err) throw err;
//       console.log(res);
//       //connection.end();
//       (err) => {
//         if (err) throw err;
//         console.log('Your task was successfull!');
//         // re-prompt the user for if they want to query the database any further
//         databaseAction();
//       }
//     });
//   };

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