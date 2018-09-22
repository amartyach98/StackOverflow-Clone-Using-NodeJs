const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PersonSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,

    },
    gender: {
        type: String,

    },
    profilepic: {
        type: String,
        default: "./profilepic.png"

    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = Person = mongoose.model("myPerson", PersonSchema);