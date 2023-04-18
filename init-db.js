const {dbName} = require('./config')
const Pool = require('pg').Pool

const userTableQuery = 'create table if not exists user(id serial primary key, name integer not null, subordinate_id integer not null);'


const connection = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    port: 5432
});

connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, function (error, results) {
    if (error) throw error;

    console.log('Database created successfully');

    connection.query(`USE ${dbName}`, function (error, results) {
        if (error) throw error;

        console.log(`Using database: ${dbName}`);

        connection.query(userTableQuery, function (error, results) {
            if (error) throw error;

            console.log('Table created successfully');

            connection.end();
        });
    });
});
