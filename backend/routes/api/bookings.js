// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const { append } = require('vary');

const router = express.Router();

router.put('/:bookingId', async(req, res, next) =>{
      const {bookingId} = req.params;
      const booking = await Booking.findByPk(bookingId)
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

router.delete('/:bookingId', async(req, res) =>{
    const {bookingId} = req.params;

    const booking = await Booking.findByPk(bookingId);

    booking.destroy();

    res.json({"message": "Success! "})

});

module.exports = router;