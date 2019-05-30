const express = require("express");
const router = express.Router();

const path = require('path');

const controller = require('./reports.controller');

const multer = require('multer');
const upload = multer({dest:path.join(__dirname,'../../upload/')});

router.get('/all',controller.showAll);

router.get('/search', controller.search);

router.get('/recommendation/:username', controller.recommend);

router.get('/:username',controller.show);

router.get('/images/:username/:reportID',controller.userImage);

router.get('/images/:reportID',controller.image);

router.post('/',upload.single('picture'),controller.upload);

module.exports = router;
