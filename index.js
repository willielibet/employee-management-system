let connection = require('./employeesDBConnection')
// const mysql = require('mysql');
const inquirer = require('inquirer');
const { add } = require('lodash');

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
                    "View All Departments", 
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
            case "View All Departments":
                viewAllDepartments();
            break
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
    let sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department,
                        r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employee e
                LEFT JOIN employee AS m 
                ON m.id = e.manager_id
                LEFT JOIN role r 
                ON e.role_id = r.id
                LEFT JOIN department d 
                ON r.department_id = d.id;`

    // let sql = `SELECT e.id, e.first_name, e.Last_name, r.title, d.name as "Department", salary
    // FROM employee e
    // LEFT JOIN role r 
    // ON e.role_id = r.id 
    // LEFT JOIN department d 
    // ON r.department_id = d.id`
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


const viewAllDepartments = () => {
    let sql = `SELECT d.id, d.name "Department Name"
                FROM department d;`

    // let sql = `SELECT e.id, e.first_name, e.Last_name, r.title, d.name as "Department", salary
    // FROM employee e
    // LEFT JOIN role r 
    // ON e.role_id = r.id 
    // LEFT JOIN department d 
    // ON r.department_id = d.id`
        connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        // console.log(res);
        //connection.end();
        databaseAction();
      });
  };



const addDepartment = () => {
        inquirer.prompt([
            {
                name: "department",
                type: "input",
                message: "Please enter the name of the new department that you would like to add: "
            }
        ])
        .then((answer) => {
            connection.query(
            'INSERT INTO department SET ?',
            {
                name: answer.department,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} product inserted!\n`);
                console.log("New department created successfully!");
                databaseAction();
            }
        );
      });
}


const addRole = () => {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the name of the role? "
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of the role? "
        },
        {
            name: "department_id",
            type: "input",
            message: "Enter the department ID the role belongs to [Sales = 1, Engineering = 2, Finance = 3, Legal = 4]: ",
            // addDepartment()
        },
    ])
    .then((answer) => {
        connection.query(
        'INSERT INTO role SET ?', 
        {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} product inserted!\n`);
            console.log("New department created successfully!");
           databaseAction();
        }
    );
  });
}
//   });


//connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    //run the start function after the connection is made to prompt the user
    databaseAction();
  });

  const endConnection = () => {
    connection.end();
  }