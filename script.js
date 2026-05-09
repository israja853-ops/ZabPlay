// ZebPlay - Advance Professional Logic
const videoScanner = document.getElementById('video-scanner');
const historyList = document.getElementById('history-list');
const shortsList = document.getElementById('shorts-list');
const allVideosList = document.getElementById('all-videos-list');
const playerOverlay = document.getElementById('player-overlay');
const videoEngine = document.getElementById('main-video-engine');
const controlsWrapper = document.getElementById('full-player-controls');

let allVideos = [];
let currentIndex = -1;
let isLocked = false;
let hideTimeout;

// 1. File Scanner & Metadata
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

function getVideoMetadata(file, url) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = url;
        video.onloadedmetadata = () => {
            const isShort = video.videoHeight > video.videoWidth;
            video.currentTime = 1;
            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 160; canvas.height = 90;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                resolve({ name: file.name, duration: formatTime(video.duration), url: url, thumb: canvas.toDataURL(), isShort: isShort });
            };
        };
    });
}

function renderVideo(video) {
    const html = video.isShort ? 
        `<div class="short-card" onclick="playFull('${video.url}')"><img src="${video.thumb}"></div>` :
        `<div class="video-item" onclick="playFull('${video.url}')"><div class="video-thumb-large"><img src="${video.thumb}"></div><div class="video-info-box"><p>${video.name}</p></div></div>`;
    if(video.isShort) shortsList.innerHTML += html;
    else allVideosList.innerHTML += html;
}

// 2. --- CORE PLAYER LOGIC ---

function playFull(url) {
    currentIndex = allVideos.findIndex(v => v.url === url);
    const video = allVideos[currentIndex];
    videoEngine.src = url;
    document.getElementById('playing-v-title').innerText = video.name;
    playerOverlay.style.display = 'flex';
    videoEngine.play();
    updateUIState();
    resetHideTimer();
}

// Auto-Hide Controls (3 Seconds)
function resetHideTimer() {
    if(isLocked) return;
    controlsWrapper.style.opacity = '1';
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        if(!videoEngine.paused) controlsWrapper.style.opacity = '0';
    }, 3000);
}

function handleScreenTap() {
    if(controlsWrapper.style.opacity === '0') resetHideTimer();
    else controlsWrapper.style.opacity = '0';
}

// Double Tap to Seek (Left/Right)
videoEngine.ondblclick = (e) => {
    if(isLocked) return;
    const rect = videoEngine.getBoundingClientRect();
    if(e.clientX < rect.width / 2) videoEngine.currentTime -= 10; // Back
    else videoEngine.currentTime += 10; // Forward
    resetHideTimer();
};

// 3. --- BUTTON ACTIONS ---

function toggleMute() {
    videoEngine.muted = !videoEngine.muted;
    document.getElementById('vol-btn').className = videoEngine.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
}

function nextVideo() {
    if(currentIndex < allVideos.length - 1) playFull(allVideos[currentIndex + 1].url);
}

function prevVideo() {
    if(currentIndex > 0) playFull(allVideos[currentIndex - 1].url);
}

// Video to MP3 Mode (Background Play)
function convertToMp3() {
    alert("MP3 Mode Active: Audio will play in background.");
    // In a real app, this would minimize the UI but keep audio playing
}

// Dropdown Toggles
function toggleSettingsMenu() { document.getElementById('settings-menu').style.display = 'block'; }
function toggleTitleMenu() { document.getElementById('title-menu').style.display = 'block'; }

// 4. --- LIST SYNC & HIGHLIGHTING ---

function updateUIState() {
    const nextList = document.getElementById('up-next-list');
    nextList.innerHTML = '';
    allVideos.forEach((v, index) => {
        if(!v.isShort) {
            // Purple highlight for active video
            const activeClass = index === currentIndex ? 'active-play' : '';
            nextList.innerHTML += `
                <div class="next-item-row ${activeClass}" onclick="playFull('${v.url}')">
                    <img src="${v.thumb}">
                    <div class="next-info"><h4>${v.name}</h4><p>${v.duration}</p></div>
                </div>`;
        }
    });
    document.getElementById('master-play').className = 'fas fa-pause-circle';
}

// Utility
videoEngine.ontimeupdate = () => {
    const p = (videoEngine.currentTime / videoEngine.duration) * 100;
    document.getElementById('seek-fill').style.width = p + '%';
    document.getElementById('curr-time').innerText = formatTime(videoEngine.currentTime);
};

function formatTime(sec) {
    let m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return (m < 10 ? "0"+m : m) + ":" + (s < 10 ? "0"+s : s);
}

function closePlayer() { videoEngine.pause(); playerOverlay.style.display = 'none'; }
