const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Goat321!",
  database: "EmployeeDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  start();
});

const startQuestions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "userChoice",
    choices: [
      "View All Employees",
      "View All Employees by Department",
      "View All Employees by Manager",
      "View All Departments",
      "View All Roles",
      "View Total Salary",
      "Update Employee",
      "Add Employee",
      "Add Department",
      "Add Role",
      "Remove Employee",
      "Remove Department",
      "Remove Role",
      "Exit",
    ],
  },
];

const start = async () => {
  const { userChoice } = await inquirer.prompt(startQuestions);
  switch (userChoice) {
    case "View All Employees":
      return allEmployees();
    case "View All Employees by Department":
      return employeesDepartments();
    case "View All Employees by Manager":
      return employeesManager();
    case "View All Departments":
      return departments();
    case "View All Roles":
      return roles();
    case "View Total Salary":
      return salary();
    case "Update Employee":
      return update();
    case "Add Employee":
      return addEmployee();
    case "Add Department":
      return addDepartment();
    case "Add Role":
      return addRole();
    case "Remove Employee":
      return removeEmployee();
    case "Remove Department":
      return removeDepartment();
    case "Remove Role":
      return removeRole();
    case "Exit":
      return connection.end();
  }
};





const allEmployees = () => {
  const query = connection.query(
    `SELECT employees.id,  CONCAT(employees.first_name, " " , employees.last_name) AS full_name, roles.title, roles.salary, departments.department, CONCAT(mgr.first_name, ' ' ,mgr.last_name) AS manager 
    FROM employees 
    INNER JOIN roles on roles.id = employees.role_id 
    INNER JOIN departments on departments.id = roles.department_id 
    LEFT JOIN employees mgr on employees.manager_id = mgr.id;`,
    (err, res) => {
      if (err) throw err;
      console.table("\n", res);
      start();
    }
  );
};




const employeesDepartments = () => {
  const query = connection.query(
    `SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS full_name, departments.department
  FROM employees
  INNER JOIN roles on roles.id = employees.role_id
  INNER JOIN departments on departments.id = roles.department_id
  ORDER BY employees.id;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};




const employeesManager = () => {
  const query = connection.query(
    `SELECT employees.id,  CONCAT(employees.first_name, " " , employees.last_name) AS full_name, CONCAT(employee.first_name, ' ' ,employee.last_name) AS manager 
  FROM employees 
  INNER JOIN roles on roles.id = employees.role_id 
  INNER JOIN departments on departments.id = roles.department_id 
  LEFT JOIN employees employee on employees.manager_id = employee.id;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};




const departments = () => {
  const query = connection.query("SELECT * FROM departments;", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};




const roles = () => {
  const query = connection.query(
    "SELECT roles.id, roles.title FROM roles;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};




const salary = () => {
  const query = connection.query(
    `SELECT SUM(salary) AS Total_Salary
  FROM employees
  INNER JOIN roles on roles.id = employees.role_id
  ORDER BY employees.id;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};






const update = () => {
  const query = connection.query(
    `SELECT employees.id,  CONCAT(employees.first_name, " " , employees.last_name) AS full_name, roles.title, roles.salary, departments.department, CONCAT(mgr.first_name, ' ' ,mgr.last_name) AS manager 
    FROM employees 
    INNER JOIN roles on roles.id = employees.role_id 
    INNER JOIN departments on departments.id = roles.department_id 
    LEFT JOIN employees mgr on employees.manager_id = mgr.id;`,
    async (err, res) => {
      if (err) throw err;
      console.table(res);
      const empsID = res.map(({ id, full_name }) => id + " " + full_name);
      const { chosenEmployee, updateEmployee } = await inquirer.prompt([
        {
          type: "list",
          message: "Please select an employees ID you want to update?",
          name: "chosenEmployee",
          choices: empsID,
        },
        {
          type: "list",
          message: "What whould you like to update?",
          name: "updateEmployee",
          choices: [
            "Update Employee Name",
            "Update Employee Role",
            "Update Employee Manager",
          ],
        },
      ]);
      switch (updateEmployee) {
        case "Update Employee Name":
          return updateName(chosenEmployee);
        case "Update Employee Role":
          return updateRole(chosenEmployee);
        case "Update Employee Manager":
          return updateManager(chosenEmployee);
      }
    }
  );
};





const updateName = async (chosenEmployee) => {
  const { newFirstName, newLastName } = await inquirer.prompt([
    {
      type: "input",
      message: "Please enter new first_name?",
      name: "newFirstName",
    },
    {
      type: "input",
      message: "Please enter new last_name?",
      name: "newLastName",
    },
  ]);
  const query = connection.query(
    "UPDATE employees SET first_name = ? WHERE id = ?",
    [newFirstName, (chosenEmployee[0] += chosenEmployee[1])],
    (err, res) => {
      if (err) throw err;
      connection.query(
        "UPDATE employees SET last_name = ? WHERE id = ?",
        [newLastName, (chosenEmployee[0] += chosenEmployee[1])],
        (err, res) => {
          if (err) throw err;
        }
      );
      start();
    }
  );
};






const updateRole = (chosenEmployee) => {
  const query = connection.query("SELECT * FROM roles;", async (err, res) => {
    if (err) throw err;
    const empsTitle = res.map(({ id, title }) => id + " " + title);

    const { newTitle } = await inquirer.prompt([
      {
        type: "list",
        message: "Please choose new Title;",
        name: "newTitle",
        choices: empsTitle,
      },
    ]);

    const query = connection.query(
      "UPDATE employees SET role_id = ? WHERE id = ?;",
      [(newTitle[0] += newTitle[1]), (chosenEmployee[0] += chosenEmployee[1])],
      (err, res) => {
        if (err) throw err;
        start();
      }
    );
  });
};





const updateManager = (chosenEmployee) => {
  const query = connection.query(
    `SELECT employees.id,  CONCAT(employees.first_name, " " , employees.last_name) AS full_name, CONCAT(employee.first_name, ' ' ,employee.last_name) AS manager 
  FROM employees 
  INNER JOIN roles on roles.id = employees.role_id 
  INNER JOIN departments on departments.id = roles.department_id 
  LEFT JOIN employees employee on employees.manager_id = employee.id;`,
    async (err, res) => {
      if (err) throw err;
      const empsManager = res.map(({ id, full_name }) => id + " " + full_name);

      const { newMrg } = await inquirer.prompt([
        {
          type: "list",
          message: "Please choose new Manager;",
          name: "newMrg",
          choices: empsManager,
        },
      ]);
      const query = connection.query(
        "UPDATE employees SET manager_id = ? WHERE id = ?;",
        [(newMrg[0] += newMrg[1]), (chosenEmployee[0] += chosenEmployee[1])],
        (err, res) => {
          if (err) throw err;
          console.log(res);
          start();
        }
      );
    }
  );
};






const addEmployee = () => {
  const query = connection.query("SELECT * FROM roles;", async (err, res) => {
    if (err) throw err;
    const roles = res.map(({ id, title }) => id + " " + title);

    const { fName, lName, roleID } = await inquirer.prompt([
      {
        type: "input",
        message: "First Name;",
        name: "fName",
      },
      {
        type: "input",
        message: "Last Name",
        name: "lName",
      },
      {
        type: "list",
        message: "What is there role;",
        name: "roleID",
        choices: roles,
      },
    ]);

    const query = connection.query(
      `INSERT INTO employees (first_name, last_name, role_id)
  VALUES (?, ?, ?);`,
      [fName, lName, (roleID[0] += roleID[1])],
      (err, res) => {
        if (err) throw err;
        console.log(res);
        start();
      }
    );
  });
};






const addDepartment = async () => {
  const { addDepartment } = await inquirer.prompt([
    {
      type: "input",
      message: "What is the new Department?",
      name: "addDepartment",
    },
  ]);

  const query = connection.query(
    `INSERT INTO departments (department)
        VALUES  (?);`,
    [addDepartment],
    (err, res) => {
      if (err) throw err;
      console.log(res);
      start();
    }
  );
};






const addRole = () => {
  const query = connection.query(
    "SELECT * FROM departments;",
    async (err, res) => {
      if (err) throw err;
      const department = res.map(({ id, department }) => id + " " + department);

      const { roleID, title, salary } = await inquirer.prompt([
        {
          type: "list",
          message: "Please choose a department;",
          name: "roleID",
          choices: department,
        },
        {
          type: "input",
          message: "What is the title of the role?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the roles salary?",
          name: "salary",
        },
      ]);

      const query = connection.query(
        `INSERT INTO roles (title, salary, department_id)
      VALUES (?, ?, ?);`,
        [title, salary, (roleID[0] += roleID[1])],
        (err, res) => {
          if (err) throw err;
          console.log(res);
          start();
        }
      );
    }
  );
};





const removeEmployee = () => {
  const query = connection.query(
    `SELECT employees.id, CONCAT(employees.first_name, " " , employees.last_name) AS full_name 
    FROM employees `,
    async (err, res) => {
      if (err) throw err;
      const emps = res.map(({ id, full_name }) => id + " " + full_name);

      const { emp } = await inquirer.prompt([
        {
          type: "list",
          message: "Please choose Employee to DELETE;",
          name: "emp",
          choices: emps,
        },
      ]);
      const query = connection.query(
        "DELETE FROM employees WHERE id = ?;",
        [(emp[0] += emp[1])],
        (err, res) => {
          if (err) throw err;
          console.log(res);
          start();
        }
      );
    }
  );
};





const removeDepartment = () => {
  const query = connection.query(
    `SELECT * FROM departments;`,
    async (err, res) => {
      if (err) throw err;
      const departments = res.map(
        ({ id, department }) => id + " " + department
      );

      const { departmentID } = await inquirer.prompt([
        {
          type: "list",
          message: "Please choose a Department to DELETE;",
          name: "departmentID",
          choices: departments,
        },
      ]);
      const query = connection.query(
        "DELETE FROM departments WHERE id = ?;",
        [(departmentID[0] += departmentID[1])],
        (err, res) => {
          if (err) throw err;
          console.log(res);
          start();
        }
      );
    }
  );
};




const removeRole = () => {
  const query = connection.query(
    `SELECT roles.id, roles.title FROM roles;`,
    async (err, res) => {
      if (err) throw err;
      const roles = res.map(({ id, title }) => id + " " + title);

      const { roleID } = await inquirer.prompt([
        {
          type: "list",
          message: "Please choose Employee to DELETE;",
          name: "roleID",
          choices: roles,
        },
      ]);
      const query = connection.query(
        "DELETE FROM roles WHERE id = ?;",
        [(roleID[0] += roleID[1])],
        (err, res) => {
          if (err) throw err;
          console.log(res);
          start();
        }
      );
    }
  );
};