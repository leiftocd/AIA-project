document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("#section-about");
    const boxes = document.querySelectorAll(".about-container_box");
    const introduceSection = document.querySelector("#section-introduction");
    const bannerSection = document.querySelector("#section-banner");

    let currentBox = 0;
    let inAbout = false;
    let lastScrollTime = 0;
    const throttleDelay = 700; // Giữ 700ms

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

    // Ẩn/hiện banner và introduction
    const toggleSections = (isInAbout) => {
        bannerSection.style.opacity = isInAbout ? 0 : 1;
        bannerSection.style.visibility = isInAbout ? "hidden" : "visible";
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

    // Xử lý wheel với throttle
    window.addEventListener("wheel", throttle((e) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;
        inAbout = isInViewport(section);

        if (inAbout || (e.deltaY > 0 && sectionTop < window.innerHeight && sectionTop >= 0)) {
            e.preventDefault();
            toggleSections(true); // Ẩn banner và introduction khi focus vào about

            if (e.deltaY > 0) { // Cuộn xuống
                if (currentBox < boxes.length - 1) {
                    currentBox++;
                    showBox(currentBox);
                    // Không dùng scrollTo ở đây để tránh nhảy
                } else if (currentBox === boxes.length - 1) {
                    toggleSections(false); // Hiện lại banner và introduction
                    inAbout = false;
                    window.scrollTo({
                        top: section.offsetTop + section.offsetHeight * 1.5,
                        behavior: "smooth",
                    });
                }
            } else if (e.deltaY < 0) { // Cuộn lên
                if (currentBox > 0) {
                    currentBox--;
                    showBox(currentBox);
                    // Không dùng scrollTo ở đây để tránh nhảy
                } else {
                    toggleSections(false); // Hiện lại banner và introduction
                    inAbout = false;
                    window.scrollTo({
                        top: section.offsetTop - window.innerHeight * 1.5,
                        behavior: "smooth",
                    });
                }
            }
        } else if (e.deltaY < 0 && sectionTop > 0 && sectionTop <= window.innerHeight * 1.5) {
            // Cuộn lên từ dưới để focus vào about
            e.preventDefault();
            toggleSections(true);
            inAbout = true;
            currentBox = 0; // Reset về box đầu tiên
            showBox(currentBox);
            window.scrollTo({
                top: section.offsetTop,
                behavior: "smooth",
            });
        }
    }, throttleDelay), { passive: false });

    // Xử lý scroll để đồng bộ trạng thái
    window.addEventListener("scroll", () => {
        inAbout = isInViewport(section);
        toggleSections(inAbout);
    });
});