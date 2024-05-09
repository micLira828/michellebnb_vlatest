// backend/routes/api/session.js
const express = require('express');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');
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
     .exists({ checkFalsy: true })
     .isDecimal({min: 1.0, max: 5.0})
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
     .isString()
     .withMessage('City is required.'),
    check('state')
     .exists({ checkFalsy: true })
     .isString()
     .withMessage('State is required.'),
    check('country')
     .exists({ checkFalsy: true })
     .isLength({ min: 6 })
     .withMessage('Country is required.'),
     check('lat')
     .exists({ checkFalsy: true })
     .isDecimal({min:-90.0, max:90.0})
     .withMessage('Latitude must be within -90 and 90'),
     check('lng')
     .exists({ checkFalsy: true })
     .isDecimal({min:-180.0, max: 180.0})
     .withMessage('Longitude must be within -180 and 180'),
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
   let {page, size, minLat, maxLat, minLong, maxLong, minPrice, maxPrice} = req.query
   size = parseInt(size)
   page = parseInt(page) 

   const where = {};

   if(isNaN(page) || page < 1 || page > 10){
      page = 1
   }

   if(isNaN(size) || size < 1 || size > 20){
      size = 20
   }

   if(minLat !== undefined && maxLat !== undefined) {
      where.lat = {[Op.gt]: minLat, [Op.lt]:maxLat }
   } 

    else if(minLat !== undefined) {
      where.lat = {[Op.gt]: minLat}
   } 

   else if(maxLat !== undefined) {
      where.lat = {[Op.lt]: maxLat}
   } 
      
   if (minLong !== undefined && maxLong !== undefined){
      where.lng = {[Op.gt]: minLong, [Op.lt]:maxLong}
   } 

   else if(minLong !== undefined) {
      where.lng = {[Op.gt]: minLong}
   } 

   else if(maxLong !== undefined) {
      where.lng = {[Op.lt]: maxLong}
   } 

   if (minPrice !== undefined && maxPrice !== undefined){
      where.price = {[Op.gt]: minPrice, [Op.lt]: maxPrice}
   } 

   else if(maxPrice !== undefined) {
      where.price = {[Op.lt]: maxPrice}
   } 

   else if(minPrice !== undefined) {
      where.price = {[Op.gt]: minPrice}
   } 

   
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

   const userId = req.user.id;
   if(userId !== user.id){
      return res.status(403).json({message: "Forbidden"})
   }
  
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
   const spot = await Spot.findByPk(spot_id, {
      include: [SpotImage, User]
   });

   if(!spot){
      return res.status(401).json({message: "Spot couldn't be found"})
   }
   res.json(spot);
});




router.get('/:spotId/bookings', async(req, res) => {
   const {spotId} = req.params;
   const spot = await Spot.findByPk(spotId);
   if(spot){
      return res.status(404).json({message: "Spot couldn't be found"})
   }

 
   res.json(spot);
   const spot_bookings = await Booking.findAll({
      include: Spot,
      where: {
         spotId: spotId
      }
   });
   
   res.json(spot_bookings);
});

router.get('/:spotId/reviews', async(req, res) => {
   const {spotId} = req.params;
   const spot = await Spot.findByPk(spotId);
   if(!spot){
      res.status(404).json({message: "Spot couldn't be found"})
   }
   const spot_reviews = await Review.findAll({
      include: [User, ReviewImage],
      where: {
         spotId: spotId
      }
   });
  
   res.json(spot_reviews);
});


router.post('/', requireAuth, validateSpot, async(req, res) => {
      const {user} = req;

    if(!user){
       return res.status(401).json({message: "Authentication required"})
    }

    const spot = await Spot.create(
      { 
       lat: req.body.lat, 
       lng: req.body.lng,
       ownerId: user.id,
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
   const {user} = req.body;
   
   const spot = Spot.findByPk(spotId);
   if(!spotId){
      res.status(404).json({
         message: "Spot couldn't be found"
       });
   }
   
   const userId = user.id;
   if(userId !== spot.ownerId){
      return res.status(403).json({message: "Forbidden"})
   }
   
   const spotImage = await SpotImage.create(
     { 
       url: req.body.url,
       preview: req.body.preview,
       spotId: spotId
     });

    res.json({
    "url":spotImage.url, 
    "preview": spotImage.preview});
 });

 

 router.post('/:spotId/bookings', requireAuth, validateBooking, async(req, res) => {
   const {spotId} = req.params;

   const spot = Spot.findByPk(spotId);
   if(!spot){
      return res.status(404).json({message: "Spot couldn't be found"})
   }

   const userId = req.user.id;
   if(userId === spot.ownerId){
      return res.status(403).json({message: "Forbidden"})
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
 
 
   res.json({"spotId":spot_booking.spotId ,"startDate": spot_booking.startDate, 
   "endDate":spot_booking.endDate});
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

 const userId = req.user.id;
 if(userId === spot_review.userId){
    return res.status(403).json({message: "Forbidden"})
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
   if(!spot){
      res.status(404).json({
       message: "Spot couldn't be found"
     });
    }

    const userId = req.user.id;
    if(userId === spot.ownerId){
       return res.status(403).json({message: "Forbidden"})
    }
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

    const userId = req.user.id;
    if(userId === spot.ownerId){
       return res.status(403).json({message: "Forbidden"})
    }
    
   spot.destroy();
   res.json({
      "message": "Successfully deleted"
    });
});



module.exports = router;