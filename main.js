document.addEventListener("DOMContentLoaded", () => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const section = document.querySelector("#section-about");
    const boxes = document.querySelectorAll(".about-container_box");
    const introduceSection = document.querySelector("#section-introduction");
    const fadeSections = document.querySelectorAll(".fade-section");

    let currentBox = 0;
    let isAnimating = false;
    let aboutMode = "none";
    let maxReachedBox = 0;
    let lastBoxScroll = false;
    let touchStartY = 0;

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const throttleDelay = isMobile ? 150 : 200;
    const scrollThreshold = isMobile ? 20 : 5;
    const mediaQuery = window.matchMedia("(min-width: 641px)");

    const scrollTo = (position) => window.scrollTo({ top: position, behavior: "smooth" });

    const showBox = (index) => {
        if (!mediaQuery.matches) return;
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
        section.classList.add("fullscreen");
    
        if (mediaQuery.matches) {
            const scrollbarOffset = window.innerWidth - document.documentElement.clientWidth;
            const scrollY = window.scrollY;
            document.body.style.top = `-${scrollY}px`;
            document.body.classList.add("no-scroll");
            document.body.style.paddingRight = `${scrollbarOffset}px`;
            document.body.style.touchAction = "none";
        }
    
        currentBox = fromBelow && maxReachedBox === boxes.length - 1 ? boxes.length - 1 : 0;
        lastBoxScroll = false;
        if (mediaQuery.matches) showBox(currentBox);
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
    
        if (mediaQuery.matches) {
            document.body.classList.remove("no-scroll");
            document.body.style.top = "";
            document.body.style.paddingRight = "";
            document.body.style.touchAction = "";
            document.body.style.overflow = "";
        }
    
        scrollTo(toTop ? section.offsetTop - window.innerHeight : introduceSection.offsetTop);
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
            aboutMode = "none";
        }, 100);
    };

    const handleScroll = (dir) => {
        if (isAnimating) return;
        isAnimating = true;
        setTimeout(() => (isAnimating = false), throttleDelay);

        const { top, bottom } = section.getBoundingClientRect();
        const winH = window.innerHeight;

        if (aboutMode === "none") {
            if (dir === "down" && top < winH * 0.3 && top >= 0) enterAbout(false);
            else if (dir === "up" && bottom > winH * 0.7 && bottom <= winH) enterAbout(true);
        } else if (aboutMode === "in" && mediaQuery.matches) {
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
                    scrollTo(section.offsetTop);
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

    // Wheel
    window.addEventListener(
        "wheel",
        throttle((e) => {
            handleScroll(e.deltaY > 0 ? "down" : "up");
            if (aboutMode !== "none" && mediaQuery.matches) e.preventDefault();
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
                if (aboutMode !== "none" && mediaQuery.matches) e.preventDefault();
            }
        }, throttleDelay),
        { passive: false }
    );

    // IntersectionObserver
    new IntersectionObserver(
        ([{ isIntersecting }]) => toggleSections(isIntersecting),
        { threshold: 0.7 }
    ).observe(section);

    showBox(currentBox);

    const paragraphs = document.querySelectorAll('.text-appear');
    const paragraphObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    paragraphs.forEach(paragraph => paragraphObserver.observe(paragraph));

    // Split headings into spans for animation
    document.querySelectorAll('.heading-fade-in').forEach(title => {
        const text = title.textContent.trim();
        title.textContent = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            title.appendChild(span);
        });
    });

    // Observe headings for fade-in animation
    const headings = document.querySelectorAll('.heading-fade-in');
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                headingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    headings.forEach(heading => headingObserver.observe(heading));

    // Introduction box interactions
    const boxIntro = document.querySelectorAll('.introduction-content_box');
    let activeBox = null;
    let leaveTimeout = null;
    
    function resetActiveBox() {
        if (!activeBox) return;
        activeBox.classList.remove('active');
        boxIntro.forEach((b) => b.classList.remove('hidden'));
        activeBox = null;
    }
    
    boxIntro.forEach((box) => {
        box.addEventListener('mouseenter', () => {
            if (activeBox || 'ontouchstart' in window) return;
            activeBox = box;
            box.classList.add('active');
            boxIntro.forEach((b) => {
                if (b !== box) b.classList.add('hidden');
            });
        });
    
        box.addEventListener('click', () => {
            const isSameBox = activeBox === box;
            if (isSameBox) {
                resetActiveBox();
            } else {
                if (activeBox) {
                    activeBox.classList.remove('active');
                    boxIntro.forEach((b) => b.classList.remove('hidden'));
                }
                activeBox = box;
                box.classList.add('active');
                boxIntro.forEach((b) => {
                    if (b !== box) b.classList.add('hidden');
                });
            }
        });
    
        box.addEventListener('mouseleave', () => {
            if (leaveTimeout) clearTimeout(leaveTimeout);
            leaveTimeout = setTimeout(() => {
                if (box.matches(':hover')) return;
                if (activeBox === box) resetActiveBox();
            }, 100);
        });
    });
});