const {signUser, verifyUser, verifyToken} = require("../utils/user");

class DocumentController {

    async saveDocument(request, response) {
        try {
            // document saving feature
            const bearerToken  = request.headers.authorization
            const refreshToken  = request.cookies.refreshToken

            if (!bearerToken || !refreshToken) {
                return response.status(401).json({
                    message: 'Ошибка аутентификации: отсутствует токен'
                });
            }

            const verified = await verifyUser(bearerToken.split(" ")[1], refreshToken)

            if (!verified) {
                return response.status(401).json({
                    message: 'Ошибка аутентификации: отсутствует токен'
                });
            }
            console.log(verified)

            const files = request.files
            if (!files) {
                return response.status(400).json({
                    message: 'Ошибка проверки содержимого тела запроса: отсутствует поле template'
                });
            }


            const file = files[0]

            if (file.mimetype !== 'application/vnd.oasis.opendocument.text') {
                return response.status(400).json({
                    message: 'Ошибка проверки содержимого тела запроса: неверный тип MIME файла'
                });
            }

            const description = request.body.description

            if (!description || description.length < 5 || description.length > 255) {
                return response.status(400).json({
                    message: 'Ошибка проверки содержимого тела запроса: отсутствует поле description или его длина некорректна'
                });
            }






            response.status(200).cookie("refreshToken", verified.newRefreshToken).json({newAccessToken: verified.newAccessToken})
        }
        catch (e) {
            console.log(e)
            response.status(500).json({message: "Something went wrong. Try again."})
        }
        
    }
}

module.exports = new DocumentController()