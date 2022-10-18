const express = require('express');
const auth = require('../middleware/auth');
const userCtr = require('../controllers/user');

const router = express.Router();

//Route to register
router.post('/signup', userCtr.createUser);

// Route to log in
router.post('/login', userCtr.logUser);

// Modify an account
router.patch('/', auth, userCtr.modifyUser);

// Route to fetch all accounts
router.get('/', auth, userCtr.getUsers);

// Route to fetch one account
router.get('/getUser', auth, userCtr.getUser)

// Route to delete one account
router.delete('/', auth, userCtr.deleteUser);

module.exports = router;