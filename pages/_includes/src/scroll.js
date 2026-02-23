const arrow = document.getElementById("scroller");
const layout = document.getElementsByClassName("layout")[0];
const cards = document.getElementById("pcards");

function scrollHandler() {
    let opacity = window.getComputedStyle(arrow).getPropertyValue("opacity");
    if (opacity != 0) {
        layout.scrollIntoView({ behavior: 'smooth' })
    }
}

function cardsScrollHandler() {
    cards.scrollIntoView({ behavior: 'smooth' })
}
