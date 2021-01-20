//Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');



var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Ms6kde3TP.qGtRzmoBUvKCN_",
  database: "directory_db"
});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
  });

//Defining questions

  console.log("Welcome to the Employee Tracker app!");

  var initialQuestions = [
      {
        type: "list",
          name: "directoryList",
          message: "To get started, please select which type of information you'll be accessing:",
          choices: ["Departments", "Employees", "Roles"]
      },
      {
          type: "list",
          name: "actionList",
          message: "Now, please select which action you would like to peform:",
          choices: ['Look up information','Add new information','Update information']
      }
  ];

let departmentChoices = [];

var loadDepartmentChoices = () => {
    connection.query("SELECT * FROM departments", function (departmentErr, departmentResult) {
    if (departmentErr) {
        return 'There was an issue accessing the database.';
    } else {
                
    for (i = 0; i < departmentResult.length; i++) {
    departmentChoices.push({name: departmentResult[i].name, value: departmentResult[i].id});
    }
} 

});
}



var departmentQuestions = [     
      {
          type: "input",
          name: "addNewDepartment",
          message: "Please enter the name of the department:",
          validate: function(answer) {
            if (answer.length <= 30) {
                return true;
            } else if (answer === false) {
                return 'You must provide a response.';
            } else {
                return "Response must be 30 characters or less. Please edit and resubmit.";
            }
        }
      },
      {
          type: "list",
          name: "selectDepartment",
          message: "Select which department you will be updating.",
          choices: departmentChoices
      },
      {
          type: "input",
          name: "updateDepartment",
          message: "Please enter the new name for this department:",
          validate: function(answer) {
            if (answer.length <= 30) {
                return true;
            } else if (answer === false) {
                return 'You must provide a response.';
            } else {
                return "Response must be 30 characters or less. Please edit and resubmit.";
            }
        }
      }
  ];

let roleChoices = [];

var loadRoleChoices = () => {
    connection.query("SELECT roles.title, roles.id FROM roles", function (roleErr, roleResult) {
    if (roleErr) {
        return 'There was an issue accessing the database.';
    } else {
        
        for (i = 0; i < roleResult.length; i++) {
            roleChoices.push({name: roleResult[i].title, value: roleResult[i].id});
            }  
        }
    });
}


var newRoleQuestions = [
    {
        type: "input",
        name: "addNewRole",
        message: "Please enter the title of the role:",
        validate: function(answer) {
            if (answer.length <= 30) {
                return true;
            } else if (answer === false) {
                return 'You must provide a response.';
            } else {
                return "Response must be 30 characters or less. Please edit and resubmit.";
            }
        }
    },
    {
        type: 'number',
        name: 'addRoleSalary',
        message: 'Please enter the salary for this role (Do not include commas).',
        validate: function (answer) {
            const re = /[+-]?([1-9]\d*(\.\d*[1-9])?|0\.\d*[1-9]+)|\d+(\.\d*[1-9])?/;
            const test = re.test(answer);
            if (test === false) {
                return 'Salary must be properly formatted number including dollars and cents (e.g. 10.00)';
            } else {
                return true;
            }
        }
    },
    {
        type: 'list',
        name: 'selectRoleDepartment',
        message: "Please select this role's department.",
        choices: departmentChoices
    }
];

var updateRoleQuestions = [
    {
        type: "list",
        name: "selectRole",
        message: "Select which role you will be updating.",
        choices: roleChoices
    },
    {
        type: "list",
        name: "selectRoleItemToUpdate",
        message: "Select which specific information you will be updating.",
        choices: ['Title','Salary','Department']
    },
    {
        type: "input",
        name: "updateRole",
        message: "Please enter the new name for this role:",
        validate: function(answer) {
            if (answer.length <= 30) {
                return true;
            } else if (answer === false) {
                return 'You must provide a response.';
            } else {
                return "Response must be 30 characters or less. Please edit and resubmit.";
            }
        }
    },
    {
        type: "number",
        name: "updateRoleSalary",
        message: "Please enter the updated salary for this role:",
        validate: function (answer) {
            const re = /[+-]?([1-9]\d*(\.\d*[1-9])?|0\.\d*[1-9]+)|\d+(\.\d*[1-9])?/;
            const test = re.test(answer);
            if (test === false) {
                return 'Salary must be properly formatted number including dollars and cents (e.g. 10.00)';
            } else {
                return true;
            }
        }
    },
    {
        type: "list",
        name: "updateRoleDepartment",
        message: "Please select the new department for this role:",
        choices: departmentChoices
    }
];

var employeeChoices = [];

var loadEmployeeChoices = () => {
        connection.query("SELECT employees.id, employees.first_name, employees.last_name FROM employees", function (employeeErr, employeeResult) {
        if (employeeErr) {
            return 'There was an issue accessing the database.';
        } else {
           
    for (i = 0; i < employeeResult.length; i++) {
        let employeeName = employeeResult[i].first_name + " " + employeeResult[i].last_name;
        let employeeId = employeeResult[i].id;
        employeeChoices.push({name: employeeName, value: employeeId});
        }
        }
        });
    }



var managerChoices = [];

var loadManagerChoices = () => {
    connection.query("SELECT employees.first_name, employees.last_name FROM employees", function (employeeErr, employeeResult) {
    if (employeeErr) {
        return 'There was an issue accessing the database.';
    } else {
       
for (i = 0; i < employeeResult.length; i++) {
    let employeeName = employeeResult[i].first_name + " " + employeeResult[i].last_name;
    managerChoices.push({name: employeeName, value: employeeName});
    }
    }
    });
}

var newEmployeeQuestions = [
    {
        type: "input",
        name: "addNewEmployeeFirstName",
        message: "Please enter the employee's first name:",
        validate: function(answer) {
            if (answer.length <= 30) {
                return true;
            } else if (answer === false) {
                return 'You must provide a response.';
            } else {
                return "Response must be 30 characters or less. Please edit and resubmit.";
            }
        }
    },
    {
        type: "input",
        name: "addNewEmployeeLastName",
        message: "Please enter the employee's last name:",
        validate: function(answer) {
            if (answer.length <= 30) {
                return true;
            } else if (answer === false) {
                return 'You must provide a response.';
            } else {
                return "Response must be 30 characters or less. Please edit and resubmit.";
            }
        }
    },
    {
        type: 'list',
        name: 'selectEmployeeRole',
        message: "Please select employee's role.",
        choices: roleChoices
    },
    {
        type: 'confirm',
        name: 'hasManager',
        message: "Does this employee have a manager?",
    },
    
];

var employeeManagerQuestion = [
    {
        type: 'list',
        name: 'selectEmployeeManager',
        message: "Please select employee's manager.",
        choices: managerChoices
    }
]

var updateEmployeeQuestions = [
    {
        type: "list",
        name: "selectEmployee",
        message: "Select which employee you will be updating.",
        choices: employeeChoices
    },
    {
        type: 'list',
        name: 'selectEmployeeItemToUpdate',
        message: "Please select the specific item you will be updating:",
        choices: ['First Name','Last Name','Role','Manager']
    },
    {
        type: 'input',
        name: 'updateEmployeeFirstName',
        message: "Please enter the employee's updated first name:",
        validate: function(answer) {
            if (answer.length <= 30) {
                return true;
            } else if (answer === false) {
                return 'You must provide a response.';
            } else {
                return "Response must be 30 characters or less. Please edit and resubmit.";
            }
        }
    },
    {
        type: 'input',
        name: 'updateEmployeeLastName',
        message: "Please enter the employee's updated last name:",
        validate: function(answer) {
            if (answer.length <= 30) {
                return true;
            } else if (answer === false) {
                return 'You must provide a response.';
            } else {
                return "Response must be 30 characters or less. Please edit and resubmit.";
            }
        }
    },
    {
        type: 'list',
        name: 'updateEmployeeRole',
        message: "Please select the employee's new role:",
        choices: roleChoices
    },
    {
        type: 'list',
        name: 'updateEmployeeManager',
        message: "Please select the employee's new manager:",
        choices: managerChoices
    }
];

var loadAllChoices = () => {
    loadDepartmentChoices();
    loadEmployeeChoices();
    loadRoleChoices();
    loadManagerChoices();
}

/* var clearChoices = () => {
    departmentChoices = [];
    roleChoices = [];
    employeeChoices = [];
} */


//Query functions and conditionals

function answerQuestions() {
loadAllChoices();
inquirer.prompt(initialQuestions).then(function(initialAnswers) {
    if (initialAnswers.directoryList === 'Departments' && initialAnswers.actionList === 'Add new information') {
        inquirer.prompt(departmentQuestions[0]).then(function(departmentAnswers) {
            connection.query("INSERT INTO departments (name) VALUES (?)", [departmentAnswers.addNewDepartment], function (err, result) {
                if (err) {
                    console.log('Unable to save new department.');
                }
                console.log('New department saved!');
                process.exit();

                });
        });
    } else if (initialAnswers.directoryList === 'Departments' && initialAnswers.actionList === 'Look up information') {
        connection.query("select departments.name as 'Department' from departments", function(err,results) {
            if (err) {
                return 'Unable to display departments.';
            } else if (results === false) {
                return 'There are currently no saved departments. Please add a new department.';
            } else {
                console.table(results);
                process.exit();
            }   
        });
    } else if (initialAnswers.directoryList === 'Departments' && initialAnswers.actionList === 'Update information') {
        inquirer.prompt(departmentQuestions[1]).then(function(departmentAnswers) {
            inquirer.prompt(departmentQuestions[2]).then(function(updatedDepartmentAnswer) {
                connection.query("UPDATE departments SET name = ? WHERE id = ?", [updatedDepartmentAnswer.updateDepartment,departmentAnswers.selectDepartment], function(err,results) {
                    if (err) {
                        return 'Unable to update department.';
                    } else {
                    console.log('Department updated!');
                    process.exit();
                    }
                });
            });
        });
        
    } else if (initialAnswers.directoryList === 'Roles' && initialAnswers.actionList === 'Add new information') {
        inquirer.prompt(newRoleQuestions).then(function(roleAnswers) {
            connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)", [roleAnswers.addNewRole,roleAnswers.addRoleSalary,roleAnswers.selectRoleDepartment], function (err, result) {
                if (err) {
                    console.log('Unable to save new role.');
                } else {
                console.log('New role saved!');
                process.exit();
                }
            });
        });
    } else if (initialAnswers.directoryList === 'Roles' && initialAnswers.actionList === 'Look up information') {
        connection.query("select roles.title as 'Title', roles.salary as 'Salary', departments.name as 'Department' from roles join departments on roles.department_id = departments.id;", function(err,result) {
            if (err) {
                return 'Unable to display roles.';
            } else if (result === false) {
                return 'No roles saved. Please add a role.';
            } else {
            console.table(result);
            process.exit();
            }
            
        });

    } else if (initialAnswers.directoryList === 'Roles' && initialAnswers.actionList === 'Update information') {
        inquirer.prompt(updateRoleQuestions[0]).then(function(updatedRoleAnswers) {
            inquirer.prompt(updateRoleQuestions[1]).then(function(updatedItemAnswer) {
                if (updatedItemAnswer.selectRoleItemToUpdate === "Title") {
                    inquirer.prompt(updateRoleQuestions[2]).then(function(updatedTitleAnswer) {
                        connection.query("UPDATE roles SET title = ? WHERE id = ?", [updatedTitleAnswer.updateRole,updatedRoleAnswers.selectRole,], function(err,results) {
                            if (err) {
                                return 'Unable to update role.';
                            } else {
                            console.log('Role updated!');
                            process.exit();

                            }
                        });
                    });
                    
                } else if (updatedItemAnswer.selectRoleItemToUpdate === "Salary") {
                    inquirer.prompt(updateRoleQuestions[3]).then(function(updatedSalaryAnswer) {
                        connection.query("UPDATE roles SET salary = ? WHERE id = ?", [updatedSalaryAnswer.updateRoleSalary,updatedRoleAnswers.selectRole,], function(err,results) {
                            if (err) {
                                return 'Unable to update role.';
                            } else {
                            console.log('Role updated!');
                            process.exit();

                            }
                        });
                    });
                } else if (updatedItemAnswer.selectRoleItemToUpdate === "Department") {
                    inquirer.prompt(updateRoleQuestions[4]).then(function(updatedDepartmentAnswer) {
                        connection.query("UPDATE roles SET department_id = ? WHERE id = ?", [updatedDepartmentAnswer.updateRoleDepartment,updatedRoleAnswers.selectRole,], function(err,results) {
                            if (err) {
                                return 'Unable to update role.';
                            } else {
                            console.log('Role updated!');
                            process.exit();

                            }
                        });
                    });
                }
            });    
    
        });
    } else if (initialAnswers.directoryList === 'Employees' && initialAnswers.actionList === 'Add new information') {
        inquirer.prompt(newEmployeeQuestions).then(function(newEmployeeAnswers) {
            if (newEmployeeAnswers.hasManager) {
                inquirer.prompt(employeeManagerQuestion).then(function(managerAnswer) {
                    connection.query("INSERT INTO employees (first_name, last_name, role_id, manager) VALUES (?,?,?,?)", [newEmployeeAnswers.addNewEmployeeFirstName,newEmployeeAnswers.addNewEmployeeLastName,newEmployeeAnswers.selectEmployeeRole,managerAnswer.selectEmployeeManager], function (err, result) {
                        if (err) {
                            console.log('Unable to save new employee.');
                        } else {
                        console.log('New employee saved!');
                        process.exit();
         
                        }
                    });
                }); 
            } else {
                connection.query("INSERT INTO employees (first_name, last_name, role_id) VALUES (?,?,?)", [newEmployeeAnswers.addNewEmployeeFirstName,newEmployeeAnswers.addNewEmployeeLastName,newEmployeeAnswers.selectEmployeeRole], function (err, result) {
                    if (err) {
                        console.log('Unable to save new employee.');
                    } else {
                    console.log('New employee saved!');
                    process.exit();
            
                    }
            });
            }
        });    
    } else if (initialAnswers.directoryList === 'Employees' && initialAnswers.actionList === 'Look up information') {
        connection.query("select employees.id as 'Employee ID', employees.first_name as 'First Name',employees.last_name as 'Last Name', roles.title as 'Role', roles.salary as 'Salary', departments.name as 'Department', employees.manager as 'Manager' from employees inner join roles on employees.role_id = roles.id join departments on roles.department_id = departments.id;", function(err,results) {
            if (err) {
                return 'Unable to display employees.';
            } else {
            console.table(results);
            process.exit();
            }
        });
    } else if (initialAnswers.directoryList === 'Employees' && initialAnswers.actionList === 'Update information') {
        inquirer.prompt(updateEmployeeQuestions[0]).then(function(selectedEmployee) {
            inquirer.prompt(updateEmployeeQuestions[1]).then(function(selectedEmployeeItem) {
                if (selectedEmployeeItem.selectEmployeeItemToUpdate === "First Name") {
                    inquirer.prompt(updateEmployeeQuestions[2]).then(function(updatedFirstName) {
                        connection.query("UPDATE employees SET first_name = ? WHERE id = ?", [updatedFirstName.updateEmployeeFirstName,selectedEmployee.selectEmployee], function(err,results) {
                            if (err) {
                                return 'Unable to update employee.';
                            } else {
                            console.log('Employee updated!');
                            process.exit();

                            }
                        });
                    });
                } else if (selectedEmployeeItem.selectEmployeeItemToUpdate === "Last Name") {
                    inquirer.prompt(updateEmployeeQuestions[3]).then(function(updatedLastName) {
                        connection.query("UPDATE employees SET last_name = ? WHERE id = ?", [updatedLastName.updateEmployeeLastName,selectedEmployee.selectEmployee], function(err,results) {
                            if (err) {
                                return 'Unable to update employee.';
                            } else {
                            console.log('Employee updated!');
                            process.exit();

                            }
                        });
                    });
                } else if (selectedEmployeeItem.selectEmployeeItemToUpdate === "Role") {
                    inquirer.prompt(updateEmployeeQuestions[4]).then(function(updatedEmployeeRole) {
                        connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [updatedEmployeeRole.updateEmployeeRole,selectedEmployee.selectEmployee], function(err,results) {
                            if (err) {
                                return 'Unable to update employee.';
                            } else {
                            console.log('Employee updated!');
                            process.exit();

                            }
                        });
                    });
    
                } else if (selectedEmployeeItem.selectEmployeeItemToUpdate === "Manager") {
                    inquirer.prompt(updateEmployeeQuestions[5]).then(function(updatedManager) {
                        connection.query("UPDATE employees SET manager = ? WHERE id = ?", [updatedManager.updateEmployeeManager,selectedEmployee.selectEmployee], function(err,results) {
                            if (err) {
                                return 'Unable to update employee.';
                            } else {
                            console.log('Employee updated!');
                            process.exit();

                            }
                        });
                    });
                }
            
            });  
        
        });
    }
});

}

//Function to let user repeat the process

/* const repeatQuestions = () => {
    inquirer.prompt(
        [
            {
                type: 'confirm',
                name: 'additionalQueries',
                message: 'Would you like to continue using the employee tracker?'
            }
        ]).then(function(a) {
            if (a.additionalQueries) {
                clearChoices();
                loadAllChoices();
                answerQuestions();
            } else {
                console.log('Thank you for using the employee tracker!');
                process.exit();
            }
        });
    
}
 */

answerQuestions();
