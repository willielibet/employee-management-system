
CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE department (
  id INTEGER NOT NULL AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(7,0) NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id) REFERENCES role(id),
    FOREIGN KEY(manager_id) REFERENCES employee(id)
);