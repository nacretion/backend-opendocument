const Pool = require("pg").Pool
const {dbName} = require('./config')
export class Database {
    static pool;

    static async connect() {
        if (!Database.pool) {
            Database.pool = new Pool({
                host: 'localhost',
                user: 'postgres',
                password: 'root',
                database: dbName,
                port: 5432
            });
        }
    }

    static query(text, params) {
        Database.connect()
        return Database.pool.query(text, params);
    }


}