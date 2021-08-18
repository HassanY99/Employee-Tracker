INSERT INTO departments (department)
VALUES  ("Engineering"), ("Office"), ("Accounting"), ("Legal"), ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant Lead", 135000, 1), ("Accountant", 112000, 1), ("Accountant Intern", 45000, 1), ("Sales Lead", 102000, 2), ("Sales Person", 90000, 2), ("Sales Intern",43000, 2), ("Engineer Lead", 132000, 3), ("Engineer", 113000, 3), ("Engineer Intern", 57000, 3), ("Lawyer Lead", 142000, 4), ("Lawyer", 128000, 4), ("Office Manager", 98000, 5), ("Office Assistant", 87000, 5), ("Office Intern", 32000, 5);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Hassan", "Yusuf", 7);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bibi", "Mo", 2, 1);



SELECT * FROM employees WHERE id = 1;


SELECT * FROM roles;
SELECT * FROM employees;


SELECT employees.id,  CONCAT(employees.first_name, " " , employees.last_name) AS full_name, roles.title, roles.salary, departments.department, CONCAT(mgr.first_name, ' ' ,mgr.last_name) AS manager 
FROM employees 
INNER JOIN roles on roles.id = employees.role_id 
INNER JOIN departments on departments.id = roles.department_id 
LEFT JOIN employees mgr on employees.manager_id = mgr.id;



SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS full_name, departments.department
FROM employees
INNER JOIN roles on roles.id = employees.role_id
INNER JOIN departments on departments.id = roles.department_id
ORDER BY employees.id;



SELECT employees.id,  CONCAT(employees.first_name, " " , employees.last_name) AS full_name, CONCAT(employee.first_name, ' ' ,employee.last_name) AS manager 
FROM employees 
INNER JOIN roles on roles.id = employees.role_id 
INNER JOIN departments on departments.id = roles.department_id 
LEFT JOIN employees employee on employees.manager_id = employee.id;



SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS full_name, roles.title
FROM employees
INNER JOIN roles on roles.id = employees.role_id
INNER JOIN departments on departments.id = roles.department_id
ORDER BY employees.id;



SELECT * FROM departments;



SELECT roles.id, roles.title FROM roles;



SELECT SUM(salary) AS Total_Salary
FROM employees
INNER JOIN roles on roles.id = employees.role_id
ORDER BY employees.id;




UPDATE employees SET first_name = 'Bob' WHERE id = 7;


UPDATE employees SET last_name = 'John' WHERE id = 7;


UPDATE employees SET title = 1 WHERE id = 9;


UPDATE employees SET manager_id = 8 WHERE id = 5;



DELETE FROM departments WHERE id = 1;

DELETE FROM roles WHERE id = 5;

DELETE FROM employees WHERE id = 13;


INSERT INTO departments (department)
VALUES  ("Debuggers");


INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Debugger", 93000, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Pheebs", "Mon", 15, null);