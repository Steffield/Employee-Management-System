-- Insert Rows into department table
INSERT INTO department (id, name)
VALUES (1, "Music Management");

INSERT INTO department (id, name)
VALUES (2, "Artist");

INSERT INTO department (id, name)
VALUE (3, "Parks and Recreation");

-- Insert Rows into role table
INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Band Manager", 25000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Guitarist", 2000, 2);

INSERT INTO role (id,title, salary, department_id)
VALUES (3, "Bassist", 2000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Deputy Director", 65000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (5, "Director", 85000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (6, "Intern", 15000, 3);

-- Insert Rows into employee table
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Murray", "Hewitt", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bret", "McKenzie", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jemaine", "Clement", 3, 1);

INSERT INTO CMS_db.employee (first_name, last_name, role_id, manager_id)
VALUES ("Leslie", "Knope", 4, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ron", "Swanson", 5);

-- view all employees
select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id
from ((role
inner join employee on role.id=employee.role_id)
inner join department on department.id = role.department_id) ;

-- view all departments
select * from department;

-- view all roles
select * from role;

-- add employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("April", "Ludgate", 6, 5);

-- add department
INSERT INTO department (id, name)
VALUE (4, "Sales & Marketing");

-- add role
INSERT INTO role (id, title, salary, department_id)
VALUES (7, "Director of Sales Development", 105000, 4);

-- update employee role
UPDATE employee SET role_id = 7 WHERE id = 7;

-- update employee Manager
UPDATE employee SET manager_id = 5 WHERE id= 6;

-- view employees by managers
select employee.manager_id, employee.id "Employee ID", employee.first_name, employee.last_name, role.title, role.salary, department.name "Department Name"
from ((role
inner join employee on role.id=employee.role_id)
inner join department on department.id = role.department_id) ORDER BY employee.manager_id ;

-- view employees by department
select department.id "Department ID", department.name "Department Name", employee.id "Employee ID", employee.first_name "First Name", employee.last_name "Last Name", role.title "Role", role.salary "Salary", employee.manager_id "Manager ID"
from ((role
inner join employee on role.id=employee.role_id)
inner join department on department.id = role.department_id) ORDER BY department.id ;

-- remove department
DELETE FROM department WHERE name = "Director of Sales Development";

-- remove role
DELETE FROM role WHERE title = "Bassist";

-- remove employee
DELETE FROM employee WHERE first_name = "April" AND last_name ="Ludgate";

-- view total utilized budget of a department
SELECT role.department_id 'Dep ID', department.name 'Department', SUM(role.salary) 'Total Budget' FROM role INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id;


