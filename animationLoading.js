window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const loaderFill = document.getElementById("loader-fill");
    const loaderText = document.getElementById("loader-text");
    if (!loadingScreen) return;

    const steps = [
        { width: 16, text: "Iniciando ambiente..." },
        { width: 34, text: "Coletando links..." },
        { width: 58, text: "Aplicando identidade visual..." },
        { width: 82, text: "Sincronizando animações..." },
        { width: 100, text: "Pronto para abrir." }
    ];

    let index = 0;
    const interval = setInterval(() => {
        const step = steps[index];
        if (loaderFill) loaderFill.style.width = `${step.width}%`;
        if (loaderText) loaderText.textContent = step.text;
        index += 1;

        if (index >= steps.length) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = "0";
                setTimeout(() => {
                    loadingScreen.style.display = "none";
                }, 450);
            }, 280);
        }
    }, 420);
});
