window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const loaderFill = document.getElementById("loader-fill");
    const loaderText = document.getElementById("loader-text");
    if (!loadingScreen) return;

    const performanceMode = document.body.classList.contains("perf-android");
    const heavyPerfMode = document.body.classList.contains("perf-l2");

    const steps = performanceMode
        ? [
            { width: 34, text: "Otimizando para seu dispositivo..." },
            { width: 72, text: "Carregando experiência..." },
            { width: 100, text: "Pronto para abrir." }
        ]
        : [
            { width: 16, text: "Iniciando ambiente..." },
            { width: 34, text: "Coletando links..." },
            { width: 58, text: "Aplicando identidade visual..." },
            { width: 82, text: "Sincronizando animações..." },
            { width: 100, text: "Pronto para abrir." }
        ];

    const stepInterval = heavyPerfMode ? 240 : (performanceMode ? 320 : 420);
    const fadeDelay = heavyPerfMode ? 100 : (performanceMode ? 180 : 280);

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
            }, fadeDelay);
        }
    }, stepInterval);
});
