const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',  // Replace with your host
    user: 'root',       // Replace with your database username
    password: '',  // Replace with your database password
    database: 'mayur_traders_db' // Replace with your database name
});

console.log("connection db");

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
