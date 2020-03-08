const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bycrypt = require('bcryptjs');

const User = require('../../models/User');

const router = express.Router();

//@route    POST api/users
//@desc     Register User
//@access   Public
router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check(
      'password',
      'Please enter a valid password min 6 characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    //validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user with this email already exists' }] });
      }

      //get user gravatar
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

      //encrypt password
      const hashedPassword = await bycrypt.hash(password, 12);

      //create/save user
      user = new User({ name, email, password: hashedPassword, avatar });

      await user.save();

      res.status(201).json({ message: 'User Created', user });

      //return jwt
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
