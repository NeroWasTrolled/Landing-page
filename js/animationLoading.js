document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) return;

    loadingScreen.addEventListener("animationend", (event) => {
        if (event.animationName === "loaderOut") {
            loadingScreen.style.display = "none";
        }
    });
});
