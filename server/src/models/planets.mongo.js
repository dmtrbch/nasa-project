const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  }
});

// we are compiling a mngoose schema and assing it to collection in mongodb
module.exports = mongoose.model('Planet', planetSchema);