const mongoose = require("mongoose")
const schema = mongoose.Schema;

const QuestionSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: "myPerson"
    },
    textone: {
        type: String,
        required: true
    },
    texttwo: {
        type: String,
        required: true
    },
    name: {
        type: String,

    },
    upvotes: [{
        user: {
            type: schema.Types.ObjectId,
            ref: "myPerson"
        }

    }],
    answers: [{
        user: {
            type: schema.Types.ObjectId,
            ref: "myPerson"
        },
        text: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },
        Date: {
            type: Date,
            Default: Date.now

        },
        love: [{
            user: {
                type: schema.Types.ObjectId,
                ref: "myPerson"
            }

        }],


    }],
    date: {
        type: Date,
        Default: Date.now,

    },

});
module.exports = Question = mongoose.model("myQuestion", QuestionSchema);