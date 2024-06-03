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
    .isInt({min: 1.0, max: 5.0})
    .withMessage('Stars must be an integer from 1 to 5'),
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
   const {stars, User, createdAt, updatedAt, ReviewImages, ...rest} = await review.toJSON();

   const prettyRes = {stars, User, ReviewImages, ...rest};
   let spot = await Spot.findOne({
    include: [{model: SpotImage}],
     where: {
       id: review.spotId
     }
   });

  
  //  for (let spot of spots){
   const {id, ownerId, address, city, state, country, lat, lng, name, price, SpotImages} = await spot.toJSON();
   const spotRes = {id, ownerId, address, city, state, country, lat, lng, name, price}
   spotRes.lat = parseFloat(lat);
   spotRes.lng = parseFloat(lng);
   spotRes.price = parseFloat(price);
   spotRes.previewImage = "image url"
   for (let img of SpotImages){
     if (img.preview === true){
       spotRes.previewImage = img.url
     }
   }
  //  spotResult.push(spotRes);
   prettyRes.Spot = spotRes;
   prettyRes.stars = parseFloat(stars);
   prettyRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'')
   prettyRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'')
  // }
   result.push(prettyRes);
 }//end of for loop

   return res.json({"Reviews":result});
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

  if(images.length >= 10){
    return res.status(403).json({message: "Maximum number of images for this resource was reached"});
  }

  //a comment

  
  const reviewImage = await ReviewImage.create(
    { 
      url: req.body.url,
      reviewId: reviewId
    }
);
   return res.json({"id": reviewImage.id, "url": reviewImage.url});

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
        stars: req.body.stars
      }
  );

  const {stars, createdAt, updatedAt, ...rest} = await review.toJSON();
  const prettyRes = {...rest}
  prettyRes.stars = parseFloat(stars);
  prettyRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'')
  prettyRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'')
  return res.json(prettyRes);
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
  await review.destroy();

  return res.json({message: "Successfully deleted"})

});

module.exports = router;