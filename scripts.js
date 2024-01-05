function storyPageScripts() {
    const image2URL = 'https://uploads-ssl.webflow.com/655a5e3e34bc8a89769ff74e/6583f8350811f7701cc61e05_space.webp';
    let animationStarted = false;

    function isInViewport(element) {
        if (element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.3
            );
        }
        return false;
    }

    function imageTransition(newImageUrl) {
        const currentImage = document.querySelector('.frame-image');
        if (currentImage) {
            currentImage.srcset = newImageUrl;
        }
    }

    window.addEventListener('scroll', () => {
        const triggerElement = document.getElementById('scrolly-text-3');
        if (isInViewport(triggerElement) && !animationStarted) {
            imageTransition(image2URL);
            animationStarted = true;
        }
    });
}

// Define initScripts function for Barba.js
function initScripts() {
    storyPageScripts(); // Re-setup the page scripts
}

document.addEventListener('DOMContentLoaded', () => {
    // Call storyPageScripts for initial setup
    storyPageScripts();

    // Barba.js initialization
    barba.init({
        transitions: [{
            name: 'opacity-transition',
            leave(data) {
                return gsap.to(data.current.container, { opacity: 0, duration: 1 });
            },
            enter(data) {
                initScripts();
                  document.body.style.minHeight = '100%';
                 document.body.style.color = '#333';
                  document.body.style.fontFamily = 'Gentiumbookbasic, sans-serif';
                document.body.style.overflow = 'auto';
                gsap.from(data.next.container, { opacity: 0 });
                return gsap.to(data.next.container, { opacity: 1, duration: 1 });
            }
        }]
    });
});