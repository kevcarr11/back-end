const router = require("express").Router();
const Users = require("../controllers/users");
const Restaurants = require("../controllers/restaurants");
const Passport = require("../controllers/passport");
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

    const restaurants = await Restaurants.getRestaurantsByCity(
      user.city,
      decoded.sub
    );

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

router.get("/visits", validateLoggedIn, async (req, res) => {
  try {
    const decoded = jwt.decode(req.headers.authorization);

    const visits = await Passport.getAllVisitsForUser(decoded.sub);

    res.status(200).json({
      visits
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
});

router.post("/visit/:id", validateLoggedIn, async (req, res) => {
  try {
    const decoded = jwt.decode(req.headers.authorization);

    const hasVisited = await Passport.getVisitById(decoded.sub, req.params.id);

    if (hasVisited) {
      res.status(400).json({
        message: "User has already visited"
      });

      return;
    }

    const success = await Passport.visit(decoded.sub, req.params.id);

    if (success) {
      res.status(201).json({
        message: "Successfully visited"
      });
    } else {
      res.status(500).json({
        error: "Internal Server error",
        message: err.message
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
});

router.delete("/visit/:id", validateLoggedIn, async (req, res) => {
  try {
    const decoded = jwt.decode(req.headers.authorization);
    const success = await Passport.removeVisit(decoded.sub, req.params.id);

    if (success) {
      res.status(200).json({
        message: "Successfully deleted visit"
      });
    } else {
      res.status(500).json({
        error: "Internal Server error",
        message: err.message
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
});

module.exports = router;
