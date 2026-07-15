// Interactive fluctuating surface visualization using Three.js
// Usage: createSurface('container-id', { gridSize, speed, amplitude, wireframe, height })

function createSurface(containerId, options) {
  options = options || {};
  var container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  var width = container.clientWidth;
  var height = options.height || 450;

  // Pull colours from the live theme so the surface sits on the
  // same paper as everything else.
  function themeColor(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return new THREE.Color(v || fallback);
  }

  // Scene setup
  var scene = new THREE.Scene();
  scene.background = themeColor('--paper-low', '#F3EDDF');

  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(3, 2.5, 3);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Grid
  var gridSize = options.gridSize || 50;
  var geometry = new THREE.PlaneGeometry(4, 4, gridSize, gridSize);
  geometry.rotateX(-Math.PI / 2);

  var wireframe = options.wireframe !== false;
  var material;

  if (wireframe) {
    material = new THREE.MeshBasicMaterial({
      color: themeColor('--teal', '#227E72'),
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
  } else {
    material = new THREE.MeshPhongMaterial({
      color: themeColor('--teal', '#227E72'),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      flatShading: true
    });
  }

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Lighting (for solid mode)
  if (!wireframe) {
    var ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    var directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 10, 5);
    scene.add(directional);
  }

  // Grid helper for context
  var gridColor = themeColor('--line', '#E7DECF');
  var gridHelper = new THREE.GridHelper(4, 20, gridColor, gridColor);
  gridHelper.position.y = -0.5;
  scene.add(gridHelper);

  // Re-dye the scene when the lamp is switched
  window.addEventListener('themechange', function () {
    scene.background = themeColor('--paper-low', '#F3EDDF');
    material.color = themeColor('--teal', '#227E72');
    var gc = themeColor('--line', '#E7DECF');
    if (gridHelper.material instanceof Array) {
      gridHelper.material.forEach(function (mat) { mat.color = gc; });
    } else {
      gridHelper.material.color = gc;
    }
  });

  // Noise function (simple multi-frequency sinusoidal)
  function noise(x, y, t) {
    return Math.sin(x * 2.0 + t) * Math.cos(y * 2.0 + t * 0.7) * 0.3 +
      Math.sin(x * 3.7 + y * 2.3 + t * 1.3) * 0.15 +
      Math.cos(x * 1.3 - y * 3.1 + t * 0.5) * 0.1 +
      Math.sin(x * 5.1 + y * 4.7 + t * 0.9) * 0.05;
  }

  // Mouse/touch interaction for rotation
  var rotation = { x: 0, y: 0 };
  var isDragging = false;
  var prevMouse = { x: 0, y: 0 };

  renderer.domElement.addEventListener('mousedown', function (e) {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  renderer.domElement.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    rotation.y += (e.clientX - prevMouse.x) * 0.005;
    rotation.x += (e.clientY - prevMouse.y) * 0.005;
    rotation.x = Math.max(-1.2, Math.min(1.2, rotation.x));
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('touchmove', function (e) {
    if (!isDragging || e.touches.length !== 1) return;
    rotation.y += (e.touches[0].clientX - prevMouse.x) * 0.005;
    rotation.x += (e.touches[0].clientY - prevMouse.y) * 0.005;
    rotation.x = Math.max(-1.2, Math.min(1.2, rotation.x));
    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  window.addEventListener('mouseup', function () { isDragging = false; });
  window.addEventListener('touchend', function () { isDragging = false; });

  // Animation
  var time = 0;
  var speed = options.speed || 0.008;
  var amplitude = options.amplitude || 1.0;
  var autoRotate = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += speed;
    if (!isDragging) autoRotate += 0.001;

    // Update surface vertices
    var positions = geometry.attributes.position;
    for (var i = 0; i < positions.count; i++) {
      var x = positions.getX(i);
      var z = positions.getZ(i);
      positions.setY(i, noise(x, z, time) * amplitude);
    }
    positions.needsUpdate = true;
    if (!wireframe) geometry.computeVertexNormals();

    // Camera orbit
    var totalY = rotation.y + autoRotate;
    var radius = 3.5;
    camera.position.x = radius * Math.cos(totalY);
    camera.position.z = radius * Math.sin(totalY);
    camera.position.y = 2.5 + rotation.x;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', function () {
    var newWidth = container.clientWidth;
    camera.aspect = newWidth / height;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, height);
  });
}
