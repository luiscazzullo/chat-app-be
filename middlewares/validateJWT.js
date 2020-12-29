const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
  try {
    //Traigo el token del header
    const token = req.header('x-token');
    //Si no hay token, arrojo error. Lanzo un 401 porque significa unauthorized
    if(!token) {
      return res.status(401).json({
        ok: false,
        msg: 'No se encontró token'
      })
    }
    //Saco el _id del usuario del token
    const { id } = jwt.verify(token, process.env.JWT_KEY);
    //Añado un campo más a mi Request y llamo req.uid que va a ser igual a la id del usuario.
    req.uid = id;
    
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: 'Token no es válido' });
  }
}

module.exports = {
  validateJWT
}