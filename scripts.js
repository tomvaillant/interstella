document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const triggerElement = document.getElementById('scrolly-text-3');
    const currentImage = document.querySelector('.frame-image'); 
    console.log(currentImage.src)
    const image2URL = 'https://uploads-ssl.webflow.com/655a5e3e34bc8a89769ff74e/6583f8350811f7701cc61e05_space.webp';

    let animationStarted = false; // Flag to ensure the animation only starts once

    // Function to check if the element is at the top 30% of the viewport
    function isInViewport() {
        const rect = triggerElement.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.3
        );
    }

    function imageTransition(newImageUrl) {
        currentImage.srcset = newImageUrl;
        console.log('animation triggered')
    }

    window.addEventListener('scroll', () => {
        if (isInViewport() && !animationStarted) {
            console.log('Scroll event triggered');
            imageTransition(image2URL);
            animationStarted = true;
        }
    });
});
