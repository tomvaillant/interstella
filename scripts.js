  
document.addEventListener('DOMContentLoaded', () => {
    console.log("barba initialized");
    barba.init({
        views: [{
          namespace: 'chapters',
          afterEnter(data) {
            initChaptersPage();
            initStyles();
          }
        }, {
          namespace: 'story',
          afterEnter(data) {
            initStoryPage();
            initStyles();
          }
        }],
        transitions: [{
            name: 'opacity-transition',
            leave(data) {
            return gsap.to(data.current.container, { opacity: 0, duration: 1, onComplete: () => {
                data.current.container.style.display = 'none'; 
            }});
            },
            enter(data) {
                gsap.from(data.next.container, { opacity: 0 });
                return gsap.to(data.next.container, { opacity: 1, duration: 1 , onComplete: () => {
                  lenis.resize();
                  console.log("lenis resize");
                }});
            }
        }]
    });
});
  
// STORY PAGE SCRIPTS
function initStoryPage() {
    // IMAGE TRANSITION ANIMATION
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

    // THREE JS SHADER & ANIMATIONS

    // Shader Variables
    const vertexShaderCode = `
        varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

    const fragmentShaderCode = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {        
        // Apply the distortion effect
        vec2 distortedUv = vUv;
        distortedUv.y += (sin(vUv.y * 10.0 + time) * 0.1);
        
        // Sample the texture with the distorted UV coordinates
        gl_FragColor = texture2D(uTexture, distortedUv);
    }
    `;


    // Define the scene, camera, and renderer in the outer scope
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 0.30;
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Get the size of the glitch_canvas div
    const glitchCanvas = document.getElementById('story_canvas');
    const canvasWidth = glitchCanvas.offsetWidth;
    const canvasHeight = glitchCanvas.offsetHeight;
    console.log(canvasHeight)
    let material;
    let plane;

    // Initialize the renderer with the correct aspect ratio
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Handle HiDPI/Retina screens
    glitchCanvas.appendChild(renderer.domElement);

    // Load Texture from HTML Image
    const imgElement = document.getElementById('frame-image');
    new THREE.TextureLoader().load(imgElement.src, function(loadedTexture) {
    // Calculate the aspect ratio of the image
    const planeSize = new THREE.Vector2(loadedTexture.image.naturalWidth, loadedTexture.image.naturalHeight).normalize();

    // Create a plane geometry with the adjusted aspect ratio
    const geometry = new THREE.PlaneGeometry(planeSize.x, planeSize.y);

    // Create the shader material using the loaded texture
    material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            uTexture: { value: loadedTexture },
            resolution: { value: new THREE.Vector2(canvasWidth, canvasHeight) },
            distortionFactor: { value: 0.1 } // Start with a small value
        },
        vertexShader: vertexShaderCode,
        fragmentShader: fragmentShaderCode
    });

    // Create the mesh with the new geometry and add it to the scene
    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Now that everything is set up, start the animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Attach event listeners for GSAP animations
    glitchCanvas.addEventListener('mouseover', function() {
        gsap.to(material.uniforms.time, { value: 10, duration: 1 });
    });
    glitchCanvas.addEventListener('mouseout', function() {
        gsap.to(material.uniforms.time, { value: 1, duration: 1 });
    });
    });

    // Set up the GUI
    const gui = new dat.GUI();
    const guiParams = {
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight
    };
    gui.add(guiParams, 'canvasWidth', 100, window.innerWidth).onChange(onWindowResize);
    gui.add(guiParams, 'canvasHeight', 100, window.innerHeight).onChange(onWindowResize);
    gui.add(material.uniforms.distortionFactor, 'value', 0, 1).name('Distortion Factor');

    // Handle Window Resize
    function onWindowResize() {
    const newWidth = glitchCanvas.offsetWidth;
    const newHeight = glitchCanvas.offsetHeight;

    // Update renderer and camera
    renderer.setSize(newWidth, newHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    // If the material has been defined, update shader resolution uniform
    if (material) {
        material.uniforms.resolution.value.set(newWidth, newHeight);
    }
    }

    window.addEventListener('resize', onWindowResize);

    // Call resize function to set initial size
    onWindowResize();
}

// CHAPTERS INDEX SCRIPTS
function initChaptersPage() {
    const container = document.body
	const itemsWrapper = document.querySelector('.grid')
    // Preload images
    const preloadImages = () => {
        return new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll('img'), resolve);
            console.log(imagesLoaded);
        });
    };
    // And then..
    preloadImages().then(() => {
        // Remove the loader
        document.body.classList.remove('loading');
        const effect = new RGBShiftEffect(container, itemsWrapper, { strength: 0.25 })
	});
}

// BARBA: RE INITIALIZE STYLES
function initStyles() {
    document.body.style.minHeight = '100%';
    document.body.style.color = '#333';
    document.body.style.fontFamily = 'Gentiumbookbasic, sans-serif';
    document.body.style.overflow = 'auto';
}

//   LENIS SMOOTH SCROLL
const lenis = new Lenis({
    autoinit: true,
    duration: 1,
    orientation: "vertical",
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 1.5,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -15 * t)),
    useOverscroll: true,
    useControls: true,
    useAnchor: true,
    useRaf: true,
    infinite: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  /*window.addEventListener(
    "touchmove",
    function(event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    },
    { passive: false }
  );*/
  /*let lenis;
  let heightPage = 0
  if (Webflow.env("editor") === undefined) {
    lenis = new Lenis({
      autoinit: true,
      duration: 1,
      orientation: "vertical",
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -15 * t)),
      useOverscroll: true,
      useControls: true,
      useAnchor: true,
      useRaf: true,
      infinite: false
    });
    heightPage = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    function raf(time) {
      lenis.raf(time);
      let newHeightPage = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
      if (heightPage !== newHeightPage) {
          lenis.resize();
      }
    }
    requestAnimationFrame(raf);
  }
  $("[data-lenis-start]").on("click", function () {
    lenis.start();
  });
  $("[data-lenis-stop]").on("click", function () {
    lenis.stop();
  });
  $("[data-lenis-toggle]").on("click", function () {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });*/

