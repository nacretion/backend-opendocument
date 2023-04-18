const {signUser, verifyUser} = require("../utils/user");

class DocumentController {

    async saveDocument(request, response) {
        try {
            const token = request.headers.authorization

            if (!token) {
                return response.status(401).json({
                    message: 'Ошибка аутентификации: отсутствует токен'
                });
            }



            const files = request.files
            if (!files) {
                return response.status(400).json({
                    message: 'Ошибка проверки содержимого тела запроса: отсутствует поле template'
                });
            }


            if (files.length !== 1) {
                return response.status(400).json({
                    message: 'Ошибка проверки содержимого тела запроса: слишком много файлов'
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






            // document saving feature
            // signUser({id: 0, name: "nacretion", admin: false})
        }
        catch (e) {
            console.log(e)
            response.status(500).json({message: "Something went wrong. Try again."})
        }
        
    }
}

module.exports = new DocumentController()