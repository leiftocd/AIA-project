

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".about-container_box");

    // Set initial active state
    items[0].classList.add("active");
    
    let timeout; // Store timeout reference
    
    function updateStyles() {
        clearTimeout(timeout); // Clear any previous timeout
    
        timeout = setTimeout(() => {
            // Reset all item positions first
            items.forEach(item => item.style.top = "");
    
            // If item 2 (index 1) is active, move item 3 (index 2) to top: 80%
            if (items[1].classList.contains("active") && items[2]) {
                items[2].style.top = "80%";
            } 
            
            // If item 3 (index 2) is active, move item 1 (index 0) to top: 20%
            if (items[2].classList.contains("active") && items[0]) {
                items[0].style.top = "20%";
                items[2].style.top = "80%";
            }
        }, 200); // Adjust delay as needed
    }
    
    // Add event listener to each item
    items.forEach(item => {
        item.addEventListener("mouseenter", () => {
            clearTimeout(timeout); // Clear timeout on new hover
            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
    
            updateStyles();
        });
    });
    


  const swiper = new Swiper('.mySwiper', {
    spaceBetween: 40, // Space between slides
    loop: true, // Enable looping
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    autoplay: {
        delay: 3000, // Auto-slide every 3 seconds
        disableOnInteraction: false,
    },
    breakpoints: {
        1440: { slidesPerView: 6 }, // 6 slides on 1440px and above
        1200: { slidesPerView: 6 }, // 6 slides on 1440px and above
        990: { slidesPerView: 5 },  // 4 slides on 990px and above
        640: { slidesPerView: 4 },  // 3 slides on 640px and above
        375: { slidesPerView: 3 },  // 3 slides on 640px and above
        0: { slidesPerView: 2 }     // Default: 2 slides for smaller screens
    }
  });
  // swiper Mobile
  const topSwiper = new Swiper('.top-slide', {
    spaceBetween: 40, // Space between slides
    loop: true, // Enable looping
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    autoplay: {
        delay: 3000, // Auto-slide every 3 seconds
        disableOnInteraction: false,
    },
    breakpoints: {
  
        640: { slidesPerView: 3 },  // 3 slides on 640px and above
        375: { slidesPerView: 3 },  // 3 slides on 640px and above
        0: { slidesPerView: 2 }     // Default: 2 slides for smaller screens
    }
  });
  // bottom
  const BotSwiper = new Swiper('.bottom-slide', {
    spaceBetween: 40, // Space between slides
    loop: true, // Enable looping
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    autoplay: {
        delay: 3000, // Auto-slide every 3 seconds
        disableOnInteraction: false,
    },
    breakpoints: {
        640: { slidesPerView: 3 },  // 3 slides on 640px and above
        375: { slidesPerView: 3 },  // 3 slides on 640px and above
        0: { slidesPerView: 2 }     // Default: 2 slides for smaller screens
    }
  });
});