const express = require('express');
const router = express.Router();

const controller = require('./users.controller');

router.get('/:id',controller.show);

router.post('/join',controller.join);

router.post('/login',controller.login);

router.patch('/:id/username',controller.modifyUsername);

router.patch('/:id/email',controller.modifyEmail);

router.patch('/:id/theme', controller.modifyTheme);

router.patch('/:id/country', controller.modifyCountry);

router.delete('/:id',controller.deleteUser);


module.exports = router;
