const secret = () => process.env.JWT_SECRET || "areallybadsecret";

module.exports = secret;
