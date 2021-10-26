// Import inquirer and mysql2
const inquirer = require('inquirer');
const mysql = require('mysql2');

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
        user: 'root',
        // MySQL password
        password: 'justchuck',
        database: 'company_db'
    },
    console.log(`Connected to the books_db database.`)
);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
    
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
                db.query('SELECT * FROM department');
                startAgain();
            break;

            // Show all roles
            case 'view all roles':
                db.query('SELECT * FROM role');
                startAgain();
            break;

            // Show all employees
            case 'view all employees':
                db.query('SELECT * FROM employee');
                startAgain();
            break;

            // Add a department
            case 'add a department':
                // add a department
                startAgain();
            break;

            // Add a role
            case 'add a role':
                // add a role
                startAgain();
            break;

            // Add an employee
            case 'add an employee':
                // add an employee
                startAgain();
            break;

            // Update an employee's role
            case "update an employee's role":
                // prompt user for which employee they would like to update
                // prompt user for which role they would now like the employee to have
                startAgain();
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

    });
    // if yes run the function 'start()'
    // if no break out of the function 'start'
}

start();
