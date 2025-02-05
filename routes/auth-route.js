const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controllers")
const{ validateWithZod, registerSchema, loginSchema } = require("../middlewares/validator")

// @ENDPOINT http://localhost:9999/api/register
router.post('/register',validateWithZod(registerSchema), authControllers.register);
router.post("/login",validateWithZod(loginSchema), authControllers.login);

// export
module.exports = router