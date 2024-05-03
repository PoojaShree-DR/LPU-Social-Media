const mongoose = require('mongoose');

const Feeds = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    imageName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Feed', Feeds);
