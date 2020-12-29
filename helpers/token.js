const jwt = require('jsonwebtoken');

const generateJWT = (id) => {
  return new Promise((resolve, reject) => {
    const payload = { id };
    jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: '24h'
    }, (error, token) => {
      if(error) {
        console.log(error)
        reject('No se pudo generar el token')
      } else {
        resolve(token);
      }
    })
  })
}

const checkToken = (token = '') => {
  try {
    const { id } = jwt.verify(token, process.env.JWT_KEY);
    return [true, id]
  } catch (error) {
    return [false, null]
  }
}

module.exports = {
  generateJWT,
  checkToken
}