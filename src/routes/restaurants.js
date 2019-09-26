const router = require("express").Router();
const Restaurants = require("../controllers/restaurants");
const admin = require("../admin");

router.post("/", async (req, res) => {
  const token = req.headers.authorization;

  if (token !== admin()) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  try {
    const restaurant = await Restaurants.create(req.body);

    if (restaurant) {
      res.status(201).json({
        restaurant
      });
    } else {
      res.status(400).json({
        message: "Bad request"
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Internal Server error",
      message: err.message
    });
  }
});

router.get("/", async (_req, res) => {
  try {
    const restaurants = await Restaurants.getAll();

    res.status(200).json({
      restaurants
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message
    });
  }
});

module.exports = router;
