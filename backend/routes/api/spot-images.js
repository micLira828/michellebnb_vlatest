// backend/routes/api/session.js
const express = require('express');
const { SpotImage, Spot} = require('../../db/models');
const { Model } = require('sequelize');


const router = express.Router();

router.delete('/:imageId', async(req, res, next) =>{
   const {imageId} = req.params;
   console.log(imageId);

   const spotImage = await SpotImage.findByPk(imageId);
   console.log(spotImage);
   
   await spotImage.destroy();
    return res.json({'message': 'Deleted successfully!'});
 });

 module.exports = router;