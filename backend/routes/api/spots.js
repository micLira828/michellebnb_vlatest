// backend/routes/api/session.js
const express = require('express');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const {handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { parseTwoDigitYear } = require('moment');
const { Op, Sequelize, where, ValidationError} = require('sequelize');


const router = express.Router();
const today = new Date();

   const validateSpot= [
   check('address')
     .exists({ checkFalsy: true })
     .isString()
     .notEmpty()
     .withMessage('Street address is required'),
    check('city')
     .exists({ checkFalsy: true })
     .isString()
     .notEmpty()
     .withMessage('City is required'),
    check('state')
     .exists({ checkFalsy: true })
     .isString()
     .notEmpty()
     .withMessage('State is required'),
    check('country')
     .exists({ checkFalsy: true })
     .isLength({ min: 6 })
     .withMessage('Country is required.'),
     check('lat')
     .exists({ checkFalsy: true })
     .isFloat({ min: -90, max: 90 })
     .withMessage('Latitude must be within -90 and 90'),
     check('lng')
     .exists({ checkFalsy: true })
     .isFloat({ min: -180, max: 180 })
     .withMessage('Longitude must be within -180 and 180'),
      check('name')
     .exists({ checkFalsy: true })
     .isLength({ max: 50 })
     .withMessage('Name must be less than 50 characters'),
      check('description')
     .exists({ checkFalsy: true })
     .withMessage('Description is Required'),
     check('price')
     .isFloat({ min: 0, max: 2000})
     .withMessage('Price per day must be a positive number'),
   handleValidationErrors
 ];


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


 
 const validateBooking = [
   check('startDate')
     .exists({ checkFalsy: true })
     .isAfter(today.toString())
     .withMessage('startDate cannot be in the past.'),
   check('endDate')
   .exists({ checkFalsy: true })
   .custom(async(endDate, {req}) => {
      const startDate = req.body.startDate;
      if(Date.parse(endDate) <= Date.parse(startDate)){
         throw new Error("endDate cannot be on or before startDate")
      }
   }),
   handleValidationErrors
 ];


 



//Gets all of the spots
router.get('/', async(req, res) => {
   let {page, size, minLat, maxLat, minLong, maxLong, minPrice, maxPrice} = req.query;
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

   // const previewImage = await SpotImage.findOne(
   //    {where: {preview: true}});


   // const spotImages = spot.getSpotImages
   const spots = await Spot.findAll({
        include: [{model: SpotImage}, {model: Review}],
        where,
        limit: size,
        offset: (page - 1) * size

    });
    const result = [];
    for (let spot of spots){
      const {SpotImages, Reviews, lat, lng, price, ...rest} = await spot.toJSON();
    
       const prettyRes = {...rest, lat, lng, avgRating: 0.0}
      
  
      let ratingsAverage = 0;
      let ratingsCount = 0;
      for (let rev of Reviews){
        ratingsCount++;
        ratingsAverage += rev.stars;
      }
  
      if(ratingsCount < 1){
        prettyRes.avgRating = 0.0;
       }
  
      else{
        prettyRes.avgRating = parseFloat((ratingsAverage/ratingsCount).toFixed(1));
      }
  
      prettyRes.previewImage = "image url";
      for (let img of SpotImages){
        if(img.preview === true){
         prettyRes.previewImage = img.url
        }
      }
  
      prettyRes.lat = parseFloat(lat);
      prettyRes.lng = parseFloat(lng)
      prettyRes.price = parseFloat(price);
      result.push(prettyRes);
    }
  
      res.json({"Spots": result});
});

router.get('/current', requireAuth, async(req, res) => {
     
   const {user} = req;

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
      // attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', ],
      include: [{model: SpotImage}, {model: Review}],
      where: {
         ownerId: safeUser.id
      }
  });

  const result = [];
  for (let spot of usersSpots){
    const {SpotImages, Reviews, lat, lng, price, ...rest} = await spot.toJSON();
    console.log(SpotImages);
     const prettyRes = {...rest, avgRating: 0.0}
    

    let ratingsAverage = 0;
    let ratingsCount = 0;
    for (let rev of Reviews){
      ratingsCount++;
      ratingsAverage += rev.stars;
    }

    if(ratingsCount < 1){
      prettyRes.avgRating = 0.0;
     }

    else{
      prettyRes.avgRating = parseFloat((ratingsAverage/ratingsCount).toFixed(1));
    }

    prettyRes.previewImage = "image url";
    for (let img of SpotImages){
      if(img.preview === true){
       prettyRes.previewImage = img.url
      }
    }
    prettyRes.lat = parseFloat(lat);
    prettyRes.lng = parseFloat(lng)
    prettyRes.price = parseFloat(price);
    result.push(prettyRes);
  }

    res.json({"Spots": result});
   }
});

router.get('/:spotId', async(req, res) => {
   const spot_id = req.params.spotId;

   const spot = await Spot.findByPk(spot_id, {
      include: [{model: SpotImage, attributes: ['id', 'url', 'preview']}, {model: Review}, {as: 'Owner', model: User, attributes: ['id', 'firstName', 'lastName']}]
   });

   if(!spot){
      return res.status(404).json({message: "Spot couldn't be found"})
   }

   const result = [];
  
     const {Reviews, lat, lng, price, ...rest} = await spot.toJSON();
    
      const prettyRes = {...rest, lat, lng, price, avgStarRating: 0.0}
  
    let ratingsAverage = 0;
    let ratingsCount = 0;
     for (let rev of Reviews){
       ratingsCount++;
       ratingsAverage += rev.stars;
     }
     
     prettyRes.numReviews = ratingsCount;

     if(ratingsCount >= 1){
      prettyRes.avgStarRating = +((ratingsAverage / ratingsCount).toFixed(1));
     }
   
     prettyRes.lat = parseFloat(lat);
     prettyRes.lng = parseFloat(lng)
     prettyRes.price = parseFloat(price);
     result.push(prettyRes);
   
 
     res.json(result);
  
});


router.get('/:spotId/bookings', requireAuth, async(req, res) => {
   const {spotId} = req.params;
   const spot = await Spot.findByPk(spotId);
   if(!spot){
      return res.status(404).json({message: "Spot couldn't be found"})
   }

   const userId = req.user.id;
   const spot_bookings = await Booking.findAll({
      include: {model:User, attributes: ['id', 'firstName', 'lastName']},
       where: {
        spotId: spotId
      }
   });

   if(userId === spot.ownerId){
      res.json({"Bookings": spot_bookings});
   }
   else{
      const result = [];
     for (let booking of spot_bookings){
      const {spotId, startDate, endDate} = booking;
      const prettyRes = {};
       prettyRes.spotId = spotId;
       prettyRes.startDate = startDate;
       prettyRes.endDate = endDate;

       result.push(prettyRes);
     }
     res.json({"Bookings":result});
   }

});

router.get('/:spotId/reviews', async(req, res) => {
   const {spotId} = req.params;
   const spot = await Spot.findByPk(spotId);
   if(!spot){
      res.status(404).json({message: "Spot couldn't be found"})
   }
   const spot_reviews = await Review.findAll({
      include: [{model:User, attributes:['id', 'firstName', 'lastName']}, {model:ReviewImage, attributes:['id', 'url']}],
      where: {
         spotId: spotId
      }
   });

   const result = [];
   for(let review of spot_reviews){
      const {stars, ...rest} = await review.toJSON();
      let prettyRes = {...rest}
      prettyRes.stars = parseFloat(stars);
      result.push(prettyRes);
   }

  
   res.json({"Reviews":result});
});


router.post('/', requireAuth, validateSpot, async(req, res) => {
   const {user} = req;

   const existingSpot = await Spot.findOne({
      where: {
         name: req.body.name,
         address: req.body.address
      }
   });

   if(existingSpot){
      res.status(403).json({message: 'Spot with name and address already exists'});
   }
    const spot = await Spot.create(
      { 
       
       ownerId: user.id,
       address: req.body.address,
       city: req.body.city,
       state: req.body.state,
       country: req.body.country,
       lat: parseFloat(req.body.lat), 
       lng: parseFloat(req.body.lng),
       name: req.body.name,
       description: req.body.description,
       price: parseFloat(req.body.price)
      }
  );

    

    res.status(201).json(spot);
 });

 router.post('/:spotId/images', requireAuth, async(req, res, next) =>{
   const {spotId} = req.params;
   const {user} = req;

   const spot = await Spot.findByPk(spotId);

   if(!spot){
      res.status(404).json({
         message: "Spot couldn't be found"
       });
   }
  
   if(user.id === spot.ownerId){
      const spotImage = await SpotImage.create({
         url: req.body.url,
         preview: req.body.preview,
         spotId: spotId
      });

      res.status(201).json({"id":spotImage.id, "url":spotImage.url, "preview": spotImage.preview});
   }

   else{
      return res.status(403).json({message: "Forbidden"});
   }
 //
 });

 

 router.post('/:spotId/bookings', requireAuth, validateBooking, async(req, res) => {
   const {spotId} = req.params;
 
   const spot = await Spot.findByPk(spotId);
   if(!spot){
      return res.status(404).json({message: "Spot couldn't be found"})
   }

   const userId = req.user.id;
   if(userId === spot.ownerId){
      return res.status(403).json({message: "Forbidden"});
   }

   const {startDate, endDate} = req.body;
   const reqStartDate = Date.parse(startDate); 
   const reqEndDate = Date.parse(endDate);



   const spot_bookings = await Booking.findAll({
      where : {
         spotId: spotId
      }
   });


   for (let bkng of spot_bookings){
      let {startDate, endDate} = bkng
      startDate = Date.parse(startDate);
      endDate = Date.parse(endDate);

      if(reqStartDate === endDate){
         err.message = "Sorry, this spot is already booked for the specified dates"
         err.errors = {}
         err.errors.startDate = "Start date conflicts with an existing booking"
         res.status(403).json(err);
      }

      if(reqEndDate === startDate){
         err.message = "Sorry, this spot is already booked for the specified dates"
         err.errors = {}
         err.errors.endDate = "Enddate conflicts with an existing booking"
         res.status(403).json(err);
      }

      if( reqStartDate <= startDate 
         && reqEndDate >= endDate){
            const err = new Error();
            err.message = "Sorry, this spot is already booked for the specified dates"
            err.errors = {}
            err.errors.startDate = "Start date conflicts with an existing booking"
            err.errors.endDate = "End date conflicts with an existing booking";

            res.status(403).json(err);
      }
     
      if(startDate >= reqStartDate || endDate <= reqEndDate){
         const err = new Error();
         err.message = "Sorry, this spot is already booked for the specified dates"
         err.errors = {}
         
         if(startDate >= reqStartDate){
            err.errors.startDate = "Start date conflicts with an existing booking"
         }
         if(endDate <= reqEndDate){
            err.errors.endDate = "End date conflicts with an existing booking"
         }
          res.status(403).json(err);
      }
   }

   const spotBooking = await Booking.create(
      { 
       userId: userId, 
       spotId: spotId,
       startDate: req.body.startDate,
       endDate: req.body.endDate
      }
  );
  res.json(spotBooking);

 
});

router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res) => {
   const {spotId} = req.params;
  
  const spot = await Spot.findByPk(spotId);
  

  if(!spot){
   res.status(404).json({
    message: "Spot couldn't be found"
  });
 }

   const userId = req.user.id;

   // if(userId === spot.ownerId){
   //    res.status(403).json({
   //     message: "Spot couldn't be found"
   //   });
   //  }
   
   const usersReview = await Review.findOne({where: {userId: userId, spotId: spotId}});

   if(usersReview){
      res.status(500).json({message: "User already has a review for this spot"});
   }

   const stars = parseInt(req.body.stars);

   const spot_review = await Review.create(
      { 
       userId: userId,
       spotId: spotId,
       review: req.body.review,
       stars: stars
      }
  );


   res.status(201).json(spot_review);
});

//Just another comment to push something to dev
 router.put('/:spotId', requireAuth, validateSpot, async(req, res) => {
   const spot_id = req.params.spotId;
   const spot= await Spot.findByPk(spot_id);
   if(!spot){
      res.status(404).json({
       message: "Spot couldn't be found"
     });
    }

    const userId = req.user.id;
    if(userId !== spot.ownerId){
       return res.status(403).json({message: "Forbidden"})
    }
   await spot.update(
      { 
       lat: parseFloat(req.body.lat), 
       lng: parseFloat(req.body.lng),
       ownerId: req.body.ownerId,
       address: req.body.address,
       name: req.body.name,
       country: req.body.country,
       city: req.body.city,
       state: req.body.state,
       description: req.body.description,
       price: parseFloat(req.body.price)
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
    if(userId !== spot.ownerId){
       return res.status(403).json({message: "Forbidden"})
    }
    
   spot.destroy();
   res.json({
      "message": "Successfully deleted"
    });
});



module.exports = router;