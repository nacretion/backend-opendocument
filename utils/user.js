const {accessSecret, refreshSecret, tokenLife} = require("../config")
const jwt = require('jsonwebtoken');
const db = require("../database");



function verifyUser(bearerToken) {
    const token = bearerToken.split(' ')[1]

    const decoded = jwt.decode(token, accessSecret)

    console.log(decoded)
    if (!decoded) return undefined;

    // verifying feature
}

// static async create(login: string, password: string, firstName: string, lastName: string, secondName: string): Promise<User | undefined> {
//     const candidate = await this.findByUsername(login)
//
//
//     if (candidate) {
//         return undefined
//     } else {
//
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//
//         const result = await Database.query(
//             "INSERT INTO users (login, password, first_name, last_name, second_name) VALUES ($1, $2, $3, $4, $5) RETURNING id",
//             [login, hashedPassword, firstName, lastName, secondName]
//         );
//         const id = result.rows[0].id;
//         return new User(id, login, password, firstName, lastName, secondName);
//     }
// }

async function createUser(name, admin = false, login, password) {
    const user = [name, admin, login, password]

    return await db.query("INSERT INTO users(name, admin, login, password) VALUES ($1, $2, $3, $4) returning *", user)

}

async function findByLogin(login) {
    return await db.query("select * from users where login = $1", [login])
}


function signUser(user) {

    const tokenPayload = {
        sub: user.id,
        admin: user.admin
    }

    const token = jwt.sign(tokenPayload, accessSecret, { expiresIn: tokenLife})
    const refreshToken = jwt.sign(tokenPayload, refreshSecret, { expiresIn: tokenLife})

    return {token: token, refreshToken: refreshToken}
}

module.exports = {verifyUser, signUser, createUser, findByLogin}