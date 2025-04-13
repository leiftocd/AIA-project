document.addEventListener("DOMContentLoaded", () => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    requestAnimationFrame(() => window.scrollTo(0, 0));

    const section = document.querySelector("#section-about");
    const boxes = document.querySelectorAll(".about-container_box");
    const introduceSection = document.querySelector("#section-introduction");
    const fadeSections = document.querySelectorAll(".fade-section");

    let currentBox = 0;
    let isAnimating = false;
    let touchStartY = 0;
    let touchEndY = 0;
    let aboutMode = "none";
    let maxReachedBox = 0;
    let lastScrollTime = 0;

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const throttleDelay = isMobile ? 100 : 200;
    const extraScrollMobile = isMobile ? 1 : 0;
    const scrollThreshold = 5;

    const lock = () => {
        isAnimating = true;
        setTimeout(() => isAnimating = false, throttleDelay + 150);
    };

    const showBox = (index) => {
        boxes.forEach((box, i) => {
            box.classList.remove("active", "hidden");
            if (i === index) box.classList.add("active");
            else if (i < index) box.classList.add("hidden");
        });
        maxReachedBox = Math.max(maxReachedBox, index);
    };

    const scrollTo = (position) => {
        window.scrollTo({ top: position, behavior: "smooth" });
    };

    const toggleSections = (showAbout) => {
        fadeSections.forEach(sec => sec.classList.toggle("hidden", showAbout));
    };

    const enterAbout = (fromBelow = false) => {
        if (aboutMode !== "none") return;
        aboutMode = "entering";
        toggleSections(true);
        section.classList.add("fullscreen");

        const scrollbarOffset = window.innerWidth - document.documentElement.clientWidth;
        Object.assign(document.body.style, {
            overflow: "hidden",
            paddingRight: `${scrollbarOffset}px`,
            touchAction: "none"
        });

        currentBox = fromBelow && maxReachedBox === boxes.length - 1 ? boxes.length - 1 : 0;
        showBox(currentBox);
        scrollTo(section.offsetTop);
        lock();

        setTimeout(() => aboutMode = "in", 400);
    };

    const exitAbout = (toTop = false) => {
        if (aboutMode !== "in") return;
        aboutMode = "exiting";
        toggleSections(false);
        section.classList.remove("fullscreen");

        Object.assign(document.body.style, {
            overflow: "",
            paddingRight: "",
            touchAction: ""
        });

        scrollTo(toTop ? section.offsetTop - window.innerHeight : introduceSection.offsetTop);
        lock();

        setTimeout(() => aboutMode = "none", 500);
    };

    const handleScroll = (direction) => {
        if (isAnimating) return;

        const now = Date.now();
        if (now - lastScrollTime < throttleDelay) return;
        lastScrollTime = now;

        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;
        const winH = window.innerHeight;
        const enteringFromTop = direction === "down" && sectionTop < winH && sectionTop >= 0;
        const enteringFromBottom = direction === "up" && sectionBottom > 0 && sectionBottom <= winH;

        if (aboutMode === "none") {
            if (enteringFromTop) enterAbout(false);
            else if (enteringFromBottom) enterAbout(true);
        } else if (aboutMode === "in") {
            const maxBoxIndex = boxes.length - 1 + extraScrollMobile;
            if (direction === "down") {
                if (currentBox < maxBoxIndex) {
                    currentBox++;
                    if (currentBox <= boxes.length - 1) showBox(currentBox);
                    lock();
                    scrollTo(section.offsetTop);
                } else {
                    exitAbout(false);
                }
            } else if (direction === "up") {
                if (currentBox > 0) {
                    currentBox--;
                    if (currentBox < boxes.length) showBox(currentBox);
                    lock();
                    scrollTo(section.offsetTop);
                } else {
                    exitAbout(true);
                }
            }
        }
    };

    const throttle = (fn, delay) => {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                fn(...args);
            }
        };
    };

    // Wheel (desktop)
    window.addEventListener("wheel", throttle(e => {
        const dir = e.deltaY > 0 ? "down" : "up";
        handleScroll(dir);
        if (aboutMode !== "none" || e.deltaY < 0) e.preventDefault();
    }, throttleDelay), { passive: false });

    // Touch (mobile)
    window.addEventListener("touchstart", e => {
        touchStartY = e.touches[0].clientY;
        touchEndY = touchStartY;
    }, { passive: true });

    window.addEventListener("touchmove", throttle(e => {
        touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        const dir = deltaY > scrollThreshold ? "down" : deltaY < -scrollThreshold ? "up" : null;
        if (dir) {
            handleScroll(dir);
            touchStartY = touchEndY;
            e.preventDefault();
        }
    }, throttleDelay), { passive: false });

    window.addEventListener("touchend", () => {
        const deltaY = touchStartY - touchEndY;
        const dir = deltaY > scrollThreshold ? "down" : deltaY < -scrollThreshold ? "up" : null;
        if (dir) handleScroll(dir);
    });

    // Watch scroll (toggle fade sections)
    window.addEventListener("scroll", () => {
        const midVisible = section.getBoundingClientRect().top <= window.innerHeight / 2 &&
            section.getBoundingClientRect().bottom >= window.innerHeight / 2;
        toggleSections(midVisible);
    });

    showBox(currentBox);
});
