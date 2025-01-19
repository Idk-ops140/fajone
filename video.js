const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    username: String,
    url: String,
    likes: { type: Number, default: 0 },
    comments: [String]
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
