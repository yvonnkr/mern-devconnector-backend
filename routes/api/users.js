const express = require('express');
const { check, validationResult } = require('express-validator');

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
  (req, res) => {
    //validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    res.status(201).json({ user: req.body });
  }
);

module.exports = router;
