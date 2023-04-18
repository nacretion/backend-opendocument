const {signUser} = require("../utils/user");

class DocumentController {

    async saveDocument(request, response) {
        try {
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