const {signUser, verifyUser, verifyToken, getId} = require("../utils/user");
const {removeFile, saveFile} = require("../utils/file");

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
                    message: 'Ошибка аутентификации: токен недействителен'
                });
            }

            const files = request.files
            if (!files) {
                return response.status(400).json({
                    message: 'Ошибка проверки содержимого тела запроса: отсутствует  файл'
                });
            }


            const file = files[0]

            if (file.mimetype !== 'application/vnd.oasis.opendocument.text') {
                removeFile(file.filename)
                return response.status(400).json({
                    message: 'Ошибка проверки содержимого тела запроса: неверный тип MIME файла'
                });
            }
            if (file.length === 0) {
                removeFile(file.filename)
                return response.status(400).json({
                    message: 'Ошибка проверки содержимого тела запроса: пустой файл'
                });
            }

            const description = request.body.description

            if (!description || description.length < 5 || description.length > 255) {
                removeFile(file.filename)
                return response.status(400).json({
                    message: 'Ошибка проверки содержимого тела запроса: отсутствует поле description или его длина некорректна'
                });
            }

            let userId = 0;

            if (verified.accessToken) {
                userId = await getId(verified.accessToken)
            } else {
                userId = await getId(verified.newAccessToken)
            }
            console.log(file.mimetype, file.size, file.originalname, file.filename, "./uploads/", description, userId)
            const newFile = await saveFile(file, description, userId)

            if (!newFile) {

                return verified.accessToken?
                    response.status(400)
                        .cookie("refreshToken", verified.refreshToken)
                        .json({
                            message: "Ошибка сохранения файла",
                            newAccessToken: verified.accessToken
                        })

                    : response.status(400)
                        .cookie("refreshToken", verified.newRefreshToken)
                        .json({
                            message: "Ошибка сохранения файла",
                            newAccessToken: verified.newAccessToken
                        })
            }
            console.log(newFile)


            return verified.accessToken?
                response.status(200)
                    .cookie("refreshToken", verified.refreshToken)
                    .json({
                        newAccessToken: verified.accessToken
                    })

                : response.status(200)
                    .cookie("refreshToken", verified.newRefreshToken)
                    .json({
                        newAccessToken: verified.newAccessToken
                    })
        }
        catch (e) {
            console.log(e)
            response.status(500).json({message: "Something went wrong. Try again."})
        }
        
    }
}

module.exports = new DocumentController()