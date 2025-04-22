document.addEventListener("DOMContentLoaded", () => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const section = document.querySelector("#section-about");
    const boxes = document.querySelectorAll(".about-container_box");
    const introduceSection = document.querySelector("#section-introduction");
    const fadeSections = document.querySelectorAll(".fade-section");

    const mediaQuery = window.matchMedia("(min-width: 641px)");

    // Only apply about section logic for desktop (viewport > 640px)
    if (mediaQuery.matches) {
        let currentBox = 0;
        let isAnimating = false;
        let aboutMode = "none";
        let maxReachedBox = 0;
        let lastBoxScroll = false;
        let isInitialLoad = true;
        let isLocked = false; 

        const throttleDelay = 200;
        const throttleDelayBox = 500;
        const lockDuration = 300; 

        console.log("Number of boxes:", boxes.length);

        const scrollTo = (position) => window.scrollTo({ top: position, behavior: "smooth" });

        const showBox = (index) => {
            if (index < 0 || index >= boxes.length) {
                console.error("Invalid box index:", index);
                return;
            }
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
            console.log("showBox - currentBox:", index);
        };

        const toggleSections = (show) => fadeSections.forEach((sec) => (sec.style.opacity = show ? "0" : "1"));

        const enterAbout = (fromBelow) => {
            if (aboutMode !== "none") return;
            aboutMode = "entering";
            toggleSections(true);
            section.classList.add("fullscreen");

            const scrollbarOffset = window.innerWidth - document.documentElement.clientWidth;
            const scrollY = window.scrollY;
            document.body.style.top = `-${scrollY}px`;
            document.body.classList.add("no-scroll");
            document.body.style.paddingRight = `${scrollbarOffset}px`;
            document.body.style.touchAction = "none";

            currentBox = isInitialLoad ? 0 : fromBelow ? boxes.length - 1 : 0;
            console.log("enterAbout - fromBelow:", fromBelow, "currentBox:", currentBox);
            lastBoxScroll = false;
            showBox(currentBox);
            scrollTo(section.offsetTop);
            isAnimating = true;
            isLocked = true; // Khóa chuyển đổi box
            setTimeout(() => {
                isAnimating = false;
                aboutMode = "in";
                isInitialLoad = false;
                setTimeout(() => {
                    isLocked = false; // Mở khóa sau lockDuration
                }, lockDuration);
            }, 400);
        };

        const exitAbout = (toTop) => {
            if (aboutMode !== "in") return;
            aboutMode = "exiting";
            toggleSections(false);
            section.classList.remove("fullscreen");

            document.body.classList.remove("no-scroll");
            document.body.style.top = "";
            document.body.style.paddingRight = "";
            document.body.style.touchAction = "";
            document.body.style.overflow = "";

            scrollTo(toTop ? section.offsetTop - window.innerHeight : introduceSection.offsetTop);
            isAnimating = true;
            setTimeout(() => {
                isAnimating = false;
                aboutMode = "none";
            }, 100);
        };

        const handleScroll = (dir) => {
            if (isAnimating || isLocked) return; // Ngăn chuyển box khi khóa
            isAnimating = true;
            setTimeout(() => (isAnimating = false), aboutMode === "in" ? throttleDelayBox : throttleDelay);

            const { top, bottom } = section.getBoundingClientRect();
            const winH = window.innerHeight;

            if (aboutMode === "none") {
                if (dir === "down" && top < winH * 0.8 && top >= 0) { // Chỉ kích hoạt khi section gần đầy khung nhìn
                    enterAbout(false);
                } else if (dir === "up" && bottom > 0 && bottom <= winH) {
                    enterAbout(true);
                }
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

        window.addEventListener(
            "wheel",
            throttle((e) => {
                const dir = e.deltaY > 0 ? "down" : "up";
                handleScroll(dir);
                if (aboutMode !== "none") e.preventDefault();
            }, throttleDelay),
            { passive: false }
        );

        new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && aboutMode === "none") {
                    const fromBelow = entry.boundingClientRect.top <= 0;
                    console.log("IntersectionObserver - fromBelow:", fromBelow);
                    enterAbout(fromBelow);
                    toggleSections(true);
                } else if (!entry.isIntersecting && aboutMode === "none") {
                    toggleSections(false);
                }
            },
            { threshold: 0.3 } // Tăng threshold để kích hoạt khi section hiển thị nhiều hơn
        ).observe(section);

        // Initialize with box 1 for desktop
        showBox(0);
    }
    else {
        const observerOptions = {
            threshold: 0.6, // Tùy chỉnh mức độ box cần vào view để kích hoạt
        };
    
        const mobileBoxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Thêm 'activeM' chỉ khi phần tử chưa có lớp này
                    if (!entry.target.classList.contains('activeM')) {
                        entry.target.classList.add('activeM');
                        entry.target.classList.remove('exiting');
                        entry.target.style.transition = "opacity 0.5s ease, transform 0.5s ease"; // Hiệu ứng mượt mà
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }
                } else {
                    // Thêm 'exiting' chỉ khi phần tử chưa có lớp này
                    if (!entry.target.classList.contains('exiting')) {
                        entry.target.classList.add('exiting');
                        entry.target.classList.remove('activeM');
                        entry.target.style.transition = "opacity 0.5s ease, transform 0.5s ease"; // Hiệu ứng mượt mà
                        entry.target.style.opacity = "0";
                        entry.target.style.transform = "translateY(20%)"; // Hoặc một hiệu ứng bạn muốn khi phần tử biến mất
                    }
                }
            });
        }, observerOptions);
    
        // Theo dõi tất cả các box
        boxes.forEach(box => {
            mobileBoxObserver.observe(box);
        });
    }

    // Other sections (unchanged)
    const paragraphs = document.querySelectorAll('.text-appear');
    const paragraphObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    paragraphs.forEach(paragraph => paragraphObserver.observe(paragraph));

    document.querySelectorAll('.heading-fade-in').forEach(title => {
        const text = title.textContent.trim();
        title.textContent = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            title.appendChild(span);
        });
    });

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