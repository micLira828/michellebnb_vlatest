// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
// ...

const { restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage} = require('../../db/models');
const { append } = require('vary');

const router = express.Router();

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .isString()
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isFloat({min: 1.0, max: 5.0})
    .withMessage('Stars must be from 1 to 5'),
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
    include: [{model:User, attributes:['id', 'firstName', 'lastName']}, {model: Spot}, {model:ReviewImage, attributes:['id', 'url']}],
     where: {
        userId: safeUser.id
     }
 });

 const result = [];
 for (let review of usersReviews){
   const {stars, User, ReviewImages, ...rest} = await review.toJSON();

   const prettyRes = {User, ReviewImages, ...rest};
   let spot = await Spot.findOne({
    include: [{model: SpotImage}],
     where: {
       id: review.spotId
     }
   });

  
  //  for (let spot of spots){
   const {SpotImages, ...theRest} = await spot.toJSON();
   const spotRes = {...theRest}
   spotRes.previewImage = "image url"
   for (let img of SpotImages){
     if (img.preview === true){
       spotRes.previewImage = img.url
     }
   }
  //  spotResult.push(spotRes);
   prettyRes.Spot = spotRes;
   prettyRes.stars = parseFloat(stars);
  // }
   result.push(prettyRes);
 }//end of for loop

   res.json({"Reviews":result});
  }
});


router.post('/:reviewId/images', requireAuth, async(req, res, next) =>{
  const {reviewId} = req.params;
  
  const review = await Review.findByPk(reviewId)
  //https://testingtraveler.com/wp-content/uploads/2021/03/review.jpg
  // const review = await Review.findByPk(reviewId)

  if(!review){
    return res.status(404).json({message: "Review couldn't be found"})
  }
 
  const userId = req.user.id;
  if(userId !== review.userId){
    return res.status(403).json({message: "Forbidden"})
 }
  const images = await review.getReviewImages();
  console.log(images.length);

  if(images.length > 10){
    res.status(403).json({message: "Maximum number of images for this resource was reached"});
  }

  //a comment

  
  const reviewImage = await ReviewImage.create(
    { 
      url: req.body.url,
      reviewId: reviewId
    }
);
   res.json({"id": reviewImage.id, "url": reviewImage.url});

});

router.put('/:reviewId', requireAuth, validateReview, async(req, res, next) =>{
    const {reviewId} = req.params;
    const review = await Review.findByPk(reviewId)
    if(!review){
      return res.status(404).json({message: "Review couldn't be found"})
   }
   const userId = req.user.id;
   if(userId !== review.userId){
     return res.status(403).json({message: "Forbidden"})
  }
   
    await review.update(
      { 
        userId: req.body.userId, 
        spotId: req.body.spotId,
        review: req.body.review,
        stars: parseFloat(req.body.stars)
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
 const userId = req.user.id;
 if(userId !== review.userId){
  return res.status(403).json({message: "Forbidden"})
}
  review.destroy();

  res.json({message: "Successfully Deleted"})

});

module.exports = router;