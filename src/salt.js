// This allows us to override the salt for testing if it becomes a bottleneck
const salt = () => process.env.PW_SALT || 12;

module.exports = salt;
