const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controllers")

// @ENDPOINT http://localhost:9999/api/register
router.post('/register',authControllers.register)
router.post("/login",authControllers.login)

// export
module.exports = router