const {accessSecret, refreshSecret, tokenLife} = require("../config")
const jwt = require('jsonwebtoken');



function verifyUser(bearerToken) {
    const token = bearerToken.split(' ')[1]
    // verifying feature
}

function signUser(user) {

    const tokenPayload = {
        sub: user.id,
        name: user.name,
        admin: user.admin
    }

    const token = jwt.sign(tokenPayload, accessSecret, { expiresIn: tokenLife})
    const refreshToken = jwt.sign(tokenPayload, refreshSecret, { expiresIn: tokenLife})

    return {token: token, refreshToken: refreshToken}
}

module.exports = {verifyUser, signUser}