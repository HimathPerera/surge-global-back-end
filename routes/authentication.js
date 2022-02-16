const express = require('express');
const { check } = require('express-validator')
const authenticationController = require('../controllers/authentication.controller')

const router = express.Router();

router.post('/signIn',authenticationController.signIn)
router.post('/signUp',[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})
],authenticationController.signUp)

module.exports = router; 