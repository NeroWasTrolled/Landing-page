document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const themeLabel = themeToggle?.querySelector("span");
    const themeIcon = themeToggle?.querySelector("i");
    const loadingScreen = document.getElementById("loading-screen");
    const scrollProgress = document.getElementById("scroll-progress");
    const particlesLayer = document.getElementById("fx-particles");
    const cursorGlow = document.getElementById("cursor-glow");
    const githubStatsCard = document.getElementById("github-stats-card");
    const githubLangsCard = document.getElementById("github-langs-card");
    const metricProjects = document.getElementById("metric-projects");
    const metricStacks = document.getElementById("metric-stacks");
    const metricStars = document.getElementById("metric-stars");
    const rotatingQuote = document.getElementById("rotating-quote");
    const quoteText = document.getElementById("quote-text");
    const secretAvatar = document.getElementById("secret-avatar");
    const easterEgg = document.getElementById("easter-egg");
    const closeEgg = document.getElementById("close-egg");
    const eggMessage = document.getElementById("egg-message");
    const eggTip = document.getElementById("egg-tip");
    const githubUser = "NeroWasTrolled";
    const storedTheme = localStorage.getItem("bio-theme") || "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const androidDevice = /Android/i.test(navigator.userAgent || "");
    const deviceMemory = Number(navigator.deviceMemory || 4);
    const logicalCores = Number(navigator.hardwareConcurrency || 4);
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveDataEnabled = Boolean(connection && connection.saveData);
    const androidLowPerf = androidDevice && (saveDataEnabled || deviceMemory <= 4 || logicalCores <= 6);
    let perfLevel = androidLowPerf ? 1 : 0;

    const setPerfLevel = (level) => {
        perfLevel = level;
        document.body.classList.remove("perf-l1", "perf-l2");
        if (level === 1) document.body.classList.add("perf-l1");
        if (level >= 2) document.body.classList.add("perf-l2");
    };

    if (androidLowPerf) {
        document.body.classList.add("perf-android");
        setPerfLevel(1);
    }

    document.body.setAttribute("data-theme", storedTheme);
    if (loadingScreen) loadingScreen.setAttribute("data-theme", storedTheme);

    const animateNumber = (element, target) => {
        if (!element) return;
        const safeTarget = Number.isFinite(target) ? target : 0;
        const steps = 28;
        const increment = safeTarget / steps;
        let value = 0;

        const interval = setInterval(() => {
            value += increment;
            if (value >= safeTarget) {
                element.textContent = String(safeTarget);
                clearInterval(interval);
            } else {
                element.textContent = String(Math.floor(value));
            }
        }, 28);
    };

    const buildGithubCardUrls = (theme) => {
        const isDark = theme === "dark";
        const statsParams = new URLSearchParams({
            username: githubUser,
            show_icons: "true",
            hide_border: "false",
            border_radius: "12",
            title_color: isDark ? "c77dff" : "7b2cbf",
            icon_color: isDark ? "e0aaff" : "9d4edd",
            text_color: isDark ? "e9ddff" : "41245f",
            bg_color: isDark ? "0d0618,1e0f36,2b1450" : "f7efff,efe2ff,e5d3ff",
            border_color: isDark ? "6f42c1" : "c9a6ff"
        });

        const langsParams = new URLSearchParams({
            username: githubUser,
            layout: "compact",
            hide_border: "false",
            border_radius: "12",
            title_color: isDark ? "c77dff" : "7b2cbf",
            text_color: isDark ? "e9ddff" : "41245f",
            bg_color: isDark ? "0d0618,1e0f36,2b1450" : "f7efff,efe2ff,e5d3ff",
            border_color: isDark ? "6f42c1" : "c9a6ff"
        });

        return {
            stats: `https://github-readme-stats.vercel.app/api?${statsParams.toString()}`,
            langs: `https://github-readme-stats.vercel.app/api/top-langs/?${langsParams.toString()}`
        };
    };

    const githubUrlsByTheme = {
        dark: buildGithubCardUrls("dark"),
        light: buildGithubCardUrls("light")
    };

    const preloadGithubCards = () => {
        const sources = perfLevel > 0
            ? [githubUrlsByTheme[storedTheme] || githubUrlsByTheme.dark]
            : Object.values(githubUrlsByTheme);

        sources.forEach((themeUrls) => {
            [themeUrls.stats, themeUrls.langs].forEach((url) => {
                const img = new Image();
                img.src = url;
            });
        });
    };

    const setGithubCardsTheme = (theme) => {
        if (!githubStatsCard || !githubLangsCard) return;
        const themeUrls = githubUrlsByTheme[theme] || githubUrlsByTheme.dark;
        if (githubStatsCard.src !== themeUrls.stats) githubStatsCard.src = themeUrls.stats;
        if (githubLangsCard.src !== themeUrls.langs) githubLangsCard.src = themeUrls.langs;
    };

    const loadGithubMetrics = async () => {
        try {
            const userResponse = await fetch(`https://api.github.com/users/${githubUser}`);
            if (!userResponse.ok) throw new Error("GitHub user fetch failed");
            const userData = await userResponse.json();

            const reposResponse = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`);
            if (!reposResponse.ok) throw new Error("GitHub repos fetch failed");
            const repos = await reposResponse.json();

            const nonForkRepos = repos.filter((repo) => !repo.fork);
            const languages = new Set(nonForkRepos.map((repo) => repo.language).filter(Boolean));
            const totalStars = nonForkRepos.reduce((sum, repo) => sum + Number(repo.stargazers_count || 0), 0);

            animateNumber(metricProjects, Number(userData.public_repos || nonForkRepos.length));
            animateNumber(metricStacks, languages.size);
            animateNumber(metricStars, totalStars);
        } catch (error) {
            animateNumber(metricProjects, 0);
            animateNumber(metricStacks, 0);
            animateNumber(metricStars, 0);
        }
    };

    const createParticles = () => {
        if (!particlesLayer) return;
        particlesLayer.innerHTML = "";
        const particleCount = perfLevel >= 2 ? 3 : (perfLevel === 1 ? 5 : 8);
        for (let i = 0; i < particleCount; i += 1) {
            const particle = document.createElement("span");
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.opacity = `${0.18 + Math.random() * 0.22}`;
            particle.style.transform = `scale(${0.85 + Math.random() * 0.5})`;
            particlesLayer.appendChild(particle);
        }
    };

    const syncThemeButton = (theme) => {
        if (!themeLabel || !themeIcon) return;
        themeLabel.textContent = theme === "dark" ? "Escuro" : "Claro";
        themeIcon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
    };

    syncThemeButton(storedTheme);
    setGithubCardsTheme(storedTheme);
    preloadGithubCards();
    if (perfLevel >= 2 && "requestIdleCallback" in window) {
        window.requestIdleCallback(() => {
            loadGithubMetrics();
        }, { timeout: 3200 });
    } else if (perfLevel === 1 && "requestIdleCallback" in window) {
        window.requestIdleCallback(() => {
            loadGithubMetrics();
        }, { timeout: 2200 });
    } else if (perfLevel > 0) {
        setTimeout(() => {
            loadGithubMetrics();
        }, perfLevel >= 2 ? 1000 : 650);
    } else {
        loadGithubMetrics();
    }
    createParticles();

    themeToggle?.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme") || "dark";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", nextTheme);
        if (loadingScreen) loadingScreen.setAttribute("data-theme", nextTheme);
        localStorage.setItem("bio-theme", nextTheme);
        syncThemeButton(nextTheme);
        setGithubCardsTheme(nextTheme);
    });

    const updateScrollProgress = () => {
        if (!scrollProgress) return;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
        scrollProgress.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
    };

    let scrollTicking = false;
    let lastScrollUpdateTime = 0;
    const onScroll = () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            const now = performance.now();
            if (perfLevel >= 2 && now - lastScrollUpdateTime < 32) {
                scrollTicking = false;
                return;
            }
            updateScrollProgress();
            lastScrollUpdateTime = now;
            scrollTicking = false;
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollProgress();

    if (!reduceMotion && !coarsePointer && cursorGlow) {
        let pointerX = 0;
        let pointerY = 0;
        let pointerTicking = false;

        const renderPointerGlow = () => {
            cursorGlow.style.transform = `translate3d(${pointerX - 140}px, ${pointerY - 140}px, 0)`;
            pointerTicking = false;
        };

        window.addEventListener("pointermove", (event) => {
            pointerX = event.clientX;
            pointerY = event.clientY;
            if (!pointerTicking) {
                pointerTicking = true;
                requestAnimationFrame(renderPointerGlow);
            }
        }, { passive: true });

        window.addEventListener("pointerleave", () => {
            cursorGlow.style.opacity = "0";
        });

        window.addEventListener("pointerenter", () => {
            cursorGlow.style.opacity = "0.8";
        });
    }

    if (!reduceMotion && !coarsePointer) {
        const hoverCards = document.querySelectorAll(".link-card, .metric-card, .service-grid article, .social-chip");
        hoverCards.forEach((card) => {
            let cardTicking = false;
            let targetX = 0;
            let targetY = 0;

            const renderTilt = () => {
                const rect = card.getBoundingClientRect();
                const x = targetX - rect.left;
                const y = targetY - rect.top;
                const rotateY = ((x / rect.width) - 0.5) * 2.2;
                const rotateX = ((y / rect.height) - 0.5) * -2.2;
                card.style.transform = `translateY(-2px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                cardTicking = false;
            };

            card.addEventListener("mousemove", (event) => {
                targetX = event.clientX;
                targetY = event.clientY;
                if (!cardTicking) {
                    cardTicking = true;
                    requestAnimationFrame(renderTilt);
                }
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
                cardTicking = false;
            });
        });
    }

    const revealItems = document.querySelectorAll("[data-reveal]");

    if (reduceMotion) {
        revealItems.forEach((item) => item.classList.add("visible"));
    } else {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        revealItems.forEach((item, index) => {
            const stagger = reduceMotion ? 0 : (index % 4) * 25;
            item.style.transitionDelay = `${stagger}ms`;
            observer.observe(item);
        });
    }

    const quotes = [
        "\"Design bonito sem estratégia é só decoração.\"",
        "\"Aplicação boa resolve problema antes de impressionar.\"",
        "\"Automação certa poupa horas e evita retrabalho.\""
    ];

    const animateQuoteSwap = (nextText) => {
        if (!quoteText || !rotatingQuote) return;
        rotatingQuote.classList.add("switching");
        setTimeout(() => {
            quoteText.textContent = nextText;
            rotatingQuote.classList.remove("switching");
        }, 170);
    };

    let quoteIndex = 0;
    if (quoteText) {
        quoteText.textContent = quotes[0];
        setInterval(() => {
            quoteIndex = (quoteIndex + 1) % quotes.length;
            animateQuoteSwap(quotes[quoteIndex]);
        }, perfLevel >= 2 ? 6800 : (perfLevel === 1 ? 5200 : 4200));
    }

    const monitorAndroidPerformance = () => {
        if (!androidLowPerf || reduceMotion || perfLevel >= 2) return;
        let lastTs = performance.now();
        const startTs = lastTs;
        let samples = 0;
        let totalDelta = 0;
        let jankFrames = 0;

        const step = (now) => {
            const delta = now - lastTs;
            lastTs = now;

            if (delta < 250) {
                samples += 1;
                totalDelta += delta;
                if (delta > 26) jankFrames += 1;
            }

            if (now - startTs < 9000) {
                requestAnimationFrame(step);
                return;
            }

            const avgDelta = samples ? (totalDelta / samples) : 16.67;
            const jankRatio = samples ? (jankFrames / samples) : 0;
            if (avgDelta > 23 || jankRatio > 0.34) {
                setPerfLevel(2);
                createParticles();
            }
        };

        requestAnimationFrame(step);
    };

    monitorAndroidPerformance();

    const konamiSequence = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a"
    ];
    const pressedKeys = [];
    const gfSequence = ["g", "f"];
    const secretMessages = {
        konami: {
            message: "Modo Secreto Liberado",
            tip: "\"Quem automatiza bem, escala melhor.\""
        },
        avatar: {
            message: "Avatar Hackeado",
            tip: "\"Cinco toques depois, o segredo aparece.\""
        },
        gf: {
            message: "Assinatura Detectada",
            tip: "\"GF reconhecido. Bem-vindo ao modo oculto.\""
        },
        longpress: {
            message: "Pressão Confirmada",
            tip: "\"Segredos bons exigem um pouco mais de tempo.\""
        }
    };
    let avatarTapCount = 0;
    let avatarTapTimer;
    let longPressTimer;

    const revealEasterEgg = (type = "konami") => {
        if (!easterEgg) return;
        const secretContent = secretMessages[type] || secretMessages.konami;
        if (eggMessage) eggMessage.textContent = secretContent.message;
        if (eggTip) eggTip.textContent = secretContent.tip;
        easterEgg.classList.add("show");
        easterEgg.setAttribute("aria-hidden", "false");
    };

    const hideEasterEgg = () => {
        if (!easterEgg) return;
        easterEgg.classList.remove("show");
        easterEgg.setAttribute("aria-hidden", "true");
    };

    closeEgg?.addEventListener("click", hideEasterEgg);
    easterEgg?.addEventListener("click", (event) => {
        if (event.target === easterEgg) hideEasterEgg();
    });

    document.addEventListener("keydown", (event) => {
        const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        pressedKeys.push(key);
        if (pressedKeys.length > konamiSequence.length) {
            pressedKeys.shift();
        }

        const matched = konamiSequence.every((step, index) => pressedKeys[index] === step);
        if (matched) {
            revealEasterEgg("konami");
            pressedKeys.length = 0;
        }

        const gfTail = pressedKeys.slice(-gfSequence.length);
        const gfMatched = gfSequence.every((step, index) => gfTail[index] === step);
        if (gfMatched) {
            revealEasterEgg("gf");
        }
    });

    secretAvatar?.addEventListener("click", () => {
        avatarTapCount += 1;
        clearTimeout(avatarTapTimer);
        avatarTapTimer = setTimeout(() => {
            avatarTapCount = 0;
        }, 1200);

        if (avatarTapCount >= 5) {
            revealEasterEgg("avatar");
            avatarTapCount = 0;
        }
    });

    secretAvatar?.addEventListener("touchstart", () => {
        longPressTimer = window.setTimeout(() => {
            revealEasterEgg("longpress");
        }, 800);
    }, { passive: true });

    secretAvatar?.addEventListener("touchend", () => {
        clearTimeout(longPressTimer);
    });

    secretAvatar?.addEventListener("touchmove", () => {
        clearTimeout(longPressTimer);
    });

    const visitorCountElement = document.getElementById("visitor-count");
    const counterNamespace = "gabrielfranca-linkbio";
    const counterKey = "total-accesses";
    const sessionKey = "counted-this-session";
    const localSessionKey = "counted-local-session";
    const cachedCountKey = "total-accesses-cache";
    const localCountKey = "total-accesses-local";

    const fetchWithTimeout = async (url, timeoutMs = 5000) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { method: "GET", signal: controller.signal });
            return response;
        } finally {
            clearTimeout(timer);
        }
    };

    const updateGlobalVisits = async () => {
        if (!visitorCountElement) return;
        try {
            const alreadyCounted = sessionStorage.getItem(sessionKey) === "1";
            const endpoint = alreadyCounted
                ? `https://api.countapi.xyz/get/${counterNamespace}/${counterKey}`
                : `https://api.countapi.xyz/hit/${counterNamespace}/${counterKey}`;

            let value = NaN;
            for (let attempt = 0; attempt < 2; attempt += 1) {
                const response = await fetchWithTimeout(endpoint, 4500 + attempt * 1200);
                if (!response.ok) continue;
                const data = await response.json();
                value = Number(data.value || 0);
                if (Number.isFinite(value)) break;
            }

            if (!Number.isFinite(value)) {
                throw new Error("Counter unavailable");
            }

            const cached = Number(localStorage.getItem(cachedCountKey) || "0");
            const safeValue = Math.max(value, cached);
            visitorCountElement.textContent = safeValue.toLocaleString("pt-BR");
            localStorage.setItem(cachedCountKey, String(safeValue));
            localStorage.setItem(localCountKey, String(safeValue));
            sessionStorage.setItem(sessionKey, "1");
            sessionStorage.setItem(localSessionKey, "1");
        } catch (error) {
            const alreadyCountedLocal = sessionStorage.getItem(localSessionKey) === "1";
            const cached = Number(localStorage.getItem(cachedCountKey) || "0");
            const localBase = Number(localStorage.getItem(localCountKey) || "0");
            const source = Math.max(cached, localBase);
            const fallbackValue = alreadyCountedLocal ? source : source + 1;

            localStorage.setItem(localCountKey, String(fallbackValue));
            localStorage.setItem(cachedCountKey, String(fallbackValue));
            sessionStorage.setItem(localSessionKey, "1");
            visitorCountElement.textContent = fallbackValue.toLocaleString("pt-BR");
        }
    };

    updateGlobalVisits();
});
