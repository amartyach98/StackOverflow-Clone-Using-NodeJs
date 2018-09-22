const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProfileSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: "myPerson"
    },
    username: {
        type: String,
        required: true


    },
    website: {
        type: String,
    },
    country: {
        type: String,
    },
    language: {
        type: [String],
        required: true
    },
    portfolio: {
        type: String,

    },
    workrole: [
        {
            role: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            from: {
                type: Date,
            },
            to: {
                type: Date,

            },
            current: {
                type: Boolean,
                default: false,

            },
            details: {
                type: String,


            },
        }

    ],
    social: {
        youtube: {
            type: String

        },
        facebook: {
            type: String

        },
        Instagram: {
            type: String

        },
    },
    date: {
        type: Date,
        Default: Date.now

    }

});
module.exports = Profile = mongoose.model("myProfile", ProfileSchema);