document.addEventListener("DOMContentLoaded", () => {
    const heroRose = document.getElementById("hero-rose");
    const quoteTextEl = document.getElementById("quote-text");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (heroRose && !reduceMotion) {
        window.addEventListener("scroll", () => {
            heroRose.style.translate = "0 " + (window.scrollY * 0.18).toFixed(1) + "px";
        }, { passive: true });
    }

    const quotes = [
        '"Design bonito sem estratégia é só decoração."',
        '"Quem automatiza bem, escala melhor."',
        '"Sistema bom é o que alguém abre na segunda e trabalha."',
        '"Back-end sólido é o que sustenta o front bonito."'
    ];

    if (quoteTextEl) {
        const caret = document.createElement("span");
        caret.className = "quote-caret";

        let quoteIndex = 0;
        let typed = 0;

        const renderQuote = () => {
            quoteTextEl.textContent = quotes[quoteIndex].slice(0, typed);
            quoteTextEl.appendChild(caret);
        };

        const type = () => {
            const full = quotes[quoteIndex];
            if (typed < full.length) {
                typed += 1;
                renderQuote();
                setTimeout(type, 34);
            } else {
                setTimeout(() => {
                    quoteIndex = (quoteIndex + 1) % quotes.length;
                    typed = 0;
                    type();
                }, 3600);
            }
        };

        if (reduceMotion) {
            quoteIndex = 0;
            typed = quotes[0].length;
            renderQuote();
        } else {
            type();
        }
    }
});
