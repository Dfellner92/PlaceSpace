const express = require('express');
const validator = require('express-validator');


const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express();


// *remember* " /: " gets priority of route order 
// ALSO DO NOT DESTRUCTURE, just want to point at functions 
// (destructuring will cause them to run)

router.get('/', usersControllers.getUsers);

router.post(
    '/signup', 
    fileUpload.single('image'),
    [
        validator.check('name')
            .not()
            .isEmpty(),
        validator.check('email')
            .normalizeEmail()
            .isEmail(),
        validator.check('password')
            .isLength({ min: 6 })
    ],
    usersControllers.signup
);

router.post('/login', usersControllers.login);

module.exports = router;