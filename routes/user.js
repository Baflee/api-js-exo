const express = require('express');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const userCtr = require('../controllers/user');

const router = express.Router();

router.post('/signup', userCtr.createUser);

router.post('/login', userCtr.logUser);

router.patch('/', authAdmin, userCtr.modifyUser);

router.get('/', auth, userCtr.getUsers);

router.get('/:id', auth, userCtr.getUser)

router.delete('/', authAdmin, userCtr.deleteUser);

module.exports = router;