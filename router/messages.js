const { Router } = require('express');
const { validateJWT } = require('../middlewares/validateJWT');
const { getChatMessages } = require('../controllers/messages');

const router = Router();

router.get('/:from', validateJWT, getChatMessages)

module.exports = router;