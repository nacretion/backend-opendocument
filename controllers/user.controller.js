const {signUser, verifyUser, createUser, findByLogin} = require("../utils/user");


class UserController {

    async createUser(request, response) {
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

            // signUser({id: 0, name: "nacretion", admin: false})
        }
        catch (e) {
            console.log(e)
            response.status(500).json({message: "Something went wrong. Try again."})
        }

    }
}

module.exports = new UserController()