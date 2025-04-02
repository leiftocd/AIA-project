const swiper = new Swiper('.mySwiper', {
    slidesPerView: 6, // Hiển thị 6 ảnh mỗi lần
    spaceBetween: 40, // Khoảng cách giữa các slide
    loop: true, // Cho phép lặp lại
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 3000, // Tự động trượt sau 3 giây
      disableOnInteraction: false,
    },
  });