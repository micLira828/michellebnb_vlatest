// backend/routes/api/session.js
const express = require('express');
const { SpotImage, Spot} = require('../../db/models');
const { Model } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async(req, res, next) =>{
   const {imageId} = req.params;
  
   const user = req.user;

 

   const spotImage = await SpotImage.findByPk(imageId);
   if(!spotImage){
      return res.status(404).json({
       message: "Spot Image couldn't be found"
     });
    }

    const spot = await Spot.findOne({
      where: {
         id: spotImage.spotId
      }
    });

    if (user.id !== spot.ownerId){
      return res.json({message: 'Forbidden'});
    }
   
   await spotImage.destroy();

   //Made change here
    return res.json({ message: 'Forbidden'});
 });

 module.exports = router;