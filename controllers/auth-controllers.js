const prisma = require("../configs/prisma");
const createError = require("../utils/createError")
const bcrypt = require("bcryptjs")

exports.register = async(req, res, next) => {
    try {
        // Step 1 req.body
        const{email,firstname,lastname,password,confirmPassword} = req.body

        // Step 2 validate
        // Step 3 Check already
        const checkEmail = await prisma.profile.findFirst({
            where:{
                email
            },
        })
        console.log(checkEmail)
        if(checkEmail){
            return createError(400, "Email is already exist!!!")
        }
        // Step 4 Encrypt bcrypt
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password,salt)
        // console.log(hashedPassword)

        // Step 5 Insert to DB
        const profile = await prisma.profile.create({
            data:{
                email,
                firstname,
                lastname,
                password: hashedPassword
            }
        })
        res.json({message: "hello register"});
    } catch (error) {
        console.log("Step 2 Catch")
        next(error);
    }
        // Step 6 Response
}

exports.login = (req, res, next) => {
    try {
        res.json({message: "hello login"})
    } catch (error) {
        next(error);
    }
}