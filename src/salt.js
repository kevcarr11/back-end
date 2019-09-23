const bcrypt = require("bcryptjs");

// This allows us to override the salt for testing if it becomes a bottleneck
const salt = () => bcrypt.genSaltSync(Number(process.env.PW_SALT) || 10);

module.exports = salt;
