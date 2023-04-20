# Getting started with backend-opendocument
## you can test this API following this [link](https::/opendocument.nacretion.space)

## Usage
In the project directory, you should to:

### `npm install`

download all the dependencies for this project

### change database credentials for initialisation

open `config.json` file and change the values of following fields:

#### `dbName`: `"name_of_database"`
#### `dbUser`: `"user_name"`
#### `dbPassword`: `"password"`
#### `dbHost`: `"localhost"` // by default
#### `dbPort`: `5432` // by default

### `npm run init-db`

initialise database using information left on previous step

### `npm test`

check is everything works correctly (see `./tests` dir to see which functionality have been tested)

### `npm start`

to work with API

#### use `postman` or anything else to work with this API


## if you faced any issues, pleace contact nacretion@gmail.com for any questions