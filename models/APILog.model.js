const mongoose = require("mongoose");

const APILogSchema = mongoose.Schema({  
  method: String,
  url: String,
  headers: Object,
  query: Object,
  body: Object,
  category: String,
  bodyAsString: String,
  statusCode: Number,
  responseBody: mongoose.Schema.Types.Mixed,
  date: String,
  time: String,
  ip: String,
  createAt: Date
});

// Collection inside the database
module.exports = mongoose.model("APILOG", APILogSchema);
