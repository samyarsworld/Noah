const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    email: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    }
}, {timestamps: true});

const UserModel = model('user', userSchema);
module.exports = UserModel;