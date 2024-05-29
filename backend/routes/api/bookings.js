// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
// ...

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Booking, Spot } = require('../../db/models');
const { append } = require('vary');

const router = express.Router();
var today = new Date();
const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .isBefore(today)
    .withMessage('startDate cannot be in the past.'),
  check('endDate')
  .custom(endDate => {
    if(endDate === startDate){
      throw new Error('endDate cannot be on or before startDate')
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
     include: {model: Spot, where: {
      ownerId: safeUser.id
   }},
 });
   res.json({"Bookings":usersBookings});
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

      const userId = req.user.id;
      if(userId !== booking.userId){
        return res.status(403).json({message: "Forbidden"})
     }

      await booking.update(
        { 
         userId: req.body.userId, 
         spotId: req.body.spotId,
         startDate: req.body.startDate,
         endDate: req.body.endDate
        }
    );

    
    res.json(booking);
});

router.delete('/:bookingId', requireAuth, async(req, res) =>{
    const {bookingId} = req.params;

    const booking = await Booking.findByPk(bookingId);
    if(!booking){
        res.status(404).json({
         message: "Booking couldn't be found"
       });
      }
      const userId = req.user.id;
      if(userId !== booking.userId){
        return res.status(403).json({message: "Forbidden"})
     }
    booking.destroy();

    res.json({"message": "Successfully deleted"})

});

module.exports = router;