const {accessSecret, refreshSecret, tokenLife, salt, refreshTokenLife} = require("../config")
const jwt = require('jsonwebtoken');
const db = require("../database");
const {hash} = require("bcrypt");



async function createUser(name, admin = false, login, password) {
    const hashedPassword = await hash(password, salt)

    console.log(hashedPassword)
    const user = [name, admin, login, hashedPassword]

    return await db.query("INSERT INTO users(name, admin, login, password) VALUES ($1, $2, $3, $4) returning *", user)

}

async function findByLogin(login) {
    return await db.query("select * from users where login = $1", [login])
}

async function findById(id) {
    return await db.query("select * from users where id = $1", [id])
}

async function renewToken(refreshToken) {
    // if refresh token valid - create new access + refresh token
    return jwt.verify(refreshToken, refreshSecret, (err, decoded) => {
        if (err) return undefined;
        const newAccessToken =  jwt.sign({id: decoded.id}, accessSecret, {expiresIn: tokenLife})
        const newRefreshToken =  jwt.sign({id: decoded.id}, refreshSecret, {expiresIn: refreshTokenLife})

        return {newAccessToken, newRefreshToken}
    });
}

async function verifyUser(accessToken, refreshToken) {

    // if access token valid - return new access token, else renew token

    const accessValid = jwt.verify(accessToken, accessSecret, (err, decoded) => {
        if (err) return undefined
        return decoded.id
    });

    if (accessValid) return accessToken

    const newToken = await renewToken(refreshToken)

    if (!newToken) return undefined
    return newToken

}

function signUser(user) {

    const tokenPayload = {
        sub: user.id
    }

    const token = jwt.sign(tokenPayload, accessSecret, {expiresIn: tokenLife})
    const refreshToken = jwt.sign(tokenPayload, refreshSecret, {expiresIn: refreshTokenLife})

    return {token: token, refreshToken: refreshToken}
}

module.exports = {signUser, createUser, findByLogin, verifyUser, renewToken}