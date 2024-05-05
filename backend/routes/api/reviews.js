// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
// ...

const { restoreUser } = require('../../utils/auth');
const { Review, ReviewImage} = require('../../db/models');
const { append } = require('vary');

const router = express.Router();

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .isString()
    .withMessage('Review text is required.'),
  check('stars')
    .exists({ checkFalsy: true }).
    isDecimal({min: 1.0, max: 5.0})
    .withMessage('Stars must be from 1.0 to 5.0'),
  handleValidationErrors
];


router.get('/current', requireAuth, async(req, res) => {
     
  console.log(req.url);
  const { user } = req;
  
  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const usersReviews = await Review.findAll({
     where: {
        userId: safeUser.id
     }
 });
   res.json(usersReviews);
  }
});


router.post('/:reviewId/images', requireAuth, validateReview, async(req, res, next) =>{
  const {reviewId} = req.params;
  const review = await Review.findByPk(reviewId)
  //https://testingtraveler.com/wp-content/uploads/2021/03/review.jpg
  // const review = await Review.findByPk(reviewId)

  if(!review){
    return res.status(401).json({message: "Review couldn't be found"})
  }

  const reviewImage = await ReviewImage.create(
    { 
      url: req.body.url,
      reviewId: parseInt(reviewId)
    }
);
   res.json({"url": reviewImage.url});
});

router.put('/:reviewId', requireAuth, validateReview, async(req, res, next) =>{
    const {reviewId} = req.params;
    const review = await Review.findByPk(reviewId)
    if(!review){
      return res.status(404).json({message: "Review couldn't be found"})
   }
   res.json(spot);
    await review.update(
      { 
        userId: req.body.userId, 
       spotId: req.body.spotId,
       review: req.body.review,
       stars: req.body.stars
      }
  );
  res.json(review);
});

router.delete('/:reviewId', requireAuth, async(req, res) =>{
  const {reviewId} = req.params;
   
  const review = await Review.findByPk(reviewId);
  if(!review){
    return res.status(404).json({message: "Review couldn't be found"})
 }
 res.json(spot);
  review.destroy();

  res.json({"message": "Success! "})

});

module.exports = router;