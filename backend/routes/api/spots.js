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
     .withMessage('Country is required'),
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
     .withMessage('Description is required'),
     check('price')
     .isFloat({ min: 0})
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

   if(!page || !Number(page) ||
    page < 1){
      page = 1
   }

   if(!size || !Number(size) || size < 1 || size > 20){
      size = 20
   }

   if(minLat && maxLat && 
      Number(minLat) && Number(maxLat)) {
      where.lat = {[Op.gt]: minLat, [Op.lt]:maxLat }
   } 

    else if(minLat && Number(minLat)) {
      where.lat = {[Op.gt]: minLat}
   } 

   else if(maxLat && Number(maxLat)) {
      where.lat = {[Op.lt]: maxLat}
   } 
      
   if (minLong && maxLong 
      && Number(minLong) && Number(maxLong)
   ){
      where.lng = {[Op.gt]: minLong, [Op.lt]:maxLong}
   } 

   else if(minLong  && Number(minLong)) {
      where.lng = {[Op.gt]: minLong}
   } 

   else if(maxLong && Number(maxLong)) {
      where.lng = {[Op.lt]: maxLong}
   } 

   if (minPrice  && maxPrice 
      && Number(minPrice) && Number(maxPrice) 
   ){
      where.price = {[Op.gt]: minPrice, [Op.lt]: maxPrice}
   } 

   else if(maxPrice && Number(maxPrice)) {
      where.price = {[Op.lt]: maxPrice}
   } 

   else if(minPrice && Number(minPrice)){
      where.price = {[Op.gt]: minPrice}
   } 

   const spots = await Spot.findAll({
        include: [{model: SpotImage}, {model: Review}],
        where,
        limit: size,
        offset: (page - 1) * size

    });

    const result = [];
    for (let spot of spots){
      const {SpotImages, Reviews, lat, lng, price, createdAt, updatedAt, ...rest} = await spot.toJSON();
    
       const prettyRes = {...rest, lat, lng, avgRating: 0.0}

       prettyRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'')
       prettyRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'')
      
  
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
   if((page !== undefined || Number(page)) && (size !== undefined || Number(size))){
      const spotRes = {"Spots": result};
      if(page !== undefined){
         page = parseInt(page);
         spotRes.page = page;
      }
      if (size !== undefined){
         size = parseInt(size);
         spotRes.size = size;
      }
      return res.json(spotRes);
   }
      return res.json({"Spots": result});
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
    const {SpotImages, Reviews, lat, lng, price, createdAt, updatedAt, ...rest} = await spot.toJSON();
    console.log(SpotImages);
     const prettyRes = {...rest, avgRating: 0.0}
    
     prettyRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'')
     prettyRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'')


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

    return res.json({"Spots": result});
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
  
     const {Reviews, lat, lng, price, createdAt, updatedAt, ...rest} = await spot.toJSON();
    
      const prettyRes = {...rest, lat, lng, price, createdAt, updatedAt, avgStarRating: 0.0}

      prettyRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'')
      prettyRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'')

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
   
 
    return res.json(result);
  
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
      const result = [];
     for (let booking of spot_bookings){
      const {id, spotId, userId, startDate, endDate, createdAt, updatedAt, User} = await booking.toJSON();
      const prettyRes = {};
      prettyRes.id = parseInt(id);
      prettyRes.startDate = startDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(' ')[0]; 
      prettyRes.endDate = endDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(' ')[0];
      prettyRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'');
      prettyRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'');
      prettyRes.spotId = parseInt(spotId);
      prettyRes.userId = parseInt(userId);
      prettyRes.User = User;
      result.push(prettyRes);
     }
     return res.json({"Bookings":result});
   }

   else{
      const result = [];
      for(let booking of spot_bookings){
         const {spotId, startDate, endDate} = await booking.toJSON();
         const prettyRes = {};
         prettyRes.spotId = parseInt(spotId);
         prettyRes.startDate = prettyRes.startDate = startDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(' ')[0]; 
         prettyRes.endDate = endDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(' ')[0];
         result.push(prettyRes);
      }
      return res.json({"Bookings":result});
   }

});

router.get('/:spotId/reviews', async(req, res) => {
   const {spotId} = req.params;
   const spot = await Spot.findByPk(spotId);
   if(!spot){
      return res.status(404).json({message: "Spot couldn't be found"})
   }
   const spot_reviews = await Review.findAll({
      include: [{model:User, attributes:['id', 'firstName', 'lastName']}, {model:ReviewImage, attributes:['id', 'url']}],
      where: {
         spotId: spotId
      }
   });

   const result = [];
   for(let review of spot_reviews){
      const {stars, createdAt, updatedAt, ...rest} = await review.toJSON();
      let prettyRes = {...rest}
      prettyRes.stars = parseFloat(stars);
      prettyRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'')
      prettyRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'')
      result.push(prettyRes);
   }

  
   return res.json({"Reviews":result});
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
      return res.status(403).json({message: 'Spot with name and address already exists'});
   }

    const spot = await Spot.create(
      { 
       ownerId: user.id,
       address: req.body.address,
       city: req.body.city,
       state: req.body.state,
       country: req.body.country,
       lat: req.body.lat, 
       lng: req.body.lng,
       name: req.body.name,
       description: req.body.description,
       price: req.body.price
      }
  );

    const {lat, lng, price, createdAt, updatedAt, ...rest} = await spot.toJSON();
    const spotRes = {...rest}
    
    spotRes.lat = parseFloat(lat)
    spotRes.lng = parseFloat(lng)
    spotRes.price = parseFloat(price)

    spotRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'')
    spotRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'')

    return res.status(201).json(spotRes);
 });

 router.post('/:spotId/images', requireAuth, async(req, res, next) =>{
   const {spotId} = req.params;
   const {user} = req;

   const spot = await Spot.findByPk(spotId);

   if(!spot){
      return res.status(404).json({
         message: "Spot couldn't be found"
       });
   }
  
   if(user.id === spot.ownerId){
      const spotImage = await SpotImage.create({
         url: req.body.url,
         preview: req.body.preview,
         spotId: spotId
      });

      return res.json({"id":spotImage.id, "url":spotImage.url, "preview": spotImage.preview});
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

   const reqStartDate = req.body.startDate;
   const reqEndDate = req.body.endDate;
   
   const spotBookings = await Booking.findAll({
      where : {
         spotId: spotId
      }
   });


   
   const spotBooking = await Booking.create(
      { 
       userId: userId, 
       spotId: spotId,
       startDate: req.body.startDate,
       endDate: req.body.endDate
      }
  );

  for (let bkng of spotBookings){
   let {startDate, endDate} = await bkng.toJSON()
   // const reqStartDate = startDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(' ')[0];
   // const reqEndDate = endDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(' ')[0];

   if(reqStartDate === endDate){
      err.message = "Sorry, this spot is already booked for the specified dates"
      err.errors = {}
      err.errors.startDate = "End date conflicts with an existing booking"
      return res.status(403).json(err);
   }

   if(reqEndDate === startDate){
      err.message = "Sorry, this spot is already booked for the specified dates"
      err.errors = {}
      err.errors.endDate = "Start date conflicts with an existing booking"
      return res.status(403).json(err);
   }

   if( reqStartDate < startDate 
      && reqEndDate > endDate){
         const err = new Error();
         err.message = "Sorry, this spot is already booked for the specified dates"
         err.errors = {}
         err.errors.startDate = "Start date conflicts with an existing booking"
         err.errors.endDate = "End date conflicts with an existing booking";

         return res.status(403).json(err);
   }
  
   if(startDate > reqStartDate || endDate < reqEndDate){
      const err = new Error();
      err.message = "Sorry, this spot is already booked for the specified dates"
      err.errors = {}
      
      if(startDate >= reqStartDate){
         err.errors.startDate = "Start date conflicts with an existing booking"
      }
      if(endDate <= reqEndDate){
         err.errors.endDate = "End date conflicts with an existing booking"
      }
       return res.status(403).json(err);
   }
}

  const {startDate, endDate, createdAt, updatedAt, ...rest} = await spotBooking.toJSON();

  const bookingRes = {...rest};
  bookingRes.startDate = startDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(' ')[0];
  bookingRes.endDate = endDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(' ')[0];
  bookingRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'');
  bookingRes.updatedAt = updatedAt.toISOString().replace(/T/,' ').replace(/\..+/,'');

  return res.status(201).json(bookingRes); 
});

router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res) => {
   const {spotId} = req.params;
  
  const spot = await Spot.findByPk(spotId);
  

  if(!spot){
   return res.status(404).json({
    message: "Spot couldn't be found"
  });
 }

   const userId = req.user.id;
   
   const usersReview = await Review.findOne({where: {userId: userId, spotId: spotId}});

   if(usersReview){
      return res.status(500).json({message: "User already has a review for this spot"});
   }

 
   const spot_review = await Review.create(
      { 
       userId: userId,
       spotId: spotId,
       review: req.body.review,
       stars: req.body.stars
      }
  );

  const {stars,  createdAt, updatedAt, ...rest} = await spot_review.toJSON();
  const reviewRes = {...rest}
 
  
   reviewRes.stars = parseInt(stars)
   reviewRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'')
   reviewRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'')


   return res.status(201).json(reviewRes);
 
});

//Just another comment to push something to dev
 router.put('/:spotId', requireAuth, validateSpot, async(req, res) => {
   const spot_id = req.params.spotId;
   const spot= await Spot.findByPk(spot_id);
   if(!spot){
      return res.status(404).json({
       message: "Spot couldn't be found"
     });
    }

    const existingSpot = await Spot.findOne({
      where: {
         name: req.body.name,
         address: req.body.address
      }
   });

    if(existingSpot){
      return res.status(403).json({message: 'Spot with name and address already exists'});
   }

    const userId = req.user.id;
    if(userId !== spot.ownerId){
       return res.status(403).json({message: "Forbidden"})
    }


   await spot.update(
      { 
       lat: req.body.lat, 
       lng: req.body.lng,
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

  const {lat, lng, price, createdAt, updatedAt, ...rest} = await spot.toJSON();
   const spotRes = {...rest};
   spotRes.lat =  parseFloat(spot.lat);
   spotRes.lng = parseFloat(spot.lng);
   spotRes.price = parseFloat(spot.price);

   spotRes.createdAt = createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, ' ')
   spotRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/, ' ')
 
  return res.json(spotRes);
});


router.delete('/:spotId', requireAuth, async(req, res) => {
   const spot_id = req.params.spotId;
   const spot= await Spot.findByPk(spot_id);
   if(!spot){
      return res.status(404).json({
       message: "Spot couldn't be found"
     });
    }

    const userId = req.user.id;
    if(userId !== spot.ownerId){
       return res.status(403).json({message: "Forbidden"})
    }
    
   await spot.destroy();
   return res.json({
      message: "Successfully deleted"
    });
});



module.exports = router;