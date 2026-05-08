function populateDynamicLists() {
    // History Data
    const historyData = [
        { title: "ZabPlay: Introduction", time: "3:45 / 10:00", thumb: "logo.png" },
        { title: "Lovable Style Update", time: "15:10 / 20:00", thumb: "logo.png" },
        { title: "New Video Scan", time: "1:00 / 1:00", thumb: "logo.png" }
    ];

    // Shorts Data
    const shortsData = ["logo.png", "logo.png", "logo.png", "logo.png", "logo.png"];

    // Populate History
    const historyList = document.getElementById('history-list');
    if (historyList) {
        historyList.innerHTML = historyData.map(item => `
            <div class="history-item">
                <img src="${item.thumb}" class="thumbnail">
                <div class="info">
                    <h4 class="title">${item.title}</h4>
                    <p class="meta">Watched ${item.time}</p>
                </div>
            </div>
        `).join('');
    }

    // Populate Shorts
    const shortsList = document.getElementById('shorts-list');
    if (shortsList) {
        shortsList.innerHTML = shortsData.map(img => `
            <div class="shorts-item">
                <img src="${img}" class="thumbnail">
            </div>
        `).join('');
    }
}
