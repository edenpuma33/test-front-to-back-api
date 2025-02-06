const express = require("express")
const router = express.Router()
// Import controller
const userController = require("../controllers/user-controllers")
// Import Middleware
const { authCheck } = require("../middlewares/auth-middleware")

// @ENDPOINT http://localhost:999/api/users 
router.get('/users',authCheck,userController.listUsers)

router.patch('/user/update-role',authCheck,userController.updateRole)

router.delete('/user/:id',authCheck,userController.deleteUser)

module.exports = router