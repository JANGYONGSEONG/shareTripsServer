const express = require("express");
const router = express.Router();

const path = require('path');

const controller = require('./reports.controller');

const multer = require('multer');
const upload = multer({dest:path.join(__dirname,'../../upload/')});

router.post('/',upload.single('picture'),controller.upload);

module.exports = router;
