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
//top
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