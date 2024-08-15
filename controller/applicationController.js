import Application from '../model/applicationSchema.js'

class Application{
    static getApplication = async (req, res) => {
        const {id, name, email, phone,address, resume, coverLetter, role,
        } = req.body
    }
}

export default Application