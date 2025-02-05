const createError = require("../utils/createError")

exports.register = (req, res, next) => {
    try {
        // Step 1 req.body
        const{email,firstname,lastname,password,confirmPassword} = req.body

        // Step 2 validate
        if(!email){
            return createError(400, "Email is require!!!")
        }
        if(!firstname){
            return createError(400, "firstname is require!!!")
        }

        // Step 3 Check already
        // Step 4 Encrypt bcrypt
        // Step 5 Insert to DB
        // Step 6 Response
        res.json({message: "hello register"});
    } catch (error) {
        console.log("Step 2 Catch")
        next(error);
    }
}

exports.login = (req, res, next) => {
    try {
        console.log(xxx)
        res.json({message: "hello login"})
    } catch (error) {
        next(error);
    }
}