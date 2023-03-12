const { userRegister, userLogin } = require('../controller/authController');

const router = require('express').Router();

router.post('/user-register', userRegister);
router.post('/user-login', userLogin);

module.exports = router;