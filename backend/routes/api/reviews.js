// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Review, ReviewImage} = require('../../db/models');
const { append } = require('vary');

const router = express.Router();

router.get('/current', async(req, res) => {
     
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


router.post('/:reviewId/images', async(req, res, next) =>{
  const {reviewId} = req.params;
  //https://testingtraveler.com/wp-content/uploads/2021/03/review.jpg
  // const review = await Review.findByPk(reviewId)
  const reviewImage = await ReviewImage.create(
    { 
      url: req.body.url,
      reviewId: parseInt(reviewId)
    }
);
   res.json({"url": reviewImage.url});
});

router.put('/:reviewId', async(req, res, next) =>{
    const {reviewId} = req.params;
    const review = await Review.findByPk(reviewId)
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

router.delete('/:reviewId', async(req, res) =>{
  const {reviewId} = req.params;

  const review = await Review.findByPk(reviewId);

  review.destroy();

  res.json({"message": "Success! "})

});

module.exports = router;