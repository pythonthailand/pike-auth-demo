import mongoose from 'mongoose';

var  PWSchema = new mongoose.Schema({
    username: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' //Edit: I'd put the schema. Silly me.
    }],
    password: {
        type: String,
        required: true
    },
    daterecord: {
        type: Date,
        default: Date.now
    }

});
mongoose.models = {};

var  PassHis = mongoose.model('PS_HIS', PWSchema);

module.exports = PassHis;

