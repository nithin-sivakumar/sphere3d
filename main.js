import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

function hideLoadingOverlay() {
  const loadingOverlay = document.querySelector(".loading-overlay");
  loadingOverlay.style.display = "none";
}
setTimeout(hideLoadingOverlay, 400);

// Setup
const setup = function () {
  function randomRGBColorCode() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const redHex = red.toString(16).padStart(2, "0");
    const greenHex = green.toString(16).padStart(2, "0");
    const blueHex = blue.toString(16).padStart(2, "0");
    const colorCode = `#${redHex}${greenHex}${blueHex}`;
    return colorCode;
  }

  const randomColorCode = randomRGBColorCode();

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#050505");

  const geometry = new THREE.SphereGeometry(
    3, // radius
    128, // widthSegments
    128 // heightSegments
  );

  const material = new THREE.MeshStandardMaterial({
    color: randomColorCode, // materialColor
    roughness: 0.5,
    metalness: 0.9,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Light;
  const light = new THREE.SpotLight(0xffffff, 1, 50);
  light.position.set(10, 20, 0);
  light.intensity = 60;
  scene.add(light);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 15);
  scene.add(camera);

  // Renderer
  const canvas = document.querySelector(".webgl");
  const renderer = new THREE.WebGL1Renderer({ canvas });
  renderer.setPixelRatio(2);
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 5;

  // Resize
  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // Update Camera
    camera.aspect = sizes.width / sizes.height;
    renderer.setSize(sizes.width, sizes.height);
    camera.updateProjectionMatrix();
  });

  const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
  };

  loop();

  // Timeline
  const tl = gsap.timeline({ defaults: { duration: 1 } });
  tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, y: 1, x: 1 });
  tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
  tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

  // Color Animation
  let mouseDown = false;
  let rgb = [];
  window.addEventListener("mousedown", () => (mouseDown = true));
  window.addEventListener("mouseup", () => (mouseDown = false));

  window.addEventListener("mousemove", (e) => {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      Math.floor(Math.random() * 255) + 1,
    ];

    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  });
};

setTimeout(setup, 200);
