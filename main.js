document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll(".about-container_box");
    const sectionAbout = document.querySelector("#section-about");

    if (!sectionAbout || items.length === 0) return;

    const handleScroll = () => {
        const sectionTop = sectionAbout.offsetTop;
        const sectionHeight = sectionAbout.offsetHeight;
        const scrollMid = window.scrollY + window.innerHeight / 2;

        const scrollPercent = (scrollMid - sectionTop) / sectionHeight;

        // Reset all items
        items.forEach((item, index) => {
            item.classList.remove("active", "hidden");
            item.style.top = "";
        });

        if (scrollPercent >= 1 && items[2]) {
            items[0].classList.add("hidden");
            items[2].classList.add("active");
            items[2].style.top = "80%";
            items[0].style.top = "20%";
        } else if (scrollPercent >= 0.4 && items[1]) {
            items[1].classList.add("active");
            items[2].style.top = "80%";
        } else if (scrollPercent >= 0 && items[0]) {
            items[0].classList.add("active");
            items[2].classList.add("hidden");
        } else {
            items[0].classList.add("active");
        }
    };

    items[0].classList.add("active");

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger once on load
});
