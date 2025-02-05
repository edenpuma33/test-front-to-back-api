const handleErrors = (err ,req, res, next) => {
    console.log("Step 3 Handle Error")
    res
    .status(err.statusCode || 500)
    .json({message: err.message || "Something wrong!!!"});
};

module.exports = handleErrors;