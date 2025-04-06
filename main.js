document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".about-container");
    const items = document.querySelectorAll(".about-container_box");

    const handleScroll = () => {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        const percent = scrollTop / scrollHeight;

        let activeIndex = 0;
        if (percent > 0 && percent < 0.51) {
            activeIndex = 1; // Box 2
        }
        else if (percent >= 0.51) {
            activeIndex = 2; // Box 3
        }
        if (percent === 0) {
            activeIndex = 0; // Box 1
        }
        items.forEach((item, index) => {
            item.classList.remove("active", "hidden");
            if (index === activeIndex) {
                item.classList.add("active");
            } else if (index < activeIndex) {
                item.classList.add("hidden");
            }
        });
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger once on load
});
