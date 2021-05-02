--creates a db schema called employees 
CREATE DATABASE employees_db;

--makes it so all of the following code will affect employees_db  --
USE employees_db;

--creates the table "deparment" within employees_db.
--given the relationship among the tables in this schema, the
--department table needs to be created first since
--it is the only table without a FK.
CREATE TABLE deparment (
--creates a numeric column called "id" which automatically 
--increments and cannot be null.
  id INTEGER NOT NULL AUTO_INCREMENT,
  --makes a string column called "name" containing names of 
  --up to 30 characters.
  name VARCHAR(30)
);