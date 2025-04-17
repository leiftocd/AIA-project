// scroll-handler.js

export function setupTouchScrollHandler({
    handleScroll,
    aboutMode,
    scrollThreshold = 5,
    throttle,
    throttleDelay = 100
}) {
    let touchStartY = 0;
    let touchEndY = 0;
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    window.addEventListener("touchstart", e => {
        touchStartY = e.touches[0].clientY;
        touchEndY = touchStartY;
    }, { passive: true });

    if (isIOS) {
        // iOS: mượt hơn với requestAnimationFrame
        let touchRAF = false;
        window.addEventListener("touchmove", (e) => {
            if (touchRAF) return;
            touchRAF = true;

            requestAnimationFrame(() => {
                touchEndY = e.touches[0].clientY;
                const deltaY = touchStartY - touchEndY;
                const dir = deltaY > scrollThreshold ? "down" : deltaY < -scrollThreshold ? "up" : null;

                if (dir && aboutMode.value === "in") {
                    handleScroll(dir);
                    touchStartY = touchEndY;
                    e.preventDefault();
                }

                touchRAF = false;
            });
        }, { passive: false });
    } else {
        // Android và thiết bị khác: dùng throttle để tránh quá nhạy
        window.addEventListener("touchmove", throttle(e => {
            touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            const dir = deltaY > scrollThreshold ? "down" : deltaY < -scrollThreshold ? "up" : null;

            if (dir) {
                handleScroll(dir);
                touchStartY = touchEndY;
                e.preventDefault();
            }
        }, throttleDelay), { passive: false });
    }

    window.addEventListener("touchend", () => {
        const deltaY = touchStartY - touchEndY;
        const dir = deltaY > scrollThreshold ? "down" : deltaY < -scrollThreshold ? "up" : null;
        if (dir) handleScroll(dir);
    });
}
