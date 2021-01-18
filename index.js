const inquirer = require('inquirer');
const mysql = require('mysql');
//const departments = require('./utilities/departments');



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


var departmentChoices = [];

connection.query("SELECT * FROM departments", function (err, result) {
    if (err) {
        return 'Unable to show departments.';
    }

    if (result === null) {
        return 'There are currently no saved departments.';
     }
                
for (i = 0; i < result.length; i++) {
    departmentChoices.push({name: result[i].name, value: result[i].id});
} 

});



var departmentQuestions = [     
      {
          type: "input",
          name: "addNewDepartment",
          message: "Please enter the name of the department:",
          validate: function(answer) {
              if (answer.length <= 30) {
                  return true;
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
            } else {
                return "Response must be 30 characters or less. Please edit and resubmit.";
            }
        }
      }
  ];

const answerQuestions = () => {
inquirer.prompt(initialQuestions).then(function(initialAnswers) {
    if (initialAnswers.directoryList === 'Departments' && initialAnswers.actionList === 'Add new information') {
        inquirer.prompt(departmentQuestions[0]).then(function(departmentAnswers) {
            connection.query("INSERT INTO departments (name) VALUES (?)", [departmentAnswers.addNewDepartment], function (err, result) {
                if (err) {
                    console.log('Unable to save new department.');
                }
                console.log('New department saved!');
                repeatQuestions();
                });
        });
    } else if (initialAnswers.directoryList === 'Departments' && initialAnswers.actionList === 'Look up information') {
        connection.query("SELECT * FROM departments", function(err,results) {
            if (err) {
                return 'Unable to display ';
            }
            console.table(results);
            repeatQuestions();
            
        });
    } else if (initialAnswers.directoryList === 'Departments' && initialAnswers.actionList === 'Update information') {
        inquirer.prompt(departmentQuestions[1]).then(function(departmentAnswers) {
            inquirer.prompt(departmentQuestions[2]).then(function(updatedDepartmentAnswer) {
                connection.query("UPDATE departments SET name = ? WHERE id = ?", [updatedDepartmentAnswer.updateDepartment,departmentAnswers.selectDepartment], function(err,results) {
                    if (err) {
                        return 'Unable to update department.';
                    } else {
                    console.log('Department updated!');
                    repeatQuestions();
                    }
                });
            });
        });
        
    }
        
});

}

const repeatQuestions = () => {
    inquirer.prompt(
        [
            {
                type: 'confirm',
                name: 'additionalQueries',
                message: 'Would you like to continue using the employee tracker?'
            }
        ]).then(function(a) {
            if (a.additionalQueries) {
                answerQuestions();
            } else {
                console.log('Thank you for using the employee tracker!');
                process.exit();
            }
        });
    
}

answerQuestions();
