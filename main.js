document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("#section-about");
    const boxes = document.querySelectorAll(".about-container_box");
    const introduceSection = document.querySelector("#section-introduction");
    let currentBox = 0;
    let inAbout = false;
    let scrollCount = 0;
    let touchStartY = 0;

    const showBox = (index) => {
        boxes.forEach((box, i) => {
            box.classList.toggle("active", i === index);
            box.classList.toggle("hidden", i < index);
        });
    };

    const toggleSections = (isInAbout) => {
        introduceSection.style.opacity = isInAbout ? 0 : 1;
        introduceSection.style.visibility = isInAbout ? "hidden" : "visible";
    };

    const isInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
    };

    showBox(currentBox);

    // Touch events
    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
        if (isInViewport(section)) e.preventDefault();
    }, { passive: false });

    window.addEventListener("touchmove", (e) => {
        const touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;

        // Chỉ cần có deltaY (vuốt lên hoặc xuống) là tính, không cần ngưỡng
        if (deltaY === 0) return;

        inAbout = isInViewport(section);
        toggleSections(inAbout);

        if (!inAbout && deltaY > 0 && section.getBoundingClientRect().top < window.innerHeight) {
            inAbout = true;
            scrollCount = 0;
            currentBox = 0;
            showBox(currentBox);
            window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
        } else if (inAbout) {
            if (deltaY > 0) { // Vuốt lên
                scrollCount++;
                if (scrollCount === 1) currentBox = 1; // Box 2
                else if (scrollCount === 2) currentBox = 2; // Box 3
                else if (scrollCount >= 4) {
                    // Thoát xuống introduction sau khi đủ 4 lần vuốt
                    inAbout = false;
                    toggleSections(false);
                    window.scrollTo({ top: introduceSection.offsetTop, behavior: "smooth" });
                    scrollCount = 0; // Reset sau khi thoát
                    return;
                }
                showBox(currentBox);
                window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
            } else if (deltaY < 0 && scrollCount === 0) { // Vuốt xuống, chỉ thoát khi ở mốc 0
                inAbout = false;
                toggleSections(false);
                window.scrollTo({ top: section.offsetTop - window.innerHeight, behavior: "smooth" });
            }
        }
        touchStartY = touchEndY;
    }, { passive: false });

    window.addEventListener("scroll", () => {
        inAbout = isInViewport(section);
        toggleSections(inAbout);
    });
});