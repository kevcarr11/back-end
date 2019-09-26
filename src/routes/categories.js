const router = require("express").Router();
const Categories = require("../controllers/categories");
const admin = require("../admin");

router.get("/", async (_, res) => {
  try {
    const categories = await Categories.getAll();

    res.status(200).json({
      categories
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server error",
      message: err.message
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Categories.getById(id);

    if (category) {
      res.status(200).json({
        category
      });
    } else {
      res.status(404).json({
        message: `No category found with the id ${id}`
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Internal Server error",
      message: err.message
    });
  }
});

router.post("/", async (req, res) => {
  const token = req.headers.authorization;

  if (token !== admin()) {
    res.status(401).json({
      message: "You are not an admin"
    });
    return;
  }

  try {
    const category = await Categories.create(req.body);

    res.status(201).json({
      category
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server error",
      message: err.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization;

  if (token !== admin()) {
    res.status(401).json({
      message: "Not authorized"
    });

    return;
  }

  try {
    const didDelete = await Categories.deleteById(id);

    if (didDelete) {
      res
        .status(200)
        .json({ message: `Successfully deleted category with id ${id}` });
    } else {
      res.status(404).json({
        message: "Invalid category id"
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Internal Server error",
      message: err.message
    });
  }
});

module.exports = router;
