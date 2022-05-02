import mongoose from 'mongoose';

var  UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    daterecord: {
        type: Date,
        default: Date.now
    }
});
mongoose.models = {};

var  User = mongoose.model('User', UserSchema);

module.exports = User;
