// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
// ...

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const { append } = require('vary');

const router = express.Router();
var today = new Date();
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

 
router.put('/:bookingId', requireAuth, validateBooking, async(req, res, next) =>{
      const {bookingId} = req.params;
      const booking = await Booking.findByPk(bookingId);
      if(!booking){
        res.status(404).json({
         message: "Booking couldn't be found"
       });
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
    booking.destroy();

    res.json({"message": "Success! "})

});

module.exports = router;