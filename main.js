document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("#section-about");
    const boxes = document.querySelectorAll(".about-container_box");
    const introduceSection = document.querySelector("#section-introduction");
    let currentBox = 0;
    let inAbout = false;
    let lastScrollTime = 0;
    const throttleDelay = 500;
    let touchStartY = 0;
    let touchEndY = 0;

    // Hàm hiển thị box
    const showBox = (index) => {
        boxes.forEach((box, i) => {
            box.classList.remove("active", "hidden");
            if (i === index) {
                box.classList.add("active");
            } else if (i < index) {
                box.classList.add("hidden");
            }
        });
    };

    // Kiểm tra section trong viewport
    const isInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
    };

    // Ẩn/hiện introduction
    const toggleSections = (isInAbout) => {
        introduceSection.style.opacity = isInAbout ? 0 : 1;
        introduceSection.style.visibility = isInAbout ? "hidden" : "visible";
    };

    // Hiển thị box đầu tiên
    showBox(currentBox);

    // Throttle function
    const throttle = (func, delay) => {
        return (...args) => {
            const now = Date.now();
            if (now - lastScrollTime >= delay) {
                func(...args);
                lastScrollTime = now;
            }
        };
    };

    // Xử lý wheel cho máy tính (giữ nguyên)
    window.addEventListener("wheel", throttle((e) => {
        const sectionTop = section.getBoundingClientRect().top;
        inAbout = isInViewport(section);

        if (e.deltaY > 0 && sectionTop < window.innerHeight && sectionTop >= 0 && !inAbout) {
            e.preventDefault();
            toggleSections(true);
            inAbout = true;
            currentBox = 0;
            showBox(currentBox);
            window.scrollTo({
                top: section.offsetTop,
                behavior: "smooth",
            });
        } else if (inAbout) {
            e.preventDefault();
            toggleSections(true);

            if (e.deltaY > 0) { // Cuộn xuống
                if (currentBox < boxes.length - 1) {
                    currentBox++;
                    showBox(currentBox);
                    window.scrollTo({
                        top: section.offsetTop,
                        behavior: "smooth",
                    });
                } else if (currentBox === boxes.length - 1) {
                    toggleSections(false);
                    inAbout = false;
                    window.scrollTo({
                        top: section.offsetTop + section.offsetHeight,
                        behavior: "smooth",
                    });
                }
            } else if (e.deltaY < 0) { // Cuộn lên
                if (currentBox > 0) {
                    currentBox--;
                    showBox(currentBox);
                    window.scrollTo({
                        top: section.offsetTop,
                        behavior: "smooth",
                    });
                } else {
                    toggleSections(false);
                    inAbout = false;
                    window.scrollTo({
                        top: section.offsetTop - window.innerHeight,
                        behavior: "smooth",
                    });
                }
            }
        } else if (e.deltaY < 0 && sectionTop > window.innerHeight && window.scrollY > 0) {
            e.preventDefault();
            toggleSections(true);
            inAbout = true;
            currentBox = 0;
            showBox(currentBox);
            window.scrollTo({
                top: section.offsetTop,
                behavior: "smooth",
            });
        }
    }, throttleDelay), { passive: false });

    // Touch events (mobile)
    let scrollCount = 0; // Đếm số lần vuốt trong about

    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
        if (isInViewport(section)) e.preventDefault();
    }, { passive: false });

    window.addEventListener("touchmove", throttle((e) => {
        touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        const sectionTop = section.getBoundingClientRect().top;
        inAbout = isInViewport(section);

        if (deltaY > 0 && sectionTop < window.innerHeight && sectionTop >= 0 && !inAbout) {
            // Từ banner vuốt xuống vào about
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

            if (deltaY > 0) { // Vuốt xuống (tăng scrollCount)
                scrollCount++;
                if (scrollCount === 1) {
                    currentBox = 1; // Box 2
                    showBox(currentBox);
                } else if (scrollCount === 2) {
                    currentBox = 2; // Box 3
                    showBox(currentBox);
                } else if (scrollCount === 3) { // Vuốt lần thứ 3 để thoát xuống introduction
                    toggleSections(false);
                    inAbout = false;
                    window.scrollTo({ 
                        top: introduceSection.offsetTop, 
                        behavior: "smooth" 
                    }); // Cuộn mượt đến đầu introduction
                    scrollCount = 0;
                }
                if (scrollCount < 3) { // Giữ trong section about cho đến khi scrollCount = 3
                    window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
                }
            } else if (deltaY < 0) { // Vuốt lên
                if (scrollCount > 0) {
                    scrollCount--;
                    if (scrollCount === 1) {
                        currentBox = 1; // Box 2
                        showBox(currentBox);
                    } else if (scrollCount === 0) {
                        currentBox = 0; // Box 1
                        showBox(currentBox);
                    }
                    window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
                } else if (scrollCount === 0) { // Thoát lên khỏi about khi ở box 1
                    toggleSections(false);
                    inAbout = false;
                    window.scrollTo({ top: section.offsetTop - window.innerHeight, behavior: "smooth" });
                }
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