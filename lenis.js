const lenis = new Lenis({
    duration: 1,
    wheelMultiplier: 1,
    easing: t => t
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)