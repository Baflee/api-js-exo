const express = require('express');

const userCtr = require('../controllers/user');

const router = express.Router();

//Route to register
router.post('/signup', userCtr.createUser);

// Route to log in
router.post('/login', userCtr.logUser);


// Route to fetch all accounts
router.get('/', userCtr.getUsers);

// Route to fetch one account
router.get('/getUser', userCtr.getUser)

// Route to delete one account
router.delete('/', userCtr.deleteUser);

module.exports = router;