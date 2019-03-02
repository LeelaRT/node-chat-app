const moment = require('moment');

var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
    // createdAt: new Date().getTime()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from : from,
    url : `https://www.google.com/maps?${latitude},${longitude}`,
    createdAt: moment().valueOf()
  }
};

module.exports = {generateMessage, generateLocationMessage};
