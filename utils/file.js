const {rm} = require("fs");
const db = require("../database");


async function removeFile(filename) {
    await rm("./uploads/" + filename, (err, res) => {
        if (err) throw err
    })
}


// - Имя MIME типа файла
// - Размер файла в байтах
// - Оригинальное имя файла
// - Имя файла в хранилище файловой системы
// - Сведения о месте размещения файла в хранилище файловой системы (относительный путь)
// - Данное пользователем описание из поля description тела данных запроса
// - Сведения о дате загрузки файла
// - Сведения о пользователе, загрузившем файл

async function saveFile(file, description, userId) {


    // TODO: Проверить, существует ли файл (содержимое, описание)

    const result = await db.query("INSERT INTO files(mime_type, size, original_name, stored_name, storage_location, description, user_id) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [file.mimetype, file.size, file.originalname, file.filename, "./uploads/", description, userId]
    )
    if (result.rows[0]) return result.rows[0]
    else return undefined

}

module.exports = {removeFile, saveFile}