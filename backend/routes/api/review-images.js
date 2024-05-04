// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const {  ReviewImage } = require('../../db/models');
const { kMaxLength } = require('buffer');

const router = express.Router();

router.delete('/:imageId', async(req, res, next) =>{
   const {imageId} = req.params;

   const reviewImage = await ReviewImage.findByPk(imageId);

   reviewImage.destroy();
    res.json({'message': 'Deleted successfully!'});
 });

 module.exports = router;