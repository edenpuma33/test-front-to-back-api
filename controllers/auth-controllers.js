exports.register = (req, res, next) => {
    try {
        res.json({message: "hello register"});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error!!!"});
    }
}

exports.login = (req, res, next) => {
    try {
        console.log(xxx)
        res.json({message: "hello login"})
    } catch (error) {
        console.log(error)
        next(error)
    }
}