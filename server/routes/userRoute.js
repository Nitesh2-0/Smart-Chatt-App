const express = require('express');
const router = express.Router();

const { register, login, profile, allUsers } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.post('/setavatar/:id', profile);
router.get('/allUsers/:id', allUsers);

module.exports = router