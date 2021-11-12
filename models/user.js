const mongoose = require('mongoose');
const passport =  require('passport');
const LocalStrategy= require('passport-local').Strategy;
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema= new Schema({
    email:{
        type:String,
        required: true,
        unique: true
    }
})
UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');