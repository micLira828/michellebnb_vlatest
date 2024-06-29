const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');


const router = express.Router();

// backend/routes/api/users.js
// ...
const validateSignup = [
  check('firstName')
  .isString()
  .withMessage('First Name must be a string')
  .notEmpty()
  .withMessage('First Name is required'),
  check('lastName')
  .isString()
  .withMessage('Last Name must be a string')
  .notEmpty()
  .withMessage('Last Name is required'),
  check('email')
    .exists({ checkFalsy: true })
    //.isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),

  handleValidationErrors
];

// backend/routes/api/users.js
// ...

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    
    
    const userWithExistingEmail = await User.findOne({where: {email: email}});

    const userWithExistingUserName = await User.findOne({where: {username: username}});

    if(userWithExistingEmail){
      res.status(500).json({message: "User already exists", errors: {email:  "User with that email already exists"}});
    }

    if(userWithExistingUserName){
      res.status(500).json({message: "User already exists", errors: {username:  "User with that username already exists"}});
    }
///Made another comment for another commit
    const user = await User.create({firstName, lastName, email, username, hashedPassword });
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);



module.exports = router;