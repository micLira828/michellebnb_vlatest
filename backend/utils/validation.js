// backend/utils/validation.js
const { validationResult} = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);
  console.log(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);
      const {lat, lng, price} = req.body;
      // console.log(`${lat}, ${lng}, ${price}`)
      // if(lat < -90 || lat > 90){
      //    throw new Error('Latitude must be within -90 and 90')
      // }
    console.log(validationErrors);
    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};


module.exports = {
  handleValidationErrors
};