const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Yup = require("yup");
const { sanitizeBody } = require("express-validator");

const User = require("../controllers/users");
const secret = require("../secret");
const salt = require("../salt");

const UserSchema = Yup.object({
  firstName: Yup.string().required("Field `firstName` is required"),
  lastName: Yup.string().required("Field `lastName` is required"),
  email: Yup.string()
    .email("Must be a valid email")
    .required("Field `email` is required"),
  city: Yup.number().required("Field `city` is required"),
  password: Yup.string()
    .ensure() // ensure will transform unefined or null into an empty string
    .min(8)
    .max(40)
    .required("Field `password` is required")
});

async function validateUserRegistration(req, res, next) {
  try {
    // Yup will throw an error if any of the validations failed.
    // Right now I just have it returning the first error to the
    // client which might not be the most ergonomic, but all of these
    // validations should be mirrored on the client registration
    // form, so I expect that by the time the input gets to the back-
    // end that it should conform to these anyways.
    await UserSchema.validate(req.body);

    const user = await User.getByEmail(req.body.email);

    if (user) {
      res.status(400).json({
        message: "This email is already registered for an account"
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

router.post(
  "/register",
  [
    validateUserRegistration,
    sanitizeBody(["firstName", "lastName", "email", "city", "password"])
      .trim()
      .escape()
  ],
  async (req, res) => {
    const { password: rawPassword } = req.body;

    const password = bcrypt.hashSync(rawPassword, salt());

    try {
      const user = await User.create({ ...req.body, password });

      const token = jwt.sign({ sub: user.id }, secret(), { expiresIn: "72h" });

      res.status(201).json({
        token
      });
    } catch (err) {
      console.error(err);
    }
  }
);

module.exports = router;
