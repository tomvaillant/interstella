document.addEventListener('DOMContentLoaded', () => {
    // Barba transitions
    barba.init({
        transitions: [{
            name: 'opacity-transition',
            leave(data) {
            // Animate the opacity of the current container to 0
            return gsap.to(data.current.container, {
                opacity: 0,
                duration: 1
            });
            },
            enter(data) {
            // Start the next container at opacity 0
            gsap.from(data.next.container, {
                opacity: 0
            });
            // Animate the opacity of the next container to 1
            return gsap.to(data.next.container, {
                opacity: 1,
                duration: 1
            });
            }
        }]
    });
    // Constants
    const triggerElement = document.getElementById('scrolly-text-3');
    const currentImage = document.querySelector('.frame-image'); 
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


    // https://uploads-ssl.webflow.com/655a5e3e34bc8a89769ff74e/655a5f21aced22f21d962899_COCKPIT.webp
    // https://uploads-ssl.webflow.com/655a5e3e34bc8a89769ff74e/6583f8350811f7701cc61e05_space.webp
    // https://uploads-ssl.webflow.com/655a5e3e34bc8a89769ff74e/6584470007d534b8dad74572_nebula.webp