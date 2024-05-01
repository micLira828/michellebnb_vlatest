// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const { Spot } = require('../../db/models');
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