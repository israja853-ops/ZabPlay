function populateDynamicLists() {
    // Gallery Video Data
    const videoData = [
        { name: "VID_20240508_101.mp4", duration: "04:25", size: "12.5 MB" },
        { name: "WhatsApp Video 2024.mp4", duration: "01:12", size: "3.2 MB" },
        { name: "Instagram_Reel_99.mp4", duration: "00:30", size: "5.8 MB" },
        { name: "Movie_Clip_Final.mkv", duration: "12:45", size: "145 MB" }
    ];

    // Main Grid Population
    const mainGrid = document.getElementById('main-video-grid');
    if (mainGrid) {
        mainGrid.innerHTML = videoData.map(v => `
            <div class="video-card">
                <div class="thumb-box">
                    <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#333;">
                        <i class="fas fa-play-circle" style="font-size:30px;"></i>
                    </div>
                    <span class="duration">${v.duration}</span>
                </div>
                <div class="info">
                    <p class="name">${v.name}</p>
                    <p class="size">${v.size}</p>
                </div>
            </div>
        `).join('');
    }
}
