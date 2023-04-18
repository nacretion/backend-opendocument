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

async function createUser(name, admin = false, login, password) {
    const user = [name, admin, login, password]
    // TODO: hash password

    return await db.query("INSERT INTO users(name, admin, login, password) VALUES ($1, $2, $3, $4) returning *", user)

}

async function findByLogin(login) {
    return await db.query("select * from users where login = $1", [login])
}
async function findById(id) {
    return await db.query("select * from users where id = $1", [id])
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