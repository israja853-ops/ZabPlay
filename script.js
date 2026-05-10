// ZebPlay - Final Premium Logic Binding
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
                canvas.width = 160; canvas.height = isShort ? 280 : 90;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                resolve({ 
                    name: file.name, 
                    duration: formatTime(video.duration), 
                    url: url, 
                    thumb: canvas.toDataURL(), 
                    isShort: isShort,
                    views: (Math.random() * 20).toFixed(1) + "K" // Dummy views for Photo 1 style
                });
            };
        };
    });
}

// 2. Home Page Rendering (Photo 1 Style)
function renderVideo(video) {
    if(video.isShort) {
        const shortHtml = `
            <div class="short-card" onclick="playFull('${video.url}')">
                <img src="${video.thumb}" style="width:100%;height:100%;object-fit:cover;">
                <div class="short-info"><i class="fas fa-play"></i>&nbsp;${video.views}</div>
                <p class="v-title" style="font-size:10px; padding:5px;">${video.name}</p>
            </div>`;
        shortsList.innerHTML += shortHtml;
    } else {
        const videoHtml = `
            <div class="video-item" onclick="playFull('${video.url}')">
                <div class="video-thumb-large"><img src="${video.thumb}" style="width:100%;height:100%;object-fit:cover;"></div>
                <div class="video-info-box">
                    <div>
                        <p class="v-title">${video.name}</p>
                        <p class="v-meta">Views • 2 days ago</p>
                    </div>
                    <i class="fas fa-ellipsis-v"></i>
                </div>
            </div>`;
        allVideosList.innerHTML += videoHtml;
        // History List Update
        historyList.innerHTML += `<div class="hist-card" onclick="playFull('${video.url}')"><img src="${video.thumb}" style="width:100%;height:100%;object-fit:cover;"></div>`;
    }
}

// 3. Player UI Logic (Photo 2 Style)
function playFull(url) {
    currentIndex = allVideos.findIndex(v => v.url === url);
    const video = allVideos[currentIndex];
    videoEngine.src = url;
    document.getElementById('playing-v-title').innerText = video.name; // Real Title
    playerOverlay.style.display = 'flex';
    videoEngine.play();
    updatePlayerLists();
    resetHideTimer();
    document.getElementById('master-play').className = 'fas fa-pause';
}

function updatePlayerLists() {
    const nextList = document.getElementById('up-next-list');
    const pShortsList = document.getElementById('player-shorts-list');
    nextList.innerHTML = '';
    pShortsList.innerHTML = '';

    allVideos.forEach((v, index) => {
        if(v.isShort) {
            pShortsList.innerHTML += `
                <div class="short-card" onclick="playFull('${v.url}')">
                    <img src="${v.thumb}" style="width:100%;height:100%;object-fit:cover;">
                    <div class="short-info"><i class="fas fa-play"></i>&nbsp;${v.views}</div>
                </div>`;
        } else {
            // Next.UP List with Handle Icon
            const activeClass = index === currentIndex ? 'active-play' : '';
            nextList.innerHTML += `
                <div class="next-item-row ${activeClass}" onclick="playFull('${v.url}')">
                    <i class="fas fa-bars handle-icon"></i>
                    <img src="${v.thumb}">
                    <div class="next-info">
                        <h4>${v.name}</h4>
                        <p>${v.duration}</p>
                    </div>
                    <i class="fas fa-ellipsis-v" style="margin-left:auto; font-size:12px; color:#666;"></i>
                </div>`;
        }
    });
}

// 4. --- CONTROLS & GESTURES ---
document.getElementById('master-play').parentElement.onclick = () => {
    if(videoEngine.paused) {
        videoEngine.play();
        document.getElementById('master-play').className = 'fas fa-pause';
    } else {
        videoEngine.pause();
        document.getElementById('master-play').className = 'fas fa-play';
    }
    resetHideTimer();
};

function resetHideTimer() {
    controlsWrapper.style.opacity = '1';
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        if(!videoEngine.paused) controlsWrapper.style.opacity = '0';
    }, 3000);
}

function handleScreenTap() {
    controlsWrapper.style.opacity = (controlsWrapper.style.opacity === '0') ? '1' : '0';
    if(controlsWrapper.style.opacity === '1') resetHideTimer();
}

// Seekbar Update
videoEngine.ontimeupdate = () => {
    const p = (videoEngine.currentTime / videoEngine.duration) * 100;
    document.getElementById('seek-fill').style.width = p + '%';
    document.getElementById('curr-time').innerText = formatTime(videoEngine.currentTime);
    if(!isNaN(videoEngine.duration)) document.getElementById('total-time').innerText = formatTime(videoEngine.duration);
};

function formatTime(sec) {
    let m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return (m < 10 ? "0"+m : m) + ":" + (s < 10 ? "0"+s : s);
}

function closePlayer() { videoEngine.pause(); playerOverlay.style.display = 'none'; }

