import passport from "passport";
import { ERROR, SUCCESS } from "../commons/errorMessages.js";
import { generateToken, checkUser, isValidPassword } from "../utils/helpers.js";

const roleAuth = (strategy, adminRequired) => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (error, user, info) => {
            if (error) {
                return next(error);
            }
            if (user) {
                if (user._doc.role !== 'ADMIN' && adminRequired === true) {
                    throw new Error(ERROR.ADMIN_ACTION_REQUIRED);
                } else if (user._doc.role !== 'USER' && adminRequired === false) {
                    throw new Error(ERROR.USER_ACTION_REQUIRED);
                }
                // Add success message if needed
                // res.status(200).send({ status: "success", message: adminRequired ? SUCCESS.ADMIN_ACTION_ALLOWED : SUCCESS.USER_ACTION_ALLOWED });
            }

        }
        )(req, res, next);
    };
};

export default roleAuth;
