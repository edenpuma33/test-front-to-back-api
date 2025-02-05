const { z } = require("zod")
// npm i zod
// TEST validator
exports.registerSchema = z.object({
    email: z.string().email("Email is invalid"),
    firstname: z.string().min(3,"Firstname must be more than 3 character"),
    lastname: z.string().min(3,"Lastname must be more than 3 chareacter"),
    password: z.string().min(6, "Password must be more than 6 character"),
    confirmPassword: z.string().min(6, "Confirm Password must be more than 6 character")
}).refine((data)=>data.password === data.confirmPassword,{
    message:"Confirm Password not match",
    path:["confirmPassword"]
})

exports.loginSchema = z.object({
    email: z.string().email("Email is error"),
    password: z.string().min(6, "Password must be more than 6 character"),
})


exports.validateWithZod = (schema) => (req, res ,next) =>{
    try {
        console.log("Hello middleware")
        schema.parse(req.body)
        next();
    } catch (error) {
        const errMsg = error.errors.map((item)=>item.message)
        const errTxt = errMsg.join(",")
        const mergeError = new Error(errTxt)
        next(mergeError);
    }
};