const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/token');



const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Reviso si el email existe, si existe arrojo un error
    const emailExist = await User.findOne({ email });
    if(emailExist) {
      return res.status(400).json({ ok: false, msg: 'La cuenta de email no es correcta' });
    }
    //Si no existe, genero un nuevo usuario y le paso los datos del body
    const user = new User(req.body);
    //Creo el salt para el hasheo
    const salt = bcrypt.genSaltSync(10);
    //Genero la password con el passworld del body y el salt
    user.password = bcrypt.hashSync(password, salt);
    //Guardo el usuario en base de datos
    await user.save();
    //Genero el token
    const token = await generateJWT(user._id);

    res.json({
      ok: true,
      user,
      token
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const login = async (req, res) => {
  //Me voy a loguear con email y password así que los extraigo del body
  const { email, password } = req.body;
  try {
    //Busco al usuario en la base de datos
    const userDB = await User.findOne({ email });
    //Si no hay usuario, arrojo un 404
    if(!userDB) {
      return res.status(404).json({ ok: false, msg: 'El usuario no fue encontrado' });
    }
    //Valido el password
    const validPassword = bcrypt.compareSync(password, userDB.password);
    //Si el password no es correcto, arrojo un error
    if(!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'El password no es correcto'
      })
    }
    //Acá recién comienzo a generar el token, lo genero con la id.
    const token = await generateJWT(userDB._id);
    
    res.json({
      ok: true,
      user: userDB,
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Hable con el administrador'})
  }

}

const validateToken = async (req, res) => {
  //Extraigo el id del request
  const uid = req.uid;
  //Vuelvo a generar un token con el id del usuario
  const token = await generateJWT(uid);
  //Encuentro al usuario
  const user = await User.findById({ _id: uid });
  //Listo, envío todos los datos.
  res.json({
    ok: true,
    user,
    token
  })
}

module.exports = {
  createUser,
  login,
  validateToken
}