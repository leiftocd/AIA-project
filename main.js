document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("#section-about");
    const boxes = document.querySelectorAll(".about-container_box");
    const introduceSection = document.querySelector("#section-introduction");
    let currentBox = 0;
    let inAbout = false;
    let lastScrollTime = 0;
    const throttleDelay = 500; // Giới hạn 500ms giữa các lần cuộn

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

    // Xử lý wheel với throttle
    window.addEventListener("wheel", throttle((e) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;
        inAbout = isInViewport(section);

        if (e.deltaY > 0 && sectionTop < window.innerHeight && sectionTop >= 0 && !inAbout) {
            // Khi cuộn xuống từ trên (banner) vào about
            e.preventDefault();
            toggleSections(true);
            inAbout = true;
            currentBox = 0; // Reset về box 1
            showBox(currentBox);
            window.scrollTo({
                top: section.offsetTop,
                behavior: "smooth",
            });
        } else if (inAbout) {
            // Khi đã trong section about
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
            // Chỉ cho phép vào about từ dưới khi section about nằm dưới viewport và chưa ở đỉnh trang
            e.preventDefault();
            toggleSections(true);
            inAbout = true;
            currentBox = 0; // Reset về box 1
            showBox(currentBox);
            window.scrollTo({
                top: section.offsetTop,
                behavior: "smooth",
            });
        }
        // Nếu đã ở đỉnh trang (scrollY === 0), không làm gì khi tiếp tục scroll lên
    }, throttleDelay), { passive: false });

    // Xử lý scroll để đồng bộ trạng thái
    window.addEventListener("scroll", () => {
        inAbout = isInViewport(section);
        toggleSections(inAbout);
    });
});