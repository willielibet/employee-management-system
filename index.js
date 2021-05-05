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
                    "View All Employees by Manager",
                    "View All Departments", 
                    "View All Roles",
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
            case "View All Employees by Department":
                viewAllEmployeesByDepartment();
            break;
            case "View All Employees by Role":
                viewAllEmployeesByRole();
            break;
            case "View All Departments":
                viewAllDepartments();
            break;
            case "View All Roles":
                viewAllRoles();
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
    let sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department,
                        r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employee e
                LEFT JOIN employee AS m 
                ON m.id = e.manager_id
                LEFT JOIN role r 
                ON e.role_id = r.id
                LEFT JOIN department d 
                ON r.department_id = d.id;`
        connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        databaseAction();
      });
  };

//view all departements and add utilized department budget.
const viewAllDepartments = () => {
    let sql = ` SELECT d.id, d.name "Department Name", sum(r.salary) as utilized_budget
                FROM department d
                LEFT JOIN role r 
                ON r.department_id = d.id
                LEFT JOIN employee e 
                ON e.id = r.department_id
                GROUP BY d.name;`
        connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        databaseAction();
    });
  };


  const viewAllRoles = () => {
    let sql =  `SELECT d.id, r.title, d.name AS "Department Name", r.salary
                FROM role r
                LEFT JOIN department d
                ON r.department_id = d.id;`
        connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        databaseAction();
      });
  };


// WHERE name='${d.name}'
  const viewAllEmployeesByDepartment = () => {
    let sql =  `SELECT d.id AS 'department_id', d.name "Department Name", e.first_name, e.last_name
                FROM employee e
                LEFT JOIN role r
                ON e.role_id = r.id
                LEFT JOIN department d 
                ON d.id = r.department_id
                GROUP BY department_id, d.name, e.first_name, e.last_name
                ORDER BY d.name;`
        connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        databaseAction();
      });
  };

  const viewAllEmployeesByManager = () => {
    let sql =  `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department,
                r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employee e
                LEFT JOIN employee AS m 
                ON m.id = e.manager_id
                LEFT JOIN role r 
                ON e.role_id = r.id
                LEFT JOIN department d 
                ON r.department_id = d.id
                GROUP BY manager;`
        connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
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
                viewAllDepartments();
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
            message: "Enter the department ID the role belongs to [1 for Sales, 2 for Engineering, 3 for Finance, 4 for Legal, 5 for Music]: ",
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



//connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    //run the start function after the connection is made to prompt the user
    databaseAction();
  });

  const endConnection = () => {
    connection.end();
  }