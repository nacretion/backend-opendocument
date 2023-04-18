
const {dbName, dbHost, dbUser, dbPassword, dbPort} = require('./config')

const Pool = require('pg').Pool

const userTableQuery = 'create table if not exists users(id serial primary key, name text not null, admin boolean default false, login text not null unique, password text not null);'


const connection = new Pool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    port: dbPort
});

connection.query(`DROP DATABASE ${dbName}`, (error, results) => {
    if (error) throw error;

    console.log("Database deleted successfully")

    connection.query(`CREATE DATABASE ${dbName}`, function (error, results) {
        if (error) throw error;

        console.log('Database created successfully');

        const newConnection = new Pool({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbName,
            port: dbPort
        })
        console.log(`Using database: "${dbName}"`);

        newConnection.query(userTableQuery, function (error, results) {
            if (error) throw error;

            console.log('Table "users" created successfully');

            newConnection.end();
            connection.end();
        });
    });
})