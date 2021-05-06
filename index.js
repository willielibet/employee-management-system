let connection = require('./employeesDBConnection')
// const mysql = require('mysql');
const inquirer = require('inquirer');
const { connectableObservableDescriptor } = require('rxjs/internal/observable/ConnectableObservable');

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

//view all departements and view the total utilized budget of a department.
//the total utilized budget is the combined salaries of all employees in that department.
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

// add an employee
const addEmployee = () => {
    //select everything from the role table.
    //we do so to get the titles/roles and store them in an array. 
    connection.query('SELECT * FROM role', (err,res) => {
        inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input', 
                    message: "What is the employee's fist name? ",
                },
                {
                    name: 'last_name',
                    type: 'input', 
                    message: "What is the employee's last name? "
                },
                {
                    name: 'manager_id',
                    type: 'input', 
                    message: "What is the employee's manager's ID? "
                },
                {
                    name: 'role', 
                    type: 'list',
                    message: "What is this employee's role? ",
                    choices: () => {
                    //declare empty array to store titles/roles
                    let rolesArray = [];
                    //store all roles in rolesArray array. the parameter res contains
                    //the result of the SELECT * FROM role query, we loop through it
                    //to get the title/role per row from it. we store the title/role
                    //in the rolesArray array. this returns the different choices or roles
                    //we see when we ask the question: What is this employee's role?
                    for (let i = 0; i < res.length; i++) {
                        rolesArray.push(res[i].title);
                    }
                    return rolesArray;
                    //console.log("roleArrya title " + roleArray)
                    },
                    
                }
                ]).then( (answer) => {
                    let role_id;
                    //loop through each of the answers.
                    for (let x = 0; x < res.length; x++) {
                        //if the choice matches one in the table, assign its role id to
                        //the role_id column for that new row inserted.
                        if (res[x].title == answer.role) {
                            role_id = res[x].id;
                            //console.log(role_id)
                        }                  
                    }  
                    connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        manager_id: answer.manager_id,
                        role_id: role_id,
                    },
                   (err) => {
                        if (err) throw err;
                        //console.log("Employeee " + answer.last_name + " added!")
                        console.log(`\nEmployee ${answer.first_name} ${answer.last_name} added\n `);
                        databaseAction();
                   })
                    
                })
        })
};

// const updateEmployeeRole = () => {
// connection.query(
//     'UPDATE employee SET ? WHERE ?',
//     [
//       {
//         role_id: role_id,
//       },
//       {
//         id: chosenItem.id,
//       },
//     ],
//     (error) => {
//       if (error) throw err;
//       console.log('Bid placed successfully!');
//       start();
//     }
//   );

//   // bid wasn't high enough, so apologize and start over
//   console.log('Your bid was too low. Try again...');
//   start();

// };

//connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    //run the start function after the connection is made to prompt the user
    databaseAction();
  });

  const endConnection = () => {
    connection.end();
  }