document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".about-container");
    const items = document.querySelectorAll(".about-container_box");
  
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const percent = scrollTop / scrollHeight;
      const activeIndex = Math.min(
        Math.floor(percent * items.length),
        items.length - 1
      );
  
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