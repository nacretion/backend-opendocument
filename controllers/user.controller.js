const {signUser, verifyUser, createUser, findByLogin, authUser} = require("../utils/user");
const {compare} = require("bcrypt");


class UserController {

    async create(request, response) {
        try {
            const {name, admin, login, password} = request.body

            if (!name || !login || !password) {
                return response.status(400).json({message: "Blank fields."})
            }

            const candidate = await findByLogin(login)

            if (candidate.rows[0]) {
                return response.status(409).json({message: "Already exists."})
            }


            const result = await createUser(name, admin, login, password)

            if (!result || !result.rows) {
                response.status(500).json({message: "Something went wrong. Try again."})
            }

            const tokens = signUser(result.rows[0])

            console.log(tokens)
            response.status(200).cookie("refreshToken", tokens.refreshToken).json({token: tokens.token})

        }
        catch (e) {
            response.status(500).json({message: "Something went wrong. Try again."})
        }

    }
    async auth(request, response) {
        try {
            const {login, password} = request.body

            if (!login || !password) {
                return response.status(400).json({message: "Blank fields."})
            }

            const candidate = await findByLogin(login)

            if (!candidate.rows[0]) {
                return response.status(404).json({message: "Not exists."})
            }

            if (!compare(password, candidate.rows[0].password)) {
                return response.status(403).json({message: "Password incorrect"})
            }



            const tokens = signUser(candidate.rows[0])

            response.status(200).cookie("refreshToken", tokens.refreshToken).json({token: tokens.token})

        }
        catch (e) {
            response.status(500).json({message: "Something went wrong. Try again."})
        }

    }
}

module.exports = new UserController()