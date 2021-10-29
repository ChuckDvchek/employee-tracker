// Import inquirer and mysql2
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

// Importing and setting up server requirements
const PORT = process.env.PORT || 6120;
const express = require('express');
const app = express();

// Middleware for server to accept json and urlencoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: process.env.DB_USER,
        // MySQL password
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
);

app.listen(PORT, () => {});
    
// Function to start the command-line application
const start = () => {

    // Promt user for what they want to do
    inquirer.prompt({
            // Type of promt
            type: 'list',
            // Message for the user
            message: 'What would you like to do?',
            // Variable name for their answer
            name: 'choice',
            // Possible choices for the user
            choices: ['view all departments','view all roles','view all employees','add a department','add a role','add an employee',"update an employee's role"]
    }).then( ans => {
        // Listen for what they want to do and continue accordingly
        switch(ans.choice){
            // Show all departments
            case 'view all departments':
                db.query('SELECT * FROM department;', (err, results) => {
                    if(err){
                        throw err;
                    } else {
                        if(!results.length){
                            console.log("Sorry, but there are no departments");
                        } else {    
                            console.table(results);
                        }
                        startAgain();
                    }
                });
            break;

            // Show all roles
            case 'view all roles':
                db.query('SELECT * FROM role;', (err, results) => {
                    if(err){
                        throw err;
                    } else {
                        if(!results.length){
                            console.log("Sorry, but there are no roles");
                        } else {    
                            console.table(results);
                        }
                        startAgain();
                    }
                });
            break;

            // Show all employees
            case 'view all employees':
                db.query('SELECT * FROM employee;', (err, results) => {
                    if(err){
                        throw err;
                    } else {
                        if(!results.length){
                            console.log("Sorry, but there are no employees");
                        } else {    
                            console.table(results);
                        }
                        startAgain();
                    }
                });
            break;

            // Add a department
            case 'add a department':
                inquirer.prompt({
                    type: 'input',
                    message: 'What is the name of the department?',
                    name: 'department'
                }).then( ans => {
                    db.query("INSERT INTO department (name) VALUES (?);", ans.department, (err,results) => {
                        if(err){
                            throw err;
                        } else {
                            console.log('Department added!');
                            startAgain();
                        }
                    });
                });
            break;

            // Add a role
            case 'add a role':
                const listOfDepartments = [];
                db.query('SELECT * FROM department;',(err,results) =>{
                    for (let i = 0; i < results.length; i++) {
                        listOfDepartments.push(results[i].name);
                    }
                });
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'What is the name of the role?',
                        name: 'role'
                    },
                    {
                        type: 'input',
                        message: 'What is the salary of the role?',
                        name: 'salary'
                    },
                    {
                        type: 'list',
                        message: 'What department does the role belong to?',
                        name: 'department',
                        choices: listOfDepartments
                    }
                ]).then( ans => {
                    let deptId;
                    db.query("SELECT id FROM department WHERE (name=?);",ans.department,(err,results) => {
                        if(err){
                            throw err;
                        } else {
                            deptId = results[0].id;
                            db.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?);", [ans.role,ans.salary,deptId], (err,results) => {
                                if(err){
                                    throw err;
                                } else {
                                    console.log('Role added!');
                                    startAgain();
                                }
                            });
                        }
                    });
                });
            break;

            // Add an employee
            case 'add an employee':
                const empRoles = [];
                db.query('SELECT * FROM role;',(err,results) =>{
                    // console.log(results);
                    for (let i = 0; i < results.length; i++) {
                        empRoles.push(results[i].title);
                    }
                    const employees = [];
                    db.query('SELECT * FROM employee;',(err,results) =>{
                        for (let i = 0; i < results.length; i++) {
                            employees.push(results[i].first_name + " " + results[i].last_name + " || id: " + results[i].id);
                        }
                        employees.push("this employee doesn't have a manager");
                        inquirer.prompt([
                            {
                                type: 'input',
                                message: 'What is the first name of the employee?',
                                name: 'firstName'
                            },
                            {
                                type: 'input',
                                message: 'What is the last name of the employee?',
                                name: 'lastName'
                            },
                            {
                                type: 'list',
                                message: 'What role does this employee have?',
                                name: 'role',
                                choices: empRoles
                            },
                            {
                                type: 'list',
                                message: "Who is this employee's manager?",
                                name: 'manager',
                                choices: employees
                            }
                        ]).then( ans => {
                            const manager = ans.manager.split(' ');
                            let manId;
                            if(manager[manager.length-1] === "manager"){
                                manId = null;
                            } else {
                                manId = manager[manager.length-1];
                            }
        
                            db.query("SELECT id FROM role WHERE (title=?);",ans.role,(err,results) => {
                                if(err){
                                    throw err;
                                } else {
                                    const roleId = results[0].id;
                                    db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);", [ans.firstName,ans.lastName,roleId,manId], (err,results) => {
                                        if(err){
                                            throw err;
                                        } else {
                                            console.log('Employee added!');
                                            startAgain();
                                        }
                                    });
                                }
                            });
                        });
                    });
                });
            break;

            // Update an employee's role
            case "update an employee's role":
                const employees = [];
                db.query('SELECT * FROM employee;',(err,results) =>{
                    for (let i = 0; i < results.length; i++) {
                        employees.push(results[i].first_name + " " + results[i].last_name + " || id: " + results[i].id);
                    }
                    const roles = [];
                    db.query('SELECT * FROM role;',(err,results) =>{
                        for (let i = 0; i < results.length; i++) {
                            roles.push(results[i].title + " || id: " + results[i].id);
                        }
                        inquirer.prompt([
                            {
                                type: 'list',
                                message: "Which employee's role would you like to update?",
                                name: 'employee',
                                choices: employees
                            },
                            {
                                type: 'list',
                                message: "What role would you like the employee to now have?",
                                name: 'newRole',
                                choices: roles
                            }
                        ]).then( ans => {
                            const empArr = ans.employee.split(' ');
                            const empId = empArr[empArr.length - 1];
                            const roleArr = ans.newRole.split(' ');
                            const roleId = roleArr[roleArr.length - 1];
                            db.query("UPDATE employee SET role_id=? WHERE id = ?;", [roleId,empId], (err,results) => {
                                if(err){
                                    throw err;
                                } else {
                                    console.log('Employee Updated!');
                                    startAgain();
                                }
                            });
                        });
                    });
                });
            break;
        }
    });
}

const startAgain = () => {
    // promt if they want to continue
    inquirer.prompt({
        type: 'list',
        message: 'Would you like to continue?',
        name: 'choice',
        choices: ['yes','no']
    }).then( ans => {
        if(ans.choice == 'yes'){
            start();
        }
    });
    // if yes run the function 'start()'
    // if no break out of the function 'start'
}

start();
