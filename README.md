# Server

## Step 1 create package
```bash
npm init -y
```
## Step 2 install package
```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma
```
```bash
npx prisma init
```

## Step 3 Git
create repo in github.com
```bash
git init
git add .
git commit -m "message"
```
Next step copy code from repo only first time.
```bash
git branch -M main
git remote add origin https://github.com/edenpuma33/test-front-to-back-api.git
git push -u origin main
```

when update code
```bash
git add .
git commit -m "message"
git push
```

## Step 4 update package.json

Add "dev" in package.json file "scripts"

When run server use --> npm run dev
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev" : "nodemon index.js"
  },
```
and code
index.js
```js
const express = require('express');
const app = express();


// Start Server
const PORT = 9999;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```

## Step 5 use middlewares
In index.js file
```js
const express = require('express');
const cors = require("cors")
const morgan = require("morgan")
const app = express();


// Middlewares
app.use(cors()); // Allows cross domain
app.use(morgan("dev")); // Show log terminal
app.use(express.json()); // For read json


// Start Server
const PORT = 9999;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```

## Step 6 Routing & Controller [Register]

### Create folder controllers and auth-controllers.js 
### Create folder routes and auth-route.js 

/controllers/auth-controllers.js
```js
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
        res.json({message: "hello login"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error!!!"})
    }
}
```

/routes/auth-route.js
```js
const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controllers")

// @ENDPOINT http://localhost:9999/api/register
router.post('/register',authControllers.register)
router.post("/login",authControllers.login)

// export
module.exports = router
```



### update index.js
Add Routing
```js
// Import
const express = require('express');
const cors = require("cors")
const morgan = require("morgan")

// Routing
const authRouter = require('./routes/auth-route')

const app = express();

// Middlewares
app.use(cors()); // Allows cross domain
app.use(morgan("dev")); // Show log terminal
app.use(express.json()); // For read json

// Routing
app.use("/api", authRouter);

// Start Server
const PORT = 9999;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

```

## Step 7 Create folder middlewares
/middlewares/error.js
```js
const handleErrors = (err ,req, res, next) => {
    res
    .status(err.statusCode || 500)
    .json({message: err.message || "Something wrong!!!"});
};

module.exports = handleErrors;
```
import handleError in index.js
```js
// Import
const express = require('express');
const cors = require("cors")
const morgan = require("morgan")
const handleErrors = require("./middlewares/error")

// Routing
const authRouter = require('./routes/auth-route')

const app = express();

// Middlewares
app.use(cors()); // Allows cross domain
app.use(morgan("dev")); // Show log terminal
app.use(express.json()); // For read json

// Routing
app.use("/api", authRouter);

// Handle errors
app.use(handleErrors)

// Start Server
const PORT = 9999;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```

