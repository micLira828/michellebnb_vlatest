// backend/routes/api/session.js
const express = require('express');
const { SpotImage, Spot} = require('../../db/models');
const { Model } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async(req, res, next) =>{
   const {imageId} = req.params;
   console.log(imageId);

   const spotImage = await SpotImage.findByPk(imageId);
   if(!spotImage){
      res.status(404).json({
       message: "Spot image couldn't be found"
     });
    }
   
   await spotImage.destroy();

   //Made change here
    return res.json({ message: 'Successfully deleted'});
 });

 module.exports = router;