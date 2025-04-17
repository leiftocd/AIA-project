document.addEventListener('DOMContentLoaded', function () {
    // Observe paragraphs for fade-in effect
    const paragraphs = document.querySelectorAll('.text-appear');
    const paragraphObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    paragraphs.forEach(paragraph => paragraphObserver.observe(paragraph));

    // Split headings into spans for animation
    document.querySelectorAll('.heading-fade-in').forEach(title => {
        const text = title.textContent.trim();
        title.textContent = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            title.appendChild(span);
        });
    });

    // Observe headings for fade-in animation
    const headings = document.querySelectorAll('.heading-fade-in');
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                headingObserver.unobserve(entry.target); // Stop observing after animation is triggered
            }
        });
    }, { threshold: 0.1 });

    headings.forEach(heading => headingObserver.observe(heading));
});
