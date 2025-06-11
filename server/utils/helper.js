const bcrypt = require("bcrypt");

const generateRandomNumber = () => {
  return Math.floor(1000 + Math.random() * 9000);
};
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
module.exports = { generateRandomNumber, hashPassword };
