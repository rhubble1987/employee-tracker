const mysql = require('mysql');

//Add a new department

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Ms6kde3TP.qGtRzmoBUvKCN_",
    database: "directory_db"
  });

function addDepartment(departmentAnswers) {
    connection.query("INSERT INTO departments (name) VALUES (?)", [departmentAnswers], function (err, result) {
        if (err) {
            console.log('Unable to save department.');
        }
        console.log('New department saved!');
        });
} 

exports.addDepartment = addDepartment();


//Update a department

function updateDepartment(departmentAnswers) {
    connection.query("UPDATE departments SET name = ? WHERE id = ?", [departmentAnswers], function (err, result) {
        if (err) {
            console.log('Unable to update department.');
        }
            console.log('Changes saved!');
        });
} 

exports.updateDepartments = updateDepartment();

//View departments

function viewDepartments() {
     connection.query("SELECT * FROM departments", function (err, result) {
        if (err) {
            console.log('Unable to show departments.');
        }

        if (result === null) {
            console.log('There are currently no saved departments.');
        }
                console.table(result);
        });
} 

exports.viewDepartments = viewDepartments();
