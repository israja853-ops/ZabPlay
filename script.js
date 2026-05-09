// ZebPlay Logic - Real-time Scanning & Player Setup
const videoScanner = document.getElementById('video-scanner');
const historyList = document.getElementById('history-list');
const shortsList = document.getElementById('shorts-list');
const allVideosList = document.getElementById('all-videos-list');
const playerOverlay = document.getElementById('player-overlay');
const videoEngine = document.getElementById('main-video-engine');

let allVideos = [];
let isLocked = false;

// Settings Icon se video select karein
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

// Video Thumbnail aur Details Generator
function getVideoMetadata(file, url) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = url;
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            const isShort = video.videoHeight > video.videoWidth;
            video.currentTime = 1;
            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 160; canvas.height = 90;
                if(isShort) { canvas.width = 90; canvas.height = 160; }
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                resolve({
                    name: file.name,
                    duration: formatTime(video.duration),
                    url: url,
                    thumb: canvas.toDataURL('image/jpeg'),
                    isShort: isShort
                });
            };
        };
    });
}

// Design ke hisab se Home Page par dikhana
function renderVideo(video) {
    const cardHtml = video.isShort ? 
        `<div class="short-card" onclick="playFull('${video.url}', '${video.name}')">
            <img src="${video.thumb}" style="width:100%;height:100%;object-fit:cover;">
            <div class="short-info"><i class="fas fa-play"></i>&nbsp;Short</div>
        </div>` :
        `<div class="video-item" onclick="playFull('${video.url}', '${video.name}')">
            <div class="video-thumb-large"><img src="${video.thumb}" style="width:100%;height:100%;object-fit:cover;"></div>
            <div class="video-info-box"><div><p class="v-title">${video.name}</p><p class="v-meta">${video.duration}</p></div><i class="fas fa-ellipsis-v"></i></div>
        </div>`;
    
    if(video.isShort) shortsList.innerHTML += cardHtml;
    else {
        allVideosList.innerHTML += cardHtml;
        historyList.innerHTML += `<div class="hist-card" onclick="playFull('${video.url}', '${video.name}')"><div class="thumb-area"><img src="${video.thumb}" style="width:100%;height:100%;object-fit:cover;"></div></div>`;
    }
}

// --- PLAYER LOGIC (Real Gestures & Controls) ---

function playFull(url, name) {
    videoEngine.src = url;
    document.getElementById('playing-v-title').innerText = name;
    playerOverlay.style.display = 'flex';
    videoEngine.play();
    document.getElementById('master-play').className = 'fas fa-pause-circle';
    refreshPlayerLists();
}

function togglePlay() {
    if(isLocked) return;
    if(videoEngine.paused) { videoEngine.play(); document.getElementById('master-play').className = 'fas fa-pause-circle'; }
    else { videoEngine.pause(); document.getElementById('master-play').className = 'fas fa-play-circle'; }
}

// Lock System
document.getElementById('lock-btn').onclick = (e) => {
    isLocked = !isLocked;
    e.target.className = isLocked ? 'fas fa-lock' : 'fas fa-lock-open';
    document.getElementById('player-ui').style.opacity = isLocked ? '0' : '1';
};

videoEngine.ontimeupdate = () => {
    const p = (videoEngine.currentTime / videoEngine.duration) * 100;
    document.getElementById('seek-fill').style.width = p + '%';
    document.getElementById('curr-time').innerText = formatTime(videoEngine.currentTime);
    if(!isNaN(videoEngine.duration)) document.getElementById('total-time').innerText = formatTime(videoEngine.duration);
};

function manualSeek(e) {
    if(isLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    videoEngine.currentTime = ((e.clientX - rect.left) / rect.width) * videoEngine.duration;
}

// Volume/Brightness Swipe Logic
let startY = 0;
videoEngine.ontouchstart = (e) => startY = e.touches[0].clientY;
videoEngine.ontouchmove = (e) => {
    if(isLocked) return;
    let moveY = startY - e.touches[0].clientY;
    let rect = videoEngine.getBoundingClientRect();
    if(e.touches[0].clientX < rect.width / 2) { // Left = Brightness
        showBar('bright-bar', Math.abs(moveY));
    } else { // Right = Volume
        videoEngine.volume = Math.min(1, Math.max(0, videoEngine.volume + (moveY / 1000)));
        showBar('volume-bar', videoEngine.volume * 100);
    }
};

function showBar(id, val) {
    const el = document.getElementById(id);
    el.style.display = 'block';
    el.querySelector('.fill').style.width = val + '%';
    clearTimeout(window.t);
    window.t = setTimeout(() => el.style.display = 'none', 1000);
}

function refreshPlayerLists() {
    const nextList = document.getElementById('up-next-list');
    nextList.innerHTML = '';
    allVideos.forEach(v => {
        nextList.innerHTML += `<div class="next-item-row" onclick="playFull('${v.url}', '${v.name}')"><img src="${v.thumb}"><div class="next-info"><h4>${v.name}</h4><p>${v.duration}</p></div></div>`;
    });
}

function formatTime(sec) {
    let m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return (m < 10 ? "0"+m : m) + ":" + (s < 10 ? "0"+s : s);
}

function closePlayer() { videoEngine.pause(); playerOverlay.style.display = 'none'; isLocked = false; }
