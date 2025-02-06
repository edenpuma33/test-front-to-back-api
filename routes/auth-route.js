const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controllers")

// Middlewares
const { authCheck } = require("../middlewares/auth-middleware")
const { 
    validateWithZod, 
    registerSchema, 
    loginSchema
} = require("../middlewares/validator")

// @ENDPOINT http://localhost:9999/api/register
router.post('/register',validateWithZod(registerSchema), authControllers.register);

router.post("/login",validateWithZod(loginSchema), authControllers.login);

router.get("/current-user", authCheck, authControllers.currentUser)

// export
module.exports = router