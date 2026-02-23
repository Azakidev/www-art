/**
    * Resets the animation state of a given element
    * @param {HTMLElement} e 
    */
function resetAnimation(e) {
    e.style.animationPlayState = "paused";
    e.style.animation = "none";
}

/**
    * Start the of a given element
    * @param {HTMLElement} e 
    */
function startAnimation(e) {
    e.style.animation = null;
    e.style.animationPlayState = "running";
}
