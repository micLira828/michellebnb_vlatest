// backend/routes/api/session.js
const express = require('express');
const { Spot, Review, Booking, SpotImage, User } = require('../../db/models');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { parseTwoDigitYear } = require('moment');
const { Op } = require('sequelize');


const router = express.Router();
var today = new Date();

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


 const validateBooking = [
   check('startDate')
     .exists({ checkFalsy: true })
     .isBefore(today)
     .withMessage('startDate cannot be in the past.'),
   check('endDate')
     .exists({ checkFalsy: true })
     .isAfter('startDate')
     .withMessage('endDate cannot be on or before startDate'),
   handleValidationErrors
 ];


const validateSpot= [
   check('address')
     .exists({ checkFalsy: true })
     .isString()
     .withMessage('Street address is required. Please provide a valid email.'),
   check('city')
     .exists({ checkFalsy: true })
     .isLength({ min: 4 })
     .withMessage('City is required.'),
   check('state')
     .not()
     .isEmail()
     .withMessage('Username cannot be an email.'),
   check('country')
     .exists({ checkFalsy: true })
     .isLength({ min: 6 })
     .withMessage('Country is required.'),
     check('lat')
     .exists({ checkFalsy: true })
     .isDecimal({min: -90, max: 90})
     .withMessage('Latitude must be within -90 and 90'),
     check('name')
     .exists({ checkFalsy: true })
     .isLength({ max: 50 })
     .withMessage('Name must be less than 50 characters'),
     check('description')
     .exists({ checkFalsy: true })
     .withMessage('Description is Required.'),
     check('price')
     .exists({ checkFalsy: true })
     .isLength({ min: 1 })
     .withMessage('Price per day must be a positive number'),
   handleValidationErrors
 ];
//Gets all of the spots
router.get('/', async(req, res) => {
   let {page, size} = req.query
   size = parseInt(size)
   page = parseInt(page) 

   let minLat = req.query.minLat;
   let maxLat = req.query.maxLat;
   let minPrice = req.query.minPrice;
   let maxPrice = req.query.maxLat;

   if(isNan(minLat) || minLat < 1 || maxLat > 10){
      minLat = 10
   }

   if(isNan(maxLat) || maxLat < 1 || maxLat > 20){
      maxLat = 20
   }


   const where = {
      lat: {[Op.gt]: minLat, [Op.lt]:maxLat },
      long: {[Op.gt]: minLong, [Op.lt]:maxLong},
      price: {[Op.gt]: minPrice, [Op.lt]:maxPrice},
   };


    const spots = await Spot.findAll({
        where,
        limit: size,
        offset: (page - 1) * size
    });

    res.json(spots);
});

router.get('/current', requireAuth, async(req, res) => {
     
   console.log(req.url);
   const { user } = req;
   
   if (user) {
     const safeUser = {
       id: user.id,
       email: user.email,
       username: user.username,
     };
     const usersSpots = await Spot.findAll({
      where: {
         ownerId: safeUser.id
      }
  });
    res.json(usersSpots);
   }
});

router.get('/:spotId', async(req, res) => {
   const spot_id = req.params.spotId;
   const spot = await Spot.findByPk(spot_id);

   if(!spot){
      return res.status(401).json({message: "Spot couldn't be found"})
   }
   res.json(spot);
});




router.get('/:spotId/bookings', requireAuth, async(req, res) => {
   const {spotId} = req.params;
   const spot = await Spot.findByPk(spotId);
   if(spot){
      return res.status(404).json({message: "Spot couldn't be found"})
   }
   res.json(spot);
   const spot_bookings = await Booking.findAll({
      where: {
         spotId: spotId
      }
   });
   
   res.json(spot_bookings);
});

router.get('/:spotId/reviews', async(req, res) => {
   const {spotId} = req.params;
   //const spot = await Spot.findByPk(spot_id);
   const spot_reviews = await Review.findAll({
      where: {
         spotId: spotId
      }
   });
  
   res.json(spot_reviews);
});





router.post('/', requireAuth, validateSpot, async(req, res) => {
     const spot = await Spot.create(
        { 
         latitude: req.body.latitude, 
         longitude: req.body.longitude,
         ownerId: req.body.ownerId,
         address: req.body.address,
         name: req.body.name,
         country: req.body.country,
         city: req.body.city,
         state: req.body.state,
         description: req.body.description,
         price: req.body.price
        }
    );
    if(!spot){
      res.status(404).json({
       message: "Spot couldn't be found"
     });
    }
    res.json(spot);
 });

 router.post('/:spotId/images', requireAuth, async(req, res, next) =>{
   const {spotId} = req.params;

   if(!spotId){
      res.status(404).json({
         message: "Spot couldn't be found"
       });
   }
   
   // const review = await Review.findByPk(reviewId)
   const spotImage = await SpotImage.create(
     { 
       url: req.body.url,
       spotId: spotId
     }
 );
    res.json({"url":spotImage.url});
 });

 

 router.post('/:spotId/bookings', requireAuth, validateBooking, async(req, res) => {
   const {spotId} = req.params;

   const spot = Spot.findByPk(spotId);
   if(!spot){
      return res.status(404).json({message: "Spot couldn't be found"})
   }
 
   //const spot = await Spot.findByPk(spot_id);
   const spot_booking = await Booking.create(
      { 
       userId: req.body.userId, 
       spotId: spotId,
       startDate: req.body.startDate,
       endDate: req.body.endDate
      }
  );

  const userId = req.user.id;
  if(userId === spot.ownerId){
     return res.status(403).json({message: "Forbidden"})
  }
   res.json(spot_booking);
});

router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res) => {
   const {spotId} = req.params;
   //const spot = await Spot.findByPk(spot_id);
  const spot = Spot.findByPk(spotId);

  if(!spot){
   res.status(404).json({
    message: "Spot couldn't be found"
  });
 }
  
   const spot_review = await Review.create(
      { 
       userId: req.body.userId, 
       spotId: spotId,
       review: req.body.review,
       stars: req.body.stars
      }
  );


   res.json(spot_review);
});


 router.put('/:spotId', requireAuth, validateSpot, async(req, res) => {
   const spot_id = req.params.spotId;
   const spot= await Spot.findByPk(spot_id);
   await spot.update(
      { 
       latitude: req.body.latitude, 
       longitude: req.body.longitude,
       ownerId: req.body.ownerId,
       address: req.body.address,
       name: req.body.name,
       country: req.body.country,
       city: req.body.city,
       state: req.body.state,
       description: req.body.description,
       price: req.body.price
      }
  );
  if(!spot){
  res.status(404).json({
   message: "Spot couldn't be found"
 });
}
  res.json(spot);
});


router.delete('/:spotId', requireAuth, async(req, res) => {
   const spot_id = req.params.spotId;
   const spot= await Spot.findByPk(spot_id);
   if(!spot){
      res.status(404).json({
       message: "Spot couldn't be found"
     });
    }
   spot.destroy();
   res.json({
      "message": "Successfully deleted"
    });
});



module.exports = router;