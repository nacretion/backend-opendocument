
const {dbName, dbHost, dbUser, dbPassword, dbPort} = require('./config')

const Pool = require('pg').Pool

// table users содержит следующие поля:
// _________________________________________
// - Имя пользователя
// - Сведения о наличии прав администратора
// - Логин пользователя
// - Пароль пользователя
// _________________________________________
//  | | | | | | | | | | | | | | | | | | | |
//  | | | | | | | | | | | | | | | | | | | |
//  V V V V V V V V V V V V V V V V V V V V
const userTableQuery = 'create table if not exists users(id serial primary key, name text not null, admin boolean default false, login text not null unique, password text not null);'


// table files содержит следующие поля:
// _____________________________________________________________________________________
// - Имя MIME типа файла
// - Размер файла в байтах
// - Оригинальное имя файла
// - Имя файла в хранилище файловой системы
// - Сведения о месте размещения файла в хранилище файловой системы (относительный путь)
// - Данное пользователем описание из поля description тела данных запроса
// - Сведения о дате загрузки файла
// - Сведения о пользователе, загрузившем файл
// _____________________________________________________________________________________
//  | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |
//  | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |
//  V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V
const filesTableQuery = 'CREATE TABLE IF NOT EXISTS files (id SERIAL PRIMARY KEY, mime_type VARCHAR(255) NOT NULL, size BIGINT NOT NULL, original_name VARCHAR(255) NOT NULL, stored_name VARCHAR(255) NOT NULL, storage_location VARCHAR(255) NOT NULL, description VARCHAR(255), upload_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, user_id INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);'


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

        });
        newConnection.query(filesTableQuery, function (error, results) {
            if (error) throw error;

            console.log('Table "files" created successfully');

            newConnection.end();
            connection.end();
        });
    });
})