const express = require('express');
const auth = require('../middleware/auth');
const userCtr = require('../controllers/user');

const router = express.Router();

router.post('/signup', userCtr.createUser);

router.post('/login', userCtr.logUser);

router.patch('/', auth.isUserIsHimselfOrAdmin, userCtr.modifyUser);

router.get('/', auth.isUserConnected, userCtr.getUsers);

router.get('/:id', auth.isUserConnected, userCtr.getUser)

router.delete('/', auth.isUserIsHimselfOrAdmin, userCtr.deleteUser);

module.exports = router;