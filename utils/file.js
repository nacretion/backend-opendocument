const {rm} = require("fs");

async function removeFile(filename) {

    const removing = await rm("./uploads/" + filename, (err, res) => {
        if (err) throw err
    })

    return 0
}

module.exports = {removeFile}