const express = require('express');
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

const router = express.Router();

//@route    GET api/profile/me
//@desc     Get current user's profile
//@access   Protected
router.get('/me', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user.' });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
