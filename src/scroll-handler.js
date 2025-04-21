document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.animate, .text-appear, .banner-content_img img, .banner-content_text p, .about-container_box');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Ngừng quan sát sau khi phần tử đã hiển thị (tối ưu hiệu suất)
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 }); // Kích hoạt khi 20% phần tử xuất hiện

  elements.forEach(element => observer.observe(element));
  
});