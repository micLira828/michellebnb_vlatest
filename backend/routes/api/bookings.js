// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
// ...

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { append } = require('vary');

const router = express.Router();
var today = new Date();
 
const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .isAfter(today.toString())
    .withMessage('startDate cannot be in the past.'),
  check('endDate')
  .exists({ checkFalsy: true })
  .custom(async(endDate, {req}) => {
     const startDate = req.body.startDate;
     if(endDate <= startDate.toString()){
        throw new Error("endDate cannot be on or before startDate")
     }
  }),
  handleValidationErrors
];


router.get('/current', requireAuth, async(req, res, next) =>{
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
    }
 
    const usersBookings = await Booking.findAll({
    where: {
      userId: safeUser.id
   },
 });

 const result = [];
 for (let booking of usersBookings){
   const {startDate, endDate, createdAt, updatedAt, ...rest} = await booking.toJSON();

   const prettyRes = {...rest};
   prettyRes.startDate = startDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(' ')[0];
   prettyRes.endDate = endDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(' ')[0];
   prettyRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'');
   prettyRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'');

   let spot = await Spot.findOne({
    include: [{model: SpotImage}],
     where: {
       id: booking.spotId
     }
   });

   let spotResult = [];
  //  for (let spot of spots){
    
   const {lat, lng, price, id, ownerId, city, state, country, address, SpotImages} = await spot.toJSON();

   const spotRes = {}
   spotRes.id = parseInt(id);
   spotRes.ownerId = parseInt(ownerId);
   spotRes.city = city;
   spotRes.state = state;
   spotRes.country = country;
   spotRes.address = address;
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
  // }
   result.push(prettyRes);
 }//end of for loop

   return res.json({"Bookings":result});
  }
});

 
router.put('/:bookingId', requireAuth, validateBooking, async(req, res, next) =>{
      const {bookingId} = req.params;
      const booking = await Booking.findByPk(bookingId);
      if(!booking){
        res.status(404).json({
         message: "Booking couldn't be found"
       });
      }
     //a comment
      const userId = req.user.id;
      if(userId !== booking.userId){
        return res.status(403).json({message: "Forbidden"})
     }
      const bookings = await Booking.findAll();
    
     const reqStartDate = req.body.startDate; 
     const reqEndDate = req.body.endDate;

     for (let bking in bookings){
      const {startDate, endDate} = bking; 
      if(reqStartDate === endDate){
         err.message = "Sorry, this spot is already booked for the specified dates"
         err.errors = {}
         err.errors.startDate = "End date conflicts with an existing booking"
         return res.status(403).json(err);
      }

      if(today.toString() > endDate){
        res.json({message: "Past bookings cannot be modified"})
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

            res.status(403).json(err);
      }
     }

      await booking.update(
        { 
         userId: userId, 
         spotId: req.body.spotId,
         startDate: Date(req.body.startDate),
         endDate: Date(req.body.endDate)
        }
    );


    const {startDate, endDate, createdAt, updatedAt, ...rest} = await booking.toJSON();
    const prettyRes = {...rest};

   

    prettyRes.startDate = startDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(" ")[0];
    prettyRes.endDate = endDate.toISOString().replace(/T/,' ').replace(/\..+/,'').split(" ")[0];
    prettyRes.createdAt = createdAt.toISOString().replace(/T/,' ').replace(/\..+/,'');
    prettyRes.updatedAt = updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/,'');
    
    return res.json(prettyRes);
});

router.delete('/:bookingId', requireAuth, async(req, res) =>{
    const {bookingId} = req.params;

    const booking = await Booking.findByPk(bookingId);
    if(!booking){
        return res.status(404).json({
         message: "Booking couldn't be found"
       });
      }
      const userId = req.user.id;
      if(userId !== booking.userId){
        return res.status(403).json({message: "Forbidden"})
     }
    await booking.destroy();

    return res.json({message: "Successfully deleted"})

});

module.exports = router;