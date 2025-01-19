document.getElementById("uploadBtn").addEventListener("click", () => {
    const videoFile = document.getElementById("videoFile").files[0];
    const username = document.getElementById("username").value;
    
    if (videoFile && username) {
        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("username", username);
        
        fetch("/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Video uploaded:", data);
            // Reload videos after upload
            loadVideos();
        })
        .catch(error => console.error("Error:", error));
    } else {
        alert("请填写用户名并选择视频文件");
    }
});

// Function to load and display videos
function loadVideos() {
    fetch("/videos")
        .then(response => response.json())
        .then(videos => {
            const videoContainer = document.getElementById("videoContainer");
            videoContainer.innerHTML = ''; // Clear existing videos
            
            videos.forEach(video => {
                const videoElement = document.createElement("div");
                videoElement.classList.add("video");
                videoElement.innerHTML = `
                    <video src="${video.url}" controls></video>
                    <div>
                        <p>${video.username}</p>
                        <button onclick="likeVideo(${video.id})">喜欢</button>
                        <button onclick="commentVideo(${video.id})">评论</button>
                        <div>点赞: ${video.likes}</div>
                        <div>评论: ${video.comments.length}</div>
                    </div>
                `;
                videoContainer.appendChild(videoElement);
            });
        });
}

// Function to handle liking a video
function likeVideo(videoId) {
    fetch(`/like/${videoId}`, { method: "POST" })
        .then(response => response.json())
        .then(data => {
            alert("喜欢了该视频");
            loadVideos();  // Reload videos to show updated likes
        })
        .catch(error => console.error("Error:", error));
}

// Function to handle commenting on a video
function commentVideo(videoId) {
    const comment = prompt("请输入评论：");
    if (comment) {
        fetch(`/comment/${videoId}`, {
            method: "POST",
            body: JSON.stringify({ comment }),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            alert("评论成功");
            loadVideos();  // Reload videos to show updated comments
        })
        .catch(error => console.error("Error:", error));
}

// Load videos when the page is loaded
window.onload = loadVideos;
