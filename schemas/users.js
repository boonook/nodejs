var mongoose = require('mongoose');
var Schema = mongoose.Schema;
///用户的表结构
module.exports = new mongoose.Schema({
   username:String,
   password:String
});