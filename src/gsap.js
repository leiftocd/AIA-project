gsap.registerPlugin(ScrollTrigger);

// Animate each box content on scroll
gsap.utils.toArray(".about-container_box .box-content").forEach(content => {
  gsap.to(content, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: content,
      start: "top 80%", // or adjust as needed
      toggleActions: "play none none reverse",
    }
  });
});