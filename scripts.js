function storyPageScripts() {
    const triggerElement = document.getElementById('scrolly-text-3');
    const currentImage = document.querySelector('.frame-image'); 
    const image2URL = 'https://uploads-ssl.webflow.com/655a5e3e34bc8a89769ff74e/6583f8350811f7701cc61e05_space.webp';

    let animationStarted = false; // Flag to ensure the animation only starts once

    function isInViewport() {
        const rect = triggerElement.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.3
        );
    }

    function imageTransition(newImageUrl) {
        currentImage.srcset = newImageUrl;
    }

    window.addEventListener('scroll', () => {
        if (isInViewport() && !animationStarted) {
            imageTransition(image2URL);
            animationStarted = true;
        }
    });
}

// For initial page load
document.addEventListener('DOMContentLoaded', storyPageScripts);

// Define initScripts function for Barba.js
function initScripts() {
    storyPageScripts(); // Re-setup the page scripts
}

// Barba.js initialization
barba.init({
    transitions: [{
        name: 'opacity-transition',
        leave(data) {
            return gsap.to(data.current.container, { opacity: 0, duration: 1 });
        },
        enter(data) {
            initScripts();
            gsap.from(data.next.container, { opacity: 0 });
            return gsap.to(data.next.container, { opacity: 1, duration: 1 });
        }
    }]
});
