const express = require('express');
const { check, validationResult } = require('express-validator');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

const router = express.Router();

//@route    GET api/auth
//@desc     Get authenticated user
//@access   Private
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId, '-password');

    if (!user) {
      return res.status(404).json({ msg: 'User with given id not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

//@route    POST api/auth
//@desc     Authenticate/Login User & get token
//@access   Public
router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    //validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //check if user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      //compare password
      const isMatch = await bycrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      //generate/return jwt if pasword is match
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: '1h'
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
