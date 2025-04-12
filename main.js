document.addEventListener("DOMContentLoaded", () => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
requestAnimationFrame(() => {
    window.scrollTo(0, 0);
});

  const section = document.querySelector("#section-about");
  const boxes = document.querySelectorAll(".about-container_box");
  const introduceSection = document.querySelector("#section-introduction");

  let currentBox = 0;
  let scrollCount = 0;
  let isAnimating = false;
  let touchStartY = 0;
  let aboutMode = "none"; // "none", "in", "entering", "exiting"
  let maxReachedBox = 0;

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const throttleDelay = isMobile ? 100 : 200;

  const lock = () => {
      isAnimating = true;
      setTimeout(() => isAnimating = false, throttleDelay + 200);
  };

  const showBox = (index) => {
      boxes.forEach((box, i) => {
          box.classList.remove("active", "hidden");

          if (i === index) {
              box.classList.add("active");
          } else if (i < index) {
              box.classList.add("hidden");
          } else {
              box.classList.remove("active", "hidden");
          }
      });

      if (index > maxReachedBox) {
          maxReachedBox = index;
      }
  };
  const scrollTo = (position) => {
      window.scrollTo({ top: position, behavior: "smooth" });
  };

  const enterAbout = (fromBelow = false) => {
      if (aboutMode !== "none") return;
      aboutMode = "entering";
      toggleSections(true);

      section.classList.add("fullscreen");

      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;

      lock();

      currentBox = fromBelow && maxReachedBox === boxes.length - 1 ? boxes.length - 1 : 0;

      showBox(currentBox);

      scrollTo(section.offsetTop);

      setTimeout(() => {
          aboutMode = "in";
      }, 500);
  };

  const exitAbout = (toTop = false) => {
      if (aboutMode !== "in") return;
      aboutMode = "exiting";
      toggleSections(false);

      section.classList.remove("fullscreen");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      lock();
      scrollTo(toTop
          ? section.offsetTop - window.innerHeight
          : introduceSection.offsetTop
      );
      setTimeout(() => {
          aboutMode = "none";
      }, 500);
  };

  const handleScroll = (direction) => {
      if (isAnimating) return;

      const sectionTop = section.getBoundingClientRect().top;
      const sectionBottom = section.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;

      const enteringFromTop = direction === "down" && sectionTop < windowHeight && sectionTop >= 0;
      const enteringFromBottom = direction === "up" && sectionBottom > 0 && sectionBottom <= windowHeight;

      if (aboutMode === "none") {
          if (enteringFromTop) {
              enterAbout(false);
          } else if (enteringFromBottom) {
              enterAbout(true);
          }
      } else if (aboutMode === "in") {
          if (direction === "down") {
              if (currentBox < boxes.length - 1) {
                  currentBox++;
                  showBox(currentBox);

                  if (currentBox >= 1) {
                      boxes[0].classList.add("hidden");
                  }

                  lock();
                  scrollTo(section.offsetTop);
                } else {
                    const maxScrollCount = isMobile ? 3 : 2;
                    if (scrollCount >= maxScrollCount) {
                        exitAbout(false);
                    } else {
                        scrollCount++;
                        lock();
                        scrollTo(section.offsetTop);
                    }
                }
          } else if (direction === "up") {
              if (currentBox > 0) {
                  currentBox--;
                  showBox(currentBox);
                  lock();
                  scrollTo(section.offsetTop);
              } else {
                  exitAbout(true);
              }
          }
      }
  };

  const throttle = (fn, delay) => {
      let lastCall = 0;
      return (...args) => {
          const now = Date.now();
          if (now - lastCall >= delay) {
              lastCall = now;
              fn(...args);
          }
      };
  };

  window.addEventListener("wheel", throttle((e) => {
      const direction = e.deltaY > 0 ? "down" : "up";
      handleScroll(direction);
      if (aboutMode !== "none" || e.deltaY < 0) e.preventDefault();
  }, throttleDelay), { passive: false });

  window.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchmove", throttle((e) => {
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY - touchCurrentY;
      const direction = deltaY > 10 ? "down" : deltaY < -10 ? "up" : null;

      if (direction) {
          handleScroll(direction);
          touchStartY = touchCurrentY;
          e.preventDefault();
      }
  }, throttleDelay), { passive: false });

  window.addEventListener("scroll", () => {
      const sectionMid = section.getBoundingClientRect().top <= window.innerHeight / 2 &&
                         section.getBoundingClientRect().bottom >= window.innerHeight / 2;
      toggleSections(sectionMid);
  });
  const toggleSections = (showAbout) => {
    introduceSection.style.opacity = showAbout ? 0 : 1;
    introduceSection.style.visibility = showAbout ? "hidden" : "visible";
};
  showBox(currentBox);
});
