USE employeesdb;

INSERT INTO department(name) VALUES ('Management');
INSERT INTO department(name) VALUES ('Network');
INSERT INTO department(name) VALUES('DevOps');
INSERT INTO department(name) VALUES('Human Resources');
INSERT INTO department(name) VALUES('Director');
INSERT INTO department(name) VALUES('Finance');

INSERT INTO role(title, salary, department_id) VALUES ('IT Project Manager', 123000, 2);
INSERT INTO role(title, salary, department_id) VALUES ('Network Manager', 75300, 3);
INSERT INTO role(title, salary, department_id) VALUES('HR Manager', 55000, 1);
INSERT INTO role(title, salary, department_id) VALUES('Linux Administrator', 50000, 3);
INSERT INTO role(title, salary, department_id) VALUES('JavaScript Developer', 87000, 2);
INSERT INTO role(title, salary, department_id) VALUES('Database Administrator', 65000, 2);
INSERT INTO role(title, salary, department_id) VALUES('Systems Administraor', 74000, 3);
INSERT INTO role(title, salary, department_id) VALUES('HR Specialist', 34000, 1);
INSERT INTO role(title, salary, department_id) VALUES('Accountant', 88000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Michael2", "First2", 1, NULL);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Miss', 'Spaces', 2, NULL);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Howard', 'Johnson', 3, NULL);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Tony', 'Debug', 4, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Hudson', 'River', 5, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Darryl', 'Straw', 6, 3);