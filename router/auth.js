const { Router } = require('express');
const { createUser , login, validateToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');
const { check } = require('express-validator');

const router = Router();

router.post('/new', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').isEmail(),
  validateFields
], createUser)

router.post('/', [
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'El password es obligatorio').not().isEmpty(),
  validateFields
], login)

//Revalidar token
router.get('/renew', validateJWT, validateToken)

module.exports = router;