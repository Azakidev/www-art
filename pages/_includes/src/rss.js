const fab = document.getElementById("rssButton")
const fabPopup = document.getElementById("fabPopup")

const rssUrl = "https://fatdawlf.art/feed.xml"

fab.addEventListener("click", () => {
    resetAnimation(fabPopup);
    
    if (window.isSecureContext) {
        navigator.clipboard.writeText(rssUrl);
    }
    
    // Add a small delay so it actually works proper
    setTimeout(() => {
        startAnimation(fabPopup)
    }, 10 );
})
