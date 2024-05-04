// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const { Spot, Review, Booking, SpotImage } = require('../../db/models');
const { kMaxLength } = require('buffer');

const router = express.Router();

//Gets all of the spots
router.get('/', async(req, res) => {
    const spots = await Spot.findAll();
    res.json(spots);
});

router.get('/:spotId', async(req, res) => {
   const spot_id = req.params.spotId;
   const spot = await Spot.findByPk(spot_id);
   res.json(spot);
});

router.get('/:spotId/bookings', async(req, res) => {
   const {spotId} = req.params;
   //const spot = await Spot.findByPk(spot_id);
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


// router.get('/current', async(req, res) => {
//    const usersSpots = await Spot.findAll({

//    });
//    res.json(usersSpots);
// });


router.post('/', async(req, res) => {
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

    res.json(spot);
 });

 router.post('/:spotId/images', async(req, res, next) =>{
   const {spotId} = req.params;
   // const review = await Review.findByPk(reviewId)
   const spotImage = await SpotImage.create(
     { 
       url: req.body.url,
       reviewId: spotId
     }
 );
    res.json(spotImage);
 });


 router.post('/:spotId/bookings', async(req, res) => {
   const {spotId} = req.params;
   //const spot = await Spot.findByPk(spot_id);
   const spot_booking = await Booking.create(
      { 
       userId: req.body.userId, 
       spotId: spotId,
       startDate: req.body.startDate,
       endDate: req.body.endDate
      }
  );
  
   res.json(spot_booking);
});

router.post('/:spotId/reviews', async(req, res) => {
   const {spotId} = req.params;
   //const spot = await Spot.findByPk(spot_id);
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


 router.put('/:spotId', async(req, res) => {
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

  res.json(spot);
});


router.delete('/:spotId', async(req, res) => {
   const spot_id = req.params.spotId;
   const spot= await Spot.findByPk(spot_id);
   
   spot.destroy();
   res.json({
      "message": "Successfully deleted"
    });
});



module.exports = router;