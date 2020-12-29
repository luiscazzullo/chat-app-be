const User = require('../models/user');
const Message = require('../models/message');

const userConnected = async (uid) => {
  const user = await User.findById(uid);
  user.online = true;
  await user.save();
  return user;
}

const userDisconnected = async(uid) => {
  const user = await User.findById(uid);
  user.online = false;
  await user.save();
  return user
}

const getUsers = async () => {
  const users = await User.find().sort('-online');
  return users;
}

const saveMessages = async payload => {
  try {
    const message = new Message(payload);
    await message.save();
    return message;
  } catch (error) {
    return false;
  }
}

module.exports = {
  userConnected,
  userDisconnected,
  getUsers,
  saveMessages
}