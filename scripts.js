document.addEventListener("DOMContentLoaded", () => {
    const count = Math.floor(Math.random() * 1000) + 1; 
    document.getElementById("visitor-count").textContent = count;
});
