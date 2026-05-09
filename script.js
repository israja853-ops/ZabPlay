// ZebPlay Logic - Real-time Scanning & Player Setup
const videoScanner = document.getElementById('video-scanner');
const historyList = document.getElementById('history-list');
const shortsList = document.getElementById('shorts-list');
const allVideosList = document.getElementById('all-videos-list');

let allVideos = [];

// App load hote hi setting trigger kar sakte hain
document.getElementById('settings-trigger').onclick = () => videoScanner.click();

videoScanner.onchange = async (e) => {
    const files = Array.from(e.target.files);
    
    for (let file of files) {
        const url = URL.createObjectURL(file);
        const videoData = await getVideoMetadata(file, url);
        allVideos.push(videoData);
        renderVideo(videoData);
    }
};

// Video ki Details aur Thumbnail nikalne ka function
function getVideoMetadata(file, url) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = url;
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            const duration = formatTime(video.duration);
            const isShort = video.videoHeight > video.videoWidth; // Logic for Shorts
            
            // Thumbnail nikalne ke liye 1 second pe jao
            video.currentTime = 1;
            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth / 4;
                canvas.height = video.videoHeight / 4;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const thumb = canvas.toDataURL('image/jpeg', 0.5);
                
                resolve({
                    name: file.name,
                    size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
                    duration: duration,
                    url: url,
                    thumb: thumb,
                    isShort: isShort
                });
            };
        };
    });
}

// Design ke hisab se video ko sahi section mein dalna
function renderVideo(video) {
    if (video.isShort) {
        // Shorts Section (Vertical)
        const shortCard = `
            <div class="short-card" onclick="playFull('${video.url}')">
                <img src="${video.thumb}" style="width:100%; height:100%; object-fit:cover;">
                <div class="short-info">
                    <i class="fas fa-play"></i>&nbsp;12K
                </div>
            </div>`;
        shortsList.innerHTML += shortCard;
    } else {
        // All Videos Section (Large Horizontal)
        const videoCard = `
            <div class="video-item" onclick="playFull('${video.url}')">
                <div class="video-thumb-large">
                    <img src="${video.thumb}" style="width:100%; height:100%; object-fit:cover;">
                    <div class="progress-line" style="width: 40%;"></div>
                </div>
                <div class="video-info-box">
                    <div>
                        <p class="v-title">${video.name}</p>
                        <p class="v-meta">Views • 2 days ago</p>
                    </div>
                    <i class="fas fa-ellipsis-v" style="color:#aaa;"></i>
                </div>
            </div>`;
        allVideosList.innerHTML += videoCard;
        
        // History mein bhi ek copy dikhao
        const histCard = `
            <div class="hist-card" onclick="playFull('${video.url}')">
                <div class="thumb-area">
                    <img src="${video.thumb}" style="width:100%; height:100%; object-fit:cover;">
                    <div class="play-icon-overlay"><i class="fas fa-play"></i></div>
                    <div class="progress-line" style="width: 70%;"></div>
                </div>
            </div>`;
        historyList.innerHTML += histCard;
    }
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

// Video play karne ka function (Overlay Player)
function playFull(url) {
    // Yahan hum next part mein Player Overlay ka code add karenge
    console.log("Playing: " + url);
    alert("Video Player loading...");
}

