const {verifyUser, getId} = require("../utils/user");
const {removeFile, saveFile} = require("../utils/file");

class DocumentController {

    async saveDocument(request, response) {
        try {
            // document saving feature
            const bearerToken = request.headers.authorization

            // Set-Cookie: refreshToken="refreshToken"; SameSite=Strict; Secure; HttpOnly
            const refreshToken = request.cookies.refreshToken

            if (!bearerToken || !refreshToken) {
                return response.status(401).json({
                    message: 'Ошибка аутентификации: отсутствует токен'
                });
            }

            const verified = await verifyUser(bearerToken.split(" ")[1], refreshToken)

            if (!verified) {
                return response.status(401)
                    .cookie("refreshToken", "accessToken", ["", ""])
                    .json({
                        message: 'Ошибка аутентификации: токен недействителен'
                    });
            }

            const files = request.files

            if (!files.length) {
                return response.status(400)
                    .cookie("refreshToken", verified.refreshToken || verified.newRefreshToken)
                    .json({
                        message: 'Ошибка проверки содержимого тела запроса: отсутствует  файл',
                        token: verified.accessToken || verified.newAccessToken
                    });
            }


            const file = files[0]

            if (!file.mimetype || file.mimetype !== 'application/vnd.oasis.opendocument.text') {
                removeFile(file.filename)
                return response.status(400)
                    .cookie("refreshToken", verified.refreshToken || verified.newRefreshToken)
                    .json({
                        message: 'Ошибка проверки содержимого тела запроса: неверный тип MIME файла',
                        token: verified.accessToken || verified.newAccessToken
                    });
            }
            if (file.size === 0) {
                removeFile(file.filename)
                return response.status(400)
                    .cookie("refreshToken", verified.refreshToken || verified.newRefreshToken)
                    .json({
                        message: 'Ошибка проверки содержимого тела запроса: пустой файл',
                        token: verified.accessToken || verified.newAccessToken
                    });
            }

            const description = request.body.description

            if (!description || description.length < 5 || description.length > 255) {
                removeFile(file.filename)
                return response.status(400)
                    .cookie("refreshToken", verified.refreshToken || verified.newRefreshToken)
                    .json({
                        message: 'Ошибка проверки содержимого тела запроса: отсутствует поле description или его длина некорректна',
                        token: verified.accessToken || verified.newAccessToken
                    });
            }

            let userId = await getId(verified.accessToken || verified.newAccessToken)

            const newFile = await saveFile(file, description, userId)

            if (!newFile) {
                removeFile(file.filename)
                return response.status(400)
                    .cookie("refreshToken", verified.refreshToken || verified.newRefreshToken)
                    .json({
                        message: "Ошибка проверки содержимого тела запроса!",
                        token: verified.accessToken || verified.newAccessToken
                    })
            }
            if (newFile === "exists") {
                removeFile(file.filename)
                return response.status(400)
                    .cookie("refreshToken", verified.refreshToken || verified.newRefreshToken)
                    .json({
                        message: "Ошибка сохранения файла",
                        token: verified.accessToken || verified.newAccessToken
                    })
            }

            response.status(200)
                .cookie("refreshToken", verified.refreshToken || verified.newRefreshToken)
                .json({
                    file: newFile,
                    token: verified.accessToken || verified.newAccessToken
                })

        } catch (e) {
            response.status(500).json({message: e.message})
        }

    }
}

module.exports = new DocumentController()