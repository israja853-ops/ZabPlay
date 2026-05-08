// Function to populate horizontal lists with dummy data
function populateDynamicLists() {
    console.log("Populating Media Blocks...");

    // 1. Data Structure: HISTORY (Large, Large Info)
    const historyData = [
        { title: "ZabPlay: Introduction", time_watched: "3:45", total_time: "10:00", progress: 37, thumb: "logo.png" },
        { title: "Lovable style main update", time_watched: "15:10", total_time: "20:00", progress: 75, thumb: "logo.png" },
        { title: "ZPlayer Scanning Media Pro...", time_watched: "1:00", total_time: "1:00", progress: 100, thumb: "logo.png" },
    ];

    // 2. Data Structure: SHORTS (Small, Round, Thumbnail only)
    const shortsData = [
        { thumb: "logo.png" },
        { thumb: "logo.png" },
        { thumb: "logo.png" },
        { thumb: "logo.png" },
        { thumb: "logo.png" },
        { thumb: "logo.png" },
    ];

    // --- Dom Population logic ---

    // History List
    const historyList = document.getElementById('history-list');
    if (historyList) {
        historyList.innerHTML = historyData.map(item => `
            <div class="history-item">
                <img src="${item.thumb}" class="thumbnail" alt="History Item">
                <div class="info">
                    <h4 class="title">${item.title}</h4>
                    <p class="meta">Watched ${item.time_watched} / ${item.total_time}</p>
                }
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${item.progress}%"></div>
                </div>
            </div>
        `).join('');
    }

    // Shorts List
    const shortsList = document.getElementById('shorts-list');
    if (shortsList) {
        shortsList.innerHTML = shortsData.map(item => `
            <div class="shorts-item">
                <img src="${item.thumb}" class="thumbnail" alt="Shorts Thumb">
            </div>
        `).join('');
    }
}

