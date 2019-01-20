const shortid = require('shortid');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logSchema = new Schema({
  description:{type: String, required: true, default: ''},
  duration:{type: Number, required: true, default: 0},
  date:{type: Date, required: true}
})

const userSchema = new Schema({
  username : {
    type: String,
    required: true,
    unique: true,
  },
  count : { 
    type: Number,
    required: true,
    default: 0
  },
  log : {
    type: [logSchema],
    default: []
  },
  _id: {
    type: String,
    default: shortid.generate
    
  }
}, {usePushEach: true, versionKey: false})
                              
var Users = mongoose.model('User', userSchema)

module.exports = Users