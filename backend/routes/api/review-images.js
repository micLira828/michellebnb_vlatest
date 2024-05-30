// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const {  ReviewImage, Review} = require('../../db/models');
const { kMaxLength } = require('buffer');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async(req, res, next) =>{
   const {imageId} = req.params;

   const reviewImage = await ReviewImage.findByPk(imageId);
   if(!reviewImage){
      res.status(404).json({message: "Review image couldn't be found"})
    }

   const idOfReview = reviewImage.reviewId;
   console.log(idOfReview)
   const review = await Review.findByPk(idOfReview)
   
    const userId = req.user.id;
    if(userId !== review.userId){
       return res.status(403).json({message: "Forbidden"});
    }
   reviewImage.destroy();
    res.json({message: 'Successfully deleted!'});
 });

 module.exports = router;