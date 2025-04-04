document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll(".about-container_box");
    const sectionAbout = document.querySelector("#section-about");
    function handleScroll() {
        const sectionRect = sectionAbout.getBoundingClientRect();
        const sectionHeight = sectionAbout.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight / 2; // Middle of viewport
        const sectionTop = sectionRect.top + window.scrollY;
        // Calculate scroll percentage
        const scrollPercent = (scrollPosition - sectionTop) / sectionHeight;
        // Reset styles
        items.forEach(item => item.classList.remove("active"));
        items.forEach(item => item.style.top = ""); 

        if (scrollPercent >= 1 && items[2]) {
            items[2].classList.add("active");
            items[2].style.top = "80%"; // Move item 3
            items[0].style.top = "20%"; // Ensure item 1 moves when item 3 is active
        } else if (scrollPercent >= 0.75 && items[1]) {
            items[1].classList.add("active");
            items[2].style.top = "80%"; // Keep moving item 3
        } else if (scrollPercent >= 0.33 && items[0]) {
            items[0].classList.add("active");
        } else if (items[0]) {
            items[0].classList.add("active");
        }
    }
    // Initial active state
    items[0].classList.add("active");

    // Add scroll listener for both mobile & desktop
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
});
