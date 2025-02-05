# Server

## Step 1 create package
### in Terminal
```bash
npm init -y
```
## Step 2 install package
### in Terminal
```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma
```
```bash
npx prisma init
```

## Step 3 Git
create repo in github.com
### in Terminal
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
### packgage.json
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev" : "nodemon index.js"
  },
```

### index.js
```js
const express = require('express');
const app = express();


// Start Server
const PORT = 9999;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```

## Step 5 use middlewares
In index.js file
### index.js
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

Create folder controllers and auth-controllers.js 

Create folder routes and auth-route.js 

/controllers/auth-controllers.js

### auth-controllers.js
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

### auth-route.js
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
### index.js
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

### error.js
```js
const handleErrors = (err ,req, res, next) => {
    res
    .status(err.statusCode || 500)
    .json({message: err.message || "Something wrong!!!"});
};

module.exports = handleErrors;
```
import handleError in index.js and use function handleError

### index.js
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

|METHOD|ENDPOINT|BODY|
|------|--------|----|
|POST|/api/register| email,password

## Step 8 Create folder utils
/utils/createError.js
### createError.js
```js
const createError = (code, message) => {
    console.log("Step 1 Create error");
    const error = new Error(message);
    error.statusCode = code;
    throw error;
};

module.exports = createError;
```

update auth-controllers

Import createError

### auth-controllers
```js
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
        res.json({message: "hello login"})
    } catch (error) {
        next(error);
    }
}
```

## Step 9 Use zod
import zod in /routes/auth-route.js

create registerSchema,loginSchema

create validateWithZod

update router

### auth-route.js
```js
const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controllers")

const { z } = require("zod")
// npm i zod
// TEST validator
exports.registerSchema = z.object({
    email: z.string().email("Email is error"),
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

// @ENDPOINT http://localhost:9999/api/register
router.post('/register',validateWithZod(registerSchema), authControllers.register);
router.post("/login",validateWithZod(loginSchema), authControllers.login);

// export
module.exports = router
```

## Step 10 Validate with zod
/middlewares/validator.js

move root code from /routes/auth-route.js ==> /middlewares/validator.js

### validator.js
```js
const { z } = require("zod")
// npm i zod
// TEST validator
exports.registerSchema = z.object({
    email: z.string().email("Email is error"),
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
```


### auth-route.js
```js
const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controllers")
const{ validateWithZod, registerSchema, loginSchema } = require("../middlewares/validator")

// @ENDPOINT http://localhost:9999/api/register
router.post('/register',validateWithZod(registerSchema), authControllers.register);
router.post("/login",validateWithZod(loginSchema), authControllers.login);

// export
module.exports = router
```

## Step 11 Change .env and schema.prisma

### .env

change DATABASE_URL

postgresql to mysql
```json
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="mysql://root:puma32442@localhost:3306/landmark"
```


### schema.prisma
change postgresql to mysql
```json
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## Step 12 add data model in schema.prisma
### schema.prisma
```json
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Profile {
  id        Int      @id @default(autoincrement())
  email     String
  firstname String
  lastname  String
  role      Role     @default(USER)
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

## Step 13 send schema.rpisma to mysql
### in Terminal

```json
npx prisma db push
```
or 
```json
npx prisma migrate dev --name init
```

## Step 14 Create folder configs

/configs/prisma.js
### prisma.js

```js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient

module.exports = prisma;
```

## Step 15 Update auth-controllers

import bcrypt

update function register

check email

```js
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
```