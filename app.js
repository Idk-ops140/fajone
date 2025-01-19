const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const videos = [];

app.post('/upload', upload.single('video'), (req, res) => {
    const { username } = req.body;
    const videoUrl = `/uploads/${req.file.filename}`;
    
    const video = {
        id: videos.length + 1,
        username,
        url: videoUrl,
        likes: 0,
        comments: []
    };
    
    videos.push(video);
    res.json(video);
});

app.get('/videos', (req, res) => {
    res.json(videos);
});

app.post('/like/:id', (req, res) => {
    const videoId = parseInt(req.params.id);
    const video = videos.find(v => v.id === videoId);
    if (video) {
        video.likes += 1;
        res.json({ likes: video.likes });
    } else {
        res.status(404).send("Video not found");
    }
});

app.post('/comment/:id', (req, res) => {
    const videoId = parseInt(req.params.id);
    const { comment } = req.body;
    const video = videos.find(v => v.id === videoId);
    if (video) {
        video.comments.push(comment);
        res.json({ comments: video.comments });
    } else {
        res.status(404).send("Video not found");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
