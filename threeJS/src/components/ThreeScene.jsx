import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const materials = [
  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Right - Red
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Left - Green
  new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Top - Blue
  new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom - Yellow
  new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Front - Magenta
  new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Back - Cyan
];

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountElement = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0); // important to center cube

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.domElement.style.display = "block"; // remove inline spacing
    mountElement.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0); // ensure cube is the pivot
    controls.update();

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, materials);
    cube.position.set(0, 0, 0); // center
    scene.add(cube);

    // Animate
    const animate = (time) => {
      cube.rotation.x = time / 2000;
      cube.rotation.y = time / 1000;
      controls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // Resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", handleResize);
      if (mountElement && renderer.domElement) {
        mountElement.removeChild(renderer.domElement);
      }
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
    />
  );
};

export default ThreeScene;