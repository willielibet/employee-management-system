USE employeesdb;

INSERT INTO department(name)
VALUES 
('Management'),
('Network'),
('DevOps'),
('Human Resources'),
('Director'),
('Finance');

INSERT INTO role(title, salary, department_id)
VALUES
('IT Project Manager', 123000, 2),
('Network Manager', 75300, 3),
('HR Manager', 55000, 1),
('Linux Administrator', 50000, 3),
('JavaScript Developer', 87000, 2),
('Database Administrator', 65000, 2),
('Systems Administraor', 74000, 3),
('HR Specialist', 34000, 1),
('Accountant', 88000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) 
VALUES
('Michael', 'First', 1, NULL),
('Miss', 'Spaces', 2, NULL),
('Howard', 'Johnson', 3, NULL),
('Tony', 'Debug', 4, 1),
('Hudson', 'River', 5, 2),
('Darryl', 'Straw', 6, 3);