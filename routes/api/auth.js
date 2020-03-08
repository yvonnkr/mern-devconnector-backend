const express = require('express');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

const router = express.Router();

//@route    GET api/auth
//@desc     Get auth user
//@access   Protected
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

module.exports = router;
