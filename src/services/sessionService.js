import bcrypt from 'bcrypt'
import { getDAOS } from "../models/DAO/indexDAO.js";
const { usersDao } = getDAOS();


class userService {
    static async createUser(data) {
        try {
            data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10))
            const result = await usersDao.createUser(data)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getUser(email) {
        try {
            console.log(email)
            const result = await usersDao.getUsersByEmail(email)

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getId(id) {
        try {

            const result = await usersDao.getUserById(id)

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async updateUser(email, updatedUser) {
        try {

            const result = await usersDao.updateUser(email,updatedUser)

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
}
export default userService;