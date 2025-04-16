// smooth-scroll-handler.js

// Ensure page loads at top
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
    const sectionAbout = document.querySelector("#section-about");
    const sectionIntro = document.querySelector("#section-introduction");
    const sectionProfession = document.querySelector("#section-profession");
    const sectionCommunity = document.querySelector("#section-community");
    const sectionFooter = document.querySelector("footer");
    const fadeSections = document.querySelectorAll(".fade-section");
    const boxes = document.querySelectorAll(".about-container_box");

    let currentBox = 0;
    let aboutMode = "none"; // none, in, entering, exiting
    let isAnimating = false;
    let isCustomScrolling = false;
    let scrollAnimationId = null;
    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let initialScrollHandled = false;
    let lastBoxScroll = false;
    let maxReachedBox = 0;

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const throttleDelay = isMobile ? 100 : 200;
    const scrollThreshold = isMobile ? 5 : 5;

    const scrollTo = (position) => window.scrollTo({ top: position, behavior: "smooth" });

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

    const toggleSections = (show) => fadeSections.forEach((sec) => (sec.style.opacity = show ? "0" : "1"));

    const enterAbout = (fromBelow) => {
        if (aboutMode !== "none") return;
        aboutMode = "entering";
        toggleSections(true);
        sectionAbout.classList.add("fullscreen");

        const scrollbarOffset = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.cssText = `overflow: hidden; padding-right: ${scrollbarOffset}px; touch-action: none;`;

        currentBox = fromBelow && maxReachedBox === boxes.length - 1 ? boxes.length - 1 : 0;
        lastBoxScroll = false;
        showBox(currentBox);
        scrollTo(sectionAbout.offsetTop);

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
        sectionAbout.classList.remove("fullscreen");
        document.body.style.cssText = "";
        scrollTo(toTop ? sectionAbout.offsetTop - window.innerHeight : sectionIntro.offsetTop);

        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
            aboutMode = "none";
        }, 100);
    };

    const handleScroll = (dir) => {
        if (isAnimating || isCustomScrolling) return;
        isAnimating = true;
        setTimeout(() => (isAnimating = false), throttleDelay);

        const { top, bottom } = sectionAbout.getBoundingClientRect();
        const winH = window.innerHeight;

        if (aboutMode === "none") {
            if (dir === "down" && top < winH && top >= 0) enterAbout(false);
            else if (dir === "up" && bottom > 0 && bottom <= winH) enterAbout(true);
        } else if (aboutMode === "in") {
            const maxBoxIndex = boxes.length - 1;
            if (dir === "down") {
                if (currentBox < maxBoxIndex) {
                    showBox(++currentBox);
                    scrollTo(sectionAbout.offsetTop);
                } else if (currentBox === maxBoxIndex && !lastBoxScroll) {
                    lastBoxScroll = true;
                    scrollTo(sectionAbout.offsetTop);
                } else {
                    exitAbout(false);
                }
            } else if (dir === "up") {
                if (currentBox > 0) {
                    showBox(--currentBox);
                    lastBoxScroll = false;
                    scrollTo(sectionAbout.offsetTop);
                } else {
                    exitAbout(true);
                }
            }
        }
    };

    const throttle = (fn, delay) => {
        let last = 0;
        return (...args) => {
            const now = Date.now();
            if (now - last >= delay) {
                last = now;
                return fn(...args);
            }
        };
    };

    // Smooth scroll animation for custom scrolling
    const smoothScrollAnimation = () => {
        const delta = targetScrollY - currentScrollY;

        // If the difference is very small, stop the animation
        if (Math.abs(delta) < 0.5) {
            currentScrollY = targetScrollY; // Ensure we reach the exact position
            isCustomScrolling = false;
            cancelAnimationFrame(scrollAnimationId); // Stop animation frames
            scrollAnimationId = null;
            return;
        }

        // Adjust scroll speed (lower multiplier = slower scroll)
        currentScrollY += delta * 0.1; // This controls the speed of scrolling (smaller = slower)

        // Scroll to the new position
        window.scrollTo(0, currentScrollY);

        // Continue the smooth scroll animation
        scrollAnimationId = requestAnimationFrame(smoothScrollAnimation);
    };

    // WHEEL
    window.addEventListener(
        "wheel",
        throttle((e) => {
            const dir = e.deltaY > 0 ? "down" : "up";

            if (!initialScrollHandled && dir === "down" && window.scrollY === 0) {
                initialScrollHandled = true;
                isCustomScrolling = true;
                targetScrollY = sectionAbout.offsetTop;
                scrollAnimationId = requestAnimationFrame(smoothScrollAnimation);
                setTimeout(() => { isCustomScrolling = false; }, 600);
                e.preventDefault();
                return;
            }

            handleScroll(dir);
            if (aboutMode !== "none") e.preventDefault();
        }, throttleDelay),
        { passive: false }
    );

    // TOUCH
    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchmove", throttle((e) => {
        const touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        const dir = deltaY > scrollThreshold ? "down" : deltaY < -scrollThreshold ? "up" : null;

        if (!initialScrollHandled && dir === "down" && window.scrollY === 0) {
            initialScrollHandled = true;
            isCustomScrolling = true;
            targetScrollY = sectionAbout.offsetTop;
            scrollAnimationId = requestAnimationFrame(smoothScrollAnimation);
            setTimeout(() => { isCustomScrolling = false; }, 600);
            e.preventDefault();
            return;
        }

        if (dir) {
            handleScroll(dir);
            touchStartY = touchEndY;
            if (aboutMode !== "none") e.preventDefault();
        }
    }, throttleDelay), { passive: false });

    new IntersectionObserver(([entry]) => toggleSections(entry.isIntersecting), { threshold: 0.5 })
        .observe(sectionAbout);

    showBox(currentBox);
});
