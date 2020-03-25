-- Schema for SQL database
DROP DATABASE IF EXISTS CMS_db;

-- database
CREATE DATABASE CMS_db;
USE CMS_db;

-- tables
-- department

create table department (
    id int not null auto_increment,
    name varchar(30),
    primary key(id)
);

-- role
create table role (
	id int not null auto_increment,
    title varchar(30),
    salary decimal,
    department_id INT,
    primary key(id)
);

-- employee
create table employee (
    id int not null auto_increment,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    manager_id int,
    primary key(id)
);

