document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("#section-about");
    const boxes = document.querySelectorAll(".about-container_box");
    const introduceSection = document.querySelector("#section-introduction");
    let currentBox = 0; // Bắt đầu từ box 1 (index 0)
    let inAbout = false;
    let lastScrollTime = 0;
    let scrollCount = 0; // Đếm số lần scroll trong about
    const throttleDelay = /Mobi|Android/i.test(navigator.userAgent) ? 100 : 200;
    const touchThreshold = 0; // Ngưỡng vuốt
    let touchStartY = 0;
    let touchEndY = 0;

    const showBox = (index) => {
        boxes.forEach((box, i) => {
            box.classList.remove("active", "hidden");
            if (i === index) box.classList.add("active");
            else if (i < index) box.classList.add("hidden");
        });
    };

    const isInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
    };

    const toggleSections = (isInAbout) => {
        introduceSection.style.opacity = isInAbout ? 0 : 1;
        introduceSection.style.visibility = isInAbout ? "hidden" : "visible";
    };

    const throttle = (func, delay) => {
        return (...args) => {
            const now = Date.now();
            if (now - lastScrollTime >= delay) {
                func(...args);
                lastScrollTime = now;
            }
        };
    };

    showBox(currentBox); // Hiển thị box 1 ban đầu

    // (desktop)
    window.addEventListener("wheel", throttle((e) => {
        const sectionTop = section.getBoundingClientRect().top;
        inAbout = isInViewport(section);

        if (e.deltaY > 0 && sectionTop < window.innerHeight && sectionTop >= 0 && !inAbout) {
            // Vào about từ trên
            e.preventDefault();
            toggleSections(true);
            inAbout = true;
            currentBox = 0;
            scrollCount = 0;
            showBox(currentBox);
            window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
        } else if (inAbout) {
            e.preventDefault();
            toggleSections(true);

            if (e.deltaY > 0) { // Scroll xuống
                scrollCount++;
                if (scrollCount === 1) {
                    currentBox = 1; // Box 2
                    showBox(currentBox);
                } else if (scrollCount === 2) {
                    currentBox = 2; // Box 3
                    showBox(currentBox);
                } else if (scrollCount >= 4) {
                    // Thoát about và cuộn đến introduction
                    toggleSections(false);
                    inAbout = false;
                    window.scrollTo({ top: introduceSection.offsetTop, behavior: "smooth" });
                }
                if (scrollCount < 4) {
                    window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
                }
            } else if (e.deltaY < 0) { // Scroll lên
                scrollCount = 0;
                toggleSections(false);
                inAbout = false;
                window.scrollTo({ top: section.offsetTop - window.innerHeight, behavior: "smooth" });
            }
        }
    }, throttleDelay), { passive: false });

    // (mobile)
    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
        if (isInViewport(section)) e.preventDefault();
    }, { passive: false });

    window.addEventListener("touchmove", throttle((e) => {
        touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        if (Math.abs(deltaY) < touchThreshold) return;
    
        const sectionTop = section.getBoundingClientRect().top;
        inAbout = isInViewport(section);
    
        if (deltaY > 0 && sectionTop < window.innerHeight && sectionTop >= 300 && !inAbout) {
            e.preventDefault();
            toggleSections(true);
            inAbout = true;
            currentBox = 0;
            scrollCount = 0;
            showBox(currentBox);
            window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
        } else if (inAbout) {
            e.preventDefault();
            toggleSections(true);
    
            if (deltaY > touchThreshold) { // Vuốt lên (scroll xuống)
                scrollCount++;
                if (scrollCount === 1) {
                    currentBox = 1; // Box 2
                    showBox(currentBox);
                } else if (scrollCount === 2) {
                    currentBox = 2; // Box 3
                    showBox(currentBox);
                } else if (scrollCount >= 4) {
                    // Thoát about và cuộn đến introduction
                    toggleSections(false);
                    inAbout = false;
                    window.scrollTo({ top: introduceSection.offsetTop, behavior: "smooth" });
                }
                if (scrollCount < 4) {
                    window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
                }
            } else if (deltaY < -touchThreshold) { // Vuốt xuống (scroll lên)
                scrollCount = 0;
                toggleSections(false);
                inAbout = false;
                window.scrollTo({ top: section.offsetTop - window.innerHeight, behavior: "smooth" });
            }
        }
        touchStartY = touchEndY;
    }, throttleDelay), { passive: false });

    window.addEventListener("touchend", () => {
        touchStartY = 0;
        touchEndY = 0;
    }, { passive: true });

    window.addEventListener("scroll", () => {
        inAbout = isInViewport(section);
        toggleSections(inAbout);
    });
});