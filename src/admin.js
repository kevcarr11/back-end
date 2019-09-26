function admin() {
  return process.env.ADMIN_PW || '1234'
}

module.exports = admin;
