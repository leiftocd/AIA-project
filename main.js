document.addEventListener("DOMContentLoaded", () => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
<<<<<<< HEAD
    window.scrollTo(0, 0);
=======
    requestAnimationFrame(() => window.scrollTo(0, 0));
>>>>>>> 4307c030872ee985e053ae70ef0c1f67e2610fb9

    const section = document.querySelector("#section-about");
    const boxes = document.querySelectorAll(".about-container_box");
    const introduceSection = document.querySelector("#section-introduction");
    const fadeSections = document.querySelectorAll(".fade-section");

    let currentBox = 0;
    let isAnimating = false;
<<<<<<< HEAD
    let aboutMode = "none";
    let maxReachedBox = 0;
    let lastBoxScroll = false;
    let touchStartY = 0;

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const throttleDelay = isMobile ? 100 : 200; // Giảm delay trên iOS cho vuốt mượt hơn
    const scrollThreshold = isMobile ? 5 : 5; // Giảm ngưỡng để nhận diện vuốt nhẹ

    const scrollTo = (position) => window.scrollTo({ top: position, behavior: "smooth" });
=======
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
>>>>>>> 4307c030872ee985e053ae70ef0c1f67e2610fb9

    const showBox = (index) => {
        boxes.forEach((box, i) => {
            box.classList.remove("active");
            if (i === index) {
                box.classList.add("active");
                box.style.opacity = "1";
                box.style.transform = "translateY(0)";
            } else {
                box.style.opacity = "0";
                box.style.transform = i < index ? `translateY(-20%)` : `translateY(20%)`;
            }
        });
        maxReachedBox = Math.max(maxReachedBox, index);
    };

<<<<<<< HEAD
    const toggleSections = (show) => fadeSections.forEach((sec) => (sec.style.opacity = show ? "0" : "1"));

    const enterAbout = (fromBelow) => {
        if (aboutMode !== "none") return;
        aboutMode = "entering";
        toggleSections(true);
        section.classList.add("fullscreen");

        const scrollbarOffset = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.cssText = `overflow: hidden; padding-right: ${scrollbarOffset}px; touch-action: none;`;

        currentBox = fromBelow && maxReachedBox === boxes.length - 1 ? boxes.length - 1 : 0;
        lastBoxScroll = false;
        showBox(currentBox);
        scrollTo(section.offsetTop);
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
            aboutMode = "in";
        }, 400);
    };

    const exitAbout = (toTop) => {
        if (aboutMode !== "in") return;
        aboutMode = "exiting";
        toggleSections(false);
        section.classList.remove("fullscreen");
        document.body.style.cssText = "";
        scrollTo(toTop ? section.offsetTop - window.innerHeight : introduceSection.offsetTop);
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
            aboutMode = "none";
        }, 500);
    };

    const handleScroll = (dir) => {
        if (isAnimating) return;
        isAnimating = true;
        setTimeout(() => (isAnimating = false), throttleDelay);

        const { top, bottom } = section.getBoundingClientRect();
        const winH = window.innerHeight;

        if (aboutMode === "none") {
            if (dir === "down" && top < winH && top >= 0) enterAbout(false);
            else if (dir === "up" && bottom > 0 && bottom <= winH) enterAbout(true);
        } else if (aboutMode === "in") {
            const maxBoxIndex = boxes.length - 1;
            if (dir === "down") {
                if (currentBox < maxBoxIndex) {
                    showBox(++currentBox);
                    scrollTo(section.offsetTop);
                } else if (currentBox === maxBoxIndex && !lastBoxScroll) {
                    lastBoxScroll = true;
                    scrollTo(section.offsetTop);
                } else if (currentBox === maxBoxIndex && lastBoxScroll) {
                    exitAbout(false);
                }
            } else if (dir === "up") {
                if (currentBox > 0) {
                    showBox(--currentBox);
                    lastBoxScroll = false;
=======
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
>>>>>>> 4307c030872ee985e053ae70ef0c1f67e2610fb9
                    scrollTo(section.offsetTop);
                } else {
                    exitAbout(true);
                }
            }
        }
    };

    const throttle = (fn, delay) => {
<<<<<<< HEAD
        let last = 0;
        return (...args) => {
            const now = Date.now();
            if (now - last >= delay) {
                last = now;
                return fn(...args);
=======
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                fn(...args);
>>>>>>> 4307c030872ee985e053ae70ef0c1f67e2610fb9
            }
        };
    };

<<<<<<< HEAD
    // Wheel
    window.addEventListener(
        "wheel",
        throttle((e) => {
            handleScroll(e.deltaY > 0 ? "down" : "up");
            if (aboutMode !== "none") e.preventDefault();
        }, throttleDelay),
        { passive: false }
    );

    // Touch
    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener(
        "touchmove",
        throttle((e) => {
            const touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            const dir = deltaY > scrollThreshold ? "down" : deltaY < -scrollThreshold ? "up" : null;
            if (dir) {
                handleScroll(dir);
                touchStartY = touchEndY;
                if (aboutMode !== "none") e.preventDefault();
            }
        }, throttleDelay),
        { passive: false }
    );

    // IntersectionObserver
    new IntersectionObserver(([{ isIntersecting }]) => toggleSections(isIntersecting), { threshold: 0.5 }).observe(section);

    showBox(currentBox);
});
=======
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
>>>>>>> 4307c030872ee985e053ae70ef0c1f67e2610fb9
