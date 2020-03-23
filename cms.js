const mysql= require("mysql");
const inquirer= require("inquirer");
const cTable = require("console.table");

// create connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
		password: "12345678",
    database: "CMS_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    runSearch();
  });
  
  function runSearch() {
    inquirer
      .prompt({
				type: "list",
				name: "action",
        message: "What would you like to do?",
        choices: [
					"View All Employees",
					"View All Departments",
					"View All Roles",
					// "--------------",
					"Add Employee, Department or Role",
					// "--------------",
					"Update Employee, Manager, Department or Role",
					// "--------------",
					"Remove Employee, Department or Role",
					// "--------------",
					"View Total Utilized Budget of a Department"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {

	//View
        case "View All Employees":
					view();
					break;

				case "View All Departments":
					viewDepartments();
					break;
					
				case "View All Roles":
					viewRoles();
					break;
					
				
		//Add
					
				case "Add Employee, Department or Role":
					add();
					break;

		//update

				case "Update Employee, Manager, Department or Role":
					update();
					break;

		//remove 

				case "Remove Employee, Department or Role":
					remove();
					break;

		// total salary in department
				
					case "View Total Utilized Budget of a Department":
						departmentBudget();
						break

					case "Exit":
						connection.end();
						break;
				}
	
      });
	}
	
	//=====view functions=========
	// var query;

	// SELECT A.id 'Manager ID', CONCAT(A.first_name , ' ' , A.last_name) AS ManagerName, B.id 'Employee ID', CONCAT(B.first_name , ' ' , B.last_name) AS EmployeeName FROM Employee A JOIN Employee B ON A.id = B.manager_id ORDER BY B.manager_id;

	
  function view() {
		inquirer.prompt({
			name:"viewBy",
			type:"list",
			message: "Would you like to view information about EMPLOYEES sorted by ID, Departments or Managers?",
			choices: ["View By Employee ID", "View By Departments", "View By Managers"]
		})
		.then((answer)=>{
			if (answer.viewBy === "View By Employee ID"){
				viewEmployees();
			}
			else if (answer.viewBy === "View By Departments"){
				viewEmployeesByDepartments();
			}
			else if (answer.viewBy === "View By Managers"){
				viewEmployeesByManagers();
			 } 
		});
	}

	function viewEmployees(){
		var query = "SELECT employee.id, employee.first_name 'First Name', employee.last_name 'Last Name', role.title 'Title', role.salary 'Salary', department.name 'Department', employee.manager_id 'Manager ID' from ((role INNER JOIN employee ON role.id=employee.role_id) INNER JOIN department ON department.id = role.department_id)";
		connection.query(query, function(err, res) {
		if (err) throw err;
		console.table(res);
		runSearch();
		});
	}

	function viewEmployeesByDepartments(){
		var query = "SELECT department.id 'Dep. ID', department.name 'Dep. Name', employee.first_name 'First Name', employee.last_name 'Last Name', role.title 'Title', role.salary 'Salary', employee.manager_id 'Manager ID' FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on department.id = role.department_id ORDER By department.id ASC";

		connection.query(query, function(err, res) {
			if (err) throw err;
			console.table(res);
			
			runSearch();
		});
	}

	function viewEmployeesByManagers(){
		var query = "SELECT A.id 'Man.ID', CONCAT(A.first_name , ' ' , A.last_name) AS ManagerName, B.id 'Emp.ID', CONCAT(B.first_name , ' ' , B.last_name) AS EmployeeName FROM Employee A JOIN Employee B ON A.id = B.manager_id ORDER BY B.manager_id";
		// "SELECT employee.manager_id 'Manager ID', employee.first_name 'First Name', employee.last_name 'Last Name', employee.id 'Employee ID', role.title 'Title', role.salary 'Salary', department.name 'Department Name' FROM ((role INNER JOIN employee on role.id=employee.role_id) INNER JOIN department on department.id = role.department_id) ORDER BY employee.manager_id ASC";
		connection.query(query, function(err, res) {
		if (err) throw err;
		console.table(res);
		runSearch();
		});
	}

	function viewDepartments() {
		// var query = "SELECT department.id 'Dep. ID', department.name 'Department',employee.first_name 'First Name', employee.last_name 'Last Name' FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on department.id = role.department_id";
		var query = "SELECT department.id 'Dep. ID', department.name 'Department' FROM department";
		connection.query(query, function(err, res) {
			if (err) throw err;
			console.table(res);
			
			runSearch();
		});
	}

	function viewRoles() {
		var query = "SELECT role.id, role.title 'Role Title', role.salary, department.name 'Dep. Name' FROM role LEFT JOIN department ON role.department_id = department.id";
		connection.query(query, function(err, res) {
			if (err) throw err;
			console.table(res);
			
			runSearch();
		});
	}

	//=====add functions=========

  function add(){
		inquirer.prompt({
			name:"addWhat",
			type:"list",
			message: "What would you like to add?",
			choices: ["Add Employee", "Add Department", "Add Role"]
		})
		.then((answer)=>{
			if (answer.addWhat === "Add Employee"){
				addEmployee();
			}
			else if (answer.addWhat === "Add Department"){
				addDepartment();
			 } 
			 else if (answer.addWhat === "Add Role"){
				addRole();
			 }
		});
		
	}
	
	function addEmployee() {
    inquirer
      .prompt([
				// {
        //   name: "id",
        //   type: "input",
				// 	message: "What's the employee's id?",
				// 	validate: response => response.match(/^[0-9]+$/) ? true: "enter a valid ID"
        // },
        {
          name: "first_name",
          type: "input",
					message: "What's the employee's first name?",
					validate: response =>response.match(/^[A-Za-z ]+$/)? true: "enter a valid name"
	
        },
        {
          name: "last_name",
          type: "input",
					message: "What's the employee's last name?",
					validate: response =>response.match(/^[A-Za-z ]+$/)? true: "enter a valid name"
        },
        {
          name: "role_id",
          type: "input",
					message: "What's the employee's role ID?",
					validate: response => response.match(/^[0-9]+$/) ? true: "enter a valid ID"
        },
        {
          name: "manager_id",
          type: "input",
					message: "What's the employee's manager ID?",
					validate: response => response.match(/^[0-9]+$/) ? true: "enter a valid ID"
        }
      ])
      .then(function(answer) {
		var query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
		connection.query(query, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], function(err, res) {
			if (err) throw err;
			console.table(answer);		
		});
			viewEmployees();
			runSearch();			
		});
	}

	function addDepartment() {
		inquirer
      .prompt(
        {
          name: "department",
          type: "input",
					message: "What department would you like to add?",
					validate: response =>response.match(/^[A-Za-z ]+$/)? true: "enter a valid name"
				}).then(function(answer) {
					var query = "INSERT INTO department (name) VALUES (?)";
					connection.query(query, [answer.department], function(err, res) {
						if (err) throw err;
						console.table(res);
						
					});
					// console.log("new department was added");
				viewDepartments();
				runSearch();
				});
	};

	function addRole() {
		inquirer
      .prompt([
        {
          name: "role",
          type: "input",
					message: "What role would you like to add?",
					validate: response =>response.match(/^[A-Za-z ]+$/)? true: "enter a valid name"
				},
				{
          name: "salary",
          type: "input",
					message: "What salary is this role receiving?",
					validate: response =>response.match(/^[A-Za-z ]+$/)? true: "enter a valid name"
				},
				{
          name: "department_id",
          type: "input",
					message: "What is the department ID for that role?",
					validate: response => response.match(/^[0-9]+$/) ? true: "enter a valid ID",
				}
			]).then(function(answer) {
					var query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
					connection.query(query, [answer.role, answer.salary, answer.department_id], function(err, res) {
						if (err) throw err;
						console.table(res);
						
					});
				viewRoles();
				runSearch();
				});
	};

	//=====delete functions=========

	function remove(){
		inquirer.prompt({
			name:"deleteWhat",
			type:"list",
			message: "What would you like to delete?",
			choices: ["Remove Employee", "Remove Department", "Remove Role"]
		})
		.then((answer)=>{
			if (answer.deleteWhat === "Remove Employee"){
				removeEmployee();
			}
			else if (answer.deleteWhat === "Remove Department"){
				removeDepartment();
			 } 
			 else if (answer.deleteWhat === "Remove Role"){
				removeRole();
			 }
		});
		
	}

	function removeEmployee(){
		//query database for all employees
		// connection.query("Select id, CONCAT (first_name, ' ' ,last_name) AS Name FROM employee", (err, results)=>{
		connection.query("Select * FROM employee", (err, results)=>{
	
			if(err) throw err;
			//prompt user which one to remove
		inquirer
      .prompt({
        name: "employee",
				type: "list",
				choices: () =>{
					// const fullName = first_name + last_name;
					const employeeArray=[];
					for (let i=0; i< results.length; i++){
						employeeArray.push(results[i].last_name);
					}
					return employeeArray;

				},
        message: "What employee what you like to remove?"
      })
      .then(function(answer) {
			
				var query = "DELETE FROM employee WHERE ?";
				
				connection.query(query, [{ last_name : answer.employee}], (err, res) =>{
					if (err) throw err;
					console.log(`${res.affectedRows} employee deleted!\n`);
          console.table(res);
					viewEmployees();
				});
			
			});
		
	});
}

function removeRole(){
	//query database for all employees
	connection.query("Select * FROM role", (err, results)=>{
		if(err) throw err;
		//prompt user which one to remove
	inquirer
		.prompt({
			name: "role",
			type: "list",
			choices: () =>{
				const roleArray=[];
				for (let i=0; i< results.length; i++){
					roleArray.push(results[i].title);
				}
				return roleArray;

			},
			message: "What role what you like to remove?"
		})
		.then(function(answer) {

			var query = "DELETE FROM role WHERE ?";
			connection.query(query, 
				{
					title : answer.role
				},
				(err, res) =>{
				if (err) throw err;
				console.log(`${res.affectedRows} role deleted!\n`);
				console.table(res);
				viewRoles();
			});
		
		});
	
});
}

function removeDepartment(){
	//query database for all employees
	connection.query("Select * FROM department", (err, results)=>{
		if(err) throw err;
		//prompt user which one to remove
	inquirer
		.prompt({
			name: "department",
			type: "list",
			choices: () =>{
				const departmentArray=[];
				for (let i=0; i< results.length; i++){
					departmentArray.push(results[i].name);
				}
				return departmentArray;

			},
			message: "What department what you like to remove?"
		})
		.then(function(answer) {
	
			var query = "DELETE FROM department WHERE ?";
			connection.query(query, 
				{
					name : answer.department
				},
				(err, res) =>{
				if (err) throw err;
				console.log(`${res.affectedRows} department deleted!\n`);
				console.table(res);
				viewDepartments();
			});
		
		});
	
});
}

	//=====update functions=========

	function update(){
		inquirer.prompt({
			name:"updateWhat",
			type:"list",
			message: "What would you like to update?",
			choices: ["Employee Information", "Department Information", "Role Information"]
		})
		.then((answer)=>{
			if (answer.updateWhat === "Employee Information"){
				updateEmployeeInfo();
			}
			else if (answer.updateWhat === "Department Information"){
				updateDepartment();
			 } 
			 else if (answer.updateWhat === "Role Information"){
				updateRole();
			 }
		});
		
	}

	function updateEmployeeInfo(){
		// var query = "SELECT employee.id, employee.first_name 'First Name', employee.last_name 'Last Name', role.title 'Title', role.salary 'Salary', department.name 'Department', employee.manager_id 'Manager ID' from ((role INNER JOIN employee ON role.id=employee.role_id) INNER JOIN department ON department.id = role.department_id)";
		var query = "SELECT * from employee";
		connection.query(query, function(err, res) {
		if (err) throw err;
		console.table(res);

		inquirer
			.prompt([
				{
					name:"employeeID",
					type: "list",
					choices: () =>{
						const employeeArray=[];
						for (let i=0; i< res.length; i++){
							employeeArray.push(res[i].id);
						}
						return employeeArray;
		
					},
					message: "Select employee id (check table above if unsure about id):"
				},
				{
					name:"updateWhat",
					type: "list",
					message: "What about the role would you like to update?",
					choices: ["Update Name", "Update Role ID", "Update Department ID"]
				}
			])
				.then(function(answer) {
					if (answer.updateWhat === "Update Name"){
						inquirer.prompt([
							{
							name: "newFirst",
							type: "input",
							message: "Update First Name:"
						},
						{
							name: "newLast",
							type: "input",
							message: "Update New Last Name:"
						}
						])
						.then((answer)=>{
							var query = "UPDATE employee SET ?, ? WHERE ?";
						connection.query(query, [{first_name: answer.newFirst}, {last_name: answer.newLast}, {id: answer. employeeID}], (err, res)=>{
						if (err) throw (err);
						console.log(`${res.affectedRows} Name updated!\n`);
						console.table(res);
						viewEmployees();
						});
					});
				} else if (answer.updateWhat === "Update Role ID"){
					inquirer.prompt(
						{
						name: "roleID",
						type: "input",
						message: "Update the new Role ID:"
					})
					.then((answer)=>{
						var query = "UPDATE employee SET ? WHERE ?";
					connection.query(query, [{role_id: answer.roleID}, {id: answer. employeeID}], (err, res)=>{
					if (err) throw (err);
					console.log(`${res.affectedRows} Role ID updated!\n`);
					console.table(res);
					viewEmployees();
					});
				});
				} else if(answer.updateWhat === "Update Department ID"){
					inquirer.prompt(
						{
						name: "departmentID",
						type: "input",
						message: "Update the new department ID:"
					})
					.then((answer)=>{
						var query = "UPDATE employee SET ? WHERE ?";
					connection.query(query, [{department_id: answer.departmentID}, {id: answer. employeeID}], (err, res)=>{
					if (err) throw (err);
					console.log(`${res.affectedRows} Dep ID updated!\n`);
					console.table(res);
					viewEmployees();
					});
				});
			}
			
		});
	});
	}
		
	
	function updateDepartment(){
		var query = "SELECT * from department";
		connection.query(query, function(err, res) {
		if (err) throw err;
		console.table(res);

		inquirer
			.prompt([
				{
					name:"depID",
					type: "list",
					choices: () =>{
						const depArray=[];
						for (let i=0; i< res.length; i++){
							depArray.push(res[i].id);
						}
						return depArray;
		
					},
					message: "Select department id (check table above to see dep name next to id):"
				},
				{
					name:"newName",
					type: "input",
					message: "What is the new department name?"
				}
			])
				.then((answer)=>{
					var query = "UPDATE department SET ? WHERE ?";
				connection.query(query, [{name: answer.newName}, {id: answer.depID}], (err, res)=>{
				if (err) throw (err);
				console.log(`${res.affectedRows} Name updated!\n`);
				console.table(res);
				viewDepartments();
				});
			});
				
			
		});
	}

	function updateRole() {
		// query the database for all roles 
		connection.query("SELECT * FROM role", (err, results) => {
			if (err) throw err;
			// once you have the roles, prompt the user which one they want to change
			inquirer
				.prompt([
					{
						name: "role",
						type: "list",
						choices: () => {
							const roleArray = [];
							for (let i = 0; i < results.length; i++) {
								roleArray.push(results[i].title);
							}
							return roleArray;
						},
						message: "What role would you like to update?"
					},
					{
						name: "whatColumn",
						type: "list",
						message: "What about the role would you like to update?",
						choices: ["Update Title", "Update Salary", "Update Department ID"]
					}
				])
				.then((answer) => {
					// get the information of the chosen role
					let chosenRole;
					for (let i = 0; i < results.length; i++) {
						if (results[i].title === answer.role) {
							chosenRole = results[i];
						}
					}	

					if (answer.whatColumn === "Update Title"){
						inquirer
							.prompt({
								name: "newTitle",
								type: "input",
								message: "Enter the new title:"
							}).then(res =>{
								connection.query("UPDATE role SET title ? WHERE title ?", [{ title: res.newTitle}, {title: chosenRole}], function(err, res){
									if (err) throw err;
									console.table(res);

								})
							})
					} else
			///update salary
					 if (answer.whatColumn === "Update Salary"){
						inquirer
						.prompt({
							name: "newSalary",
							type: "input",
							message: "Enter the new salary amount:"
						}).then(res =>{
							connection.query("UPDATE role SET salary ? WHERE id ?", [{salary: res.newSalary}, { title : answer.chosenRole}], function(err, res){
								if (err) throw err;
								console.table(res);
							})
						});
			///update dep id
				 } else if (answer.whatColumn === "Update Department ID"){
						inquirer
						.prompt({
							name: "newDepID",
							type: "input",
							message: "Enter the new department ID:",
							validate: response => response.match(/^[0-9]+$/) ? true: "enter a valid ID"
						}).then(res =>{
							connection.query("UPDATE role SET department_id ? WHERE id ?", [{department_id : res.newDepID}, {title : answer.chosenRole}], function(err, res){
								if (err) throw err;
								console.table(res);
								viewRoles();

							})
						})
					}
				});
		});
	}	
	
//=======view total utilized budget of department===

	function departmentBudget(){
		var query = "SELECT * from department";
		connection.query(query, function(err, res) {
		if (err) throw err;
		console.table(res);

		inquirer
			.prompt(
				{
					name:"depName",
					type: "list",
					choices: () =>{
						const depArray=[];
						for (let i=0; i< res.length; i++){
							depArray.push(res[i].name);
						}
						return depArray;
		
					},
					message: "Select which department's total budget you would like to see:"
				}
			)
				.then((answer)=>{
					var query = "SELECT role.department_id 'Dep ID', department.name 'Department', SUM(role.salary) 'Total Budget' FROM role INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id WHERE ?";
				connection.query(query, [{name : answer.depName}], (err, res)=>{ //won't let me do department.name
				if (err) throw (err);
				console.log(`${res.affectedRows} Total Budget for Department!\n`);
				console.table(res);
				// viewDepartments();
				});
			});
				
			
		});
	}
	