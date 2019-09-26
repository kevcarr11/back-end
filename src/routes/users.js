const router = require("express").Router();
const Users = require("../controllers/users");
const Restaurants = require("../controllers/restaurants");
const jwt = require("jsonwebtoken");
const secret = require("../secret");

function validateLoggedIn(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      message: "Must be logged in"
    });
    return;
  }

  try {
    jwt.verify(token, secret());

    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid token. Log in again"
    });
  }
}

router.get("/restaurants", validateLoggedIn, async (req, res) => {
  try {
    const decoded = jwt.decode(req.headers.authorization);

    const user = await Users.getById(decoded.sub);

    const restaurants = await Restaurants.getRestaurantsByCity(user.city);

    res.status(200).json({
      restaurants
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
});

module.exports = router;
