const express = require('express');
const router = express.Router();

const controller = require('./users.controller');

router.get('/:id',controller.show);

router.post('/join',controller.join);

router.post('/login',controller.login);

router.put('/',controller.update);

router.patch('/:id',controller.modify);

router.delete('/:id',controller.destroy);

module.exports = router;
