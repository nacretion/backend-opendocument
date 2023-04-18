const Pool = require("pg").Pool
const {dbName, dbHost, dbUser, dbPassword, dbPort} = require('./config')
class Database {
    static pool;

    async connect() {
        if (!Database.pool) {
            Database.pool = new Pool({
                host: dbHost,
                user: dbUser,
                password: dbPassword,
                database: dbName,
                port: dbPort
            });
        }
    }

    query(text, params) {
        this.connect()
        return Database.pool.query(text, params);
    }


}
module.exports = new Database()