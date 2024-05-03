// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Review } = require('../../db/models');
const { append } = require('vary');

const router = express.Router();

router.put('/:reviewId', async(req, res, next) =>{
    const {reviewId} = req.params;
    const review = await Review.findByPk(reviewId)
    await review.update(
      { 
        userId: req.body.userId, 
       spotId: req.body.spotId,
       review: req.body.review,
       stars: req.body.stars
      }
  );
  res.json(review);
});

router.delete('/:reviewId', async(req, res) =>{
  const {reviewId} = req.params;

  const review = await Review.findByPk(reviewId);

  review.destroy();

  res.json({"message": "Success! "})

});

module.exports = router;