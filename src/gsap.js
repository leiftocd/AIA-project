if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
  console.error("GSAP hoặc ScrollTrigger không tải được");
  document.querySelectorAll('.text-appear, .animate, .animate-img').forEach(el => {
    el.style.clipPath = 'inset(0 0 0 0)';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0) scale(1)';
  });
} else {
  gsap.registerPlugin(ScrollTrigger);

  // Hàm tái sử dụng animation cho section
  function animateSection(sectionId, boxSelector) {
    // Animation cho tiêu đề và các phần tử không trong box
    const titleElements = document.querySelectorAll(`#${sectionId} .text-appear`);
    titleElements.forEach((el, index) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: `#${sectionId}`,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true
          // markers: true
        }
      })
        .to(el, {
          clipPath: "inset(0 0 25% 0)",
          duration: 0.45,
          ease: "sine.out",
          force3D: true
        })
        .to(el, {
          clipPath: "inset(0 0 10% 0)",
          duration: 0.3,
          ease: "sine.out",
          force3D: true
        })
        .to(el, {
          clipPath: "inset(0 0 0 0)",
          duration: 0.15,
          ease: "sine.out",
          force3D: true
        })
        .to(
          el,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            force3D: true
          },
          "-=0.9"
        )
        .delay(index * 0.3);
    });

    // Animation cho ảnh (.animate-img)
    const imgElements = document.querySelectorAll(`#${sectionId} .animate-img`);
    imgElements.forEach((img, index) => {
      gsap.fromTo(
        img,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: `#${sectionId}`,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
            // markers: true
          },
          delay: index * 0.3
        }
      );
    });

    // Animation cho text trong section không có box
    const textElements = document.querySelectorAll(`#${sectionId} .animate`);
    textElements.forEach((el, index) => {
      if (!el.closest(boxSelector)) { // Chỉ áp dụng cho .animate không trong box
        gsap.timeline({
          scrollTrigger: {
            trigger: `#${sectionId}`,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
            // markers: true
          }
        })
          .to(el, {
            clipPath: "inset(0 0 25% 0)",
            duration: 0.45,
            ease: "sine.out",
            force3D: true
          })
          .to(el, {
            clipPath: "inset(0 0 10% 0)",
            duration: 0.3,
            ease: "sine.out",
            force3D: true
          })
          .to(el, {
            clipPath: "inset(0 0 0 0)",
            duration: 0.15,
            ease: "sine.out",
            force3D: true
          })
          .to(
            el,
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "expo.out",
              force3D: true
            },
            "-=0.9"
          )
          .delay(index * 0.3);
      }
    });

    // Animation cho box (nếu có boxSelector)
    if (boxSelector) {
      const boxes = document.querySelectorAll(`#${sectionId} ${boxSelector}`);
      boxes.forEach((box, boxIndex) => {
        const animateElements = box.querySelectorAll(".text-appear, .animate");
        animateElements.forEach((el, elIndex) => {
          gsap.timeline({
            scrollTrigger: {
              trigger: box,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true
              // markers: true
            }
          })
            .to(el, {
              clipPath: "inset(0 0 25% 0)",
              duration: 0.45,
              ease: "sine.out",
              force3D: true
            })
            .to(el, {
              clipPath: "inset(0 0 10% 0)",
              duration: 0.3,
              ease: "sine.out",
              force3D: true
            })
            .to(el, {
              clipPath: "inset(0 0 0 0)",
              duration: 0.15,
              ease: "sine.out",
              force3D: true
            })
            .to(
              el,
              {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "expo.out",
                force3D: true
              },
              "-=0.9"
            )
            .delay((boxIndex * 0.3) + (elIndex * 0.3));
        });
      });
    }
  }

  // Áp dụng cho các section
  animateSection("section-banner", null); // Không có box
  animateSection("section-about", ".about-container_box");
  animateSection("section-introduction", ".introduction-content_box");
  animateSection("section-other", ".other-container_box");
}