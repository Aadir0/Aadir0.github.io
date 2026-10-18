/**
 * 3D Pro Boxing Arena Game (Three.js)
 * Created for Aaditya Raj's Portfolio
 * 
 * Player: YOU vs AI: Aaditya Raj
 * Controls:
 * - Desktop: A / D to Move, Space to Jump, Left Click to Punch, Right Click (Hold) to Block
 * - Mobile: Dedicated dual-thumb touch controls (Left/Right, Punch, Block, Jump)
 * - Secret Easter Egg: "ihatecholebhature" (secretly unlocks Hardcore Boss Mode)
 */

class BoxingAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playWhoosh() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {}
  }

  playImpact(heavy = false) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      // Low punch thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(heavy ? 200 : 160, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.18);
      gain.gain.setValueAtTime(heavy ? 0.55 : 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);

      // Leather snap noise
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(heavy ? 0.25 : 0.16, t);
      nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      noise.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(t);
    } catch (e) {}
  }

  playBlock() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.09);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch (e) {}
  }

  playBell() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      [800, 808, 1600].forEach(f => {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 1.3);
      });
    } catch (e) {}
  }

  playHardcoreRoar() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.9);
      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.95);
    } catch (e) {}
  }

  playVictory() {
    this.playBell();
    if (this.isMuted) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, idx) => {
        const t = this.ctx.currentTime + 0.15 + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      });
    } catch (e) {}
  }
}

const audioFX = new BoxingAudio();

class BoxerRig {
  constructor(scene, isAI = false, isHardcore = false) {
    this.scene = scene;
    this.isAI = isAI;
    this.isHardcore = isHardcore;
    this.hp = 100;
    this.maxHp = 100;
    this.x = isAI ? 2.8 : -2.8;
    this.y = 0;
    this.z = 0;
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = true;
    this.isAttacking = false;
    this.isBlocking = false;
    this.isHurt = false;
    this.isDead = false;
    this.facing = isAI ? -1 : 1;
    this.attackTimer = 0;
    this.punchHand = 'right';
    this.hurtTimer = 0;
    this.animTime = Math.random() * 5;

    // Punch Cooldown management
    this.punchCooldown = 0;
    this.maxCooldown = isAI ? (isHardcore ? 0.38 : 0.65) : 0.38;

    this.root = new THREE.Group();
    this.buildBoxer();
    this.scene.add(this.root);
    this.updateTransform();
  }

  buildBoxer() {
    const skinMat = new THREE.MeshStandardMaterial({
      color: this.isAI ? 0xE2AA68 : 0xD5A272,
      roughness: 0.5,
      metalness: 0.1
    });

    const trunksColor = this.isAI ? (this.isHardcore ? 0x991B1B : 0xB8500C) : 0x0284C7;
    const gloveColor = this.isAI ? (this.isHardcore ? 0xF59E0B : 0xDC2626) : 0xEF4444;

    const trunksMat = new THREE.MeshStandardMaterial({ color: trunksColor, roughness: 0.35 });
    const gloveMat = new THREE.MeshStandardMaterial({
      color: gloveColor,
      roughness: 0.2,
      metalness: 0.3,
      emissive: this.isHardcore ? 0xF59E0B : 0x000000,
      emissiveIntensity: this.isHardcore ? 0.45 : 0
    });
    this.gloveMat = gloveMat;
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x18181B, roughness: 0.7 });

    // Torso (Muscular boxer build)
    const chestGeo = new THREE.BoxGeometry(1.0, 0.7, 0.55);
    this.chest = new THREE.Mesh(chestGeo, skinMat);
    this.chest.position.y = 1.95;
    this.root.add(this.chest);

    const absGeo = new THREE.BoxGeometry(0.85, 0.6, 0.48);
    const abs = new THREE.Mesh(absGeo, skinMat);
    abs.position.y = -0.55;
    this.chest.add(abs);

    // Boxing Trunks
    const bandGeo = new THREE.BoxGeometry(0.9, 0.16, 0.52);
    const band = new THREE.Mesh(bandGeo, darkMat);
    band.position.y = -0.32;
    abs.add(band);

    const shortsGeo = new THREE.BoxGeometry(0.92, 0.65, 0.52);
    const shorts = new THREE.Mesh(shortsGeo, trunksMat);
    shorts.position.y = -0.35;
    band.add(shorts);

    // Head & Headgear
    const headGeo = new THREE.SphereGeometry(0.34, 14, 14);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 0.65;
    this.chest.add(this.head);

    const gearGeo = new THREE.BoxGeometry(0.72, 0.35, 0.68);
    const gearMat = new THREE.MeshStandardMaterial({ color: trunksColor, roughness: 0.4 });
    const gear = new THREE.Mesh(gearGeo, gearMat);
    gear.position.y = 0.12;
    this.head.add(gear);

    // Right Arm (Front)
    this.armR = new THREE.Group();
    this.armR.position.set(0.62, 0.15, 0.1);
    const shoulderGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const shoulderR = new THREE.Mesh(shoulderGeo, skinMat);
    this.armR.add(shoulderR);

    const armGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.65, 8);
    const bicepR = new THREE.Mesh(armGeo, skinMat);
    bicepR.position.y = -0.28;
    this.armR.add(bicepR);

    // Right Boxing Glove
    const gloveGeo = new THREE.SphereGeometry(0.28, 12, 12);
    gloveGeo.scale(1, 1.25, 1.1);
    this.gloveR = new THREE.Mesh(gloveGeo, gloveMat);
    this.gloveR.position.set(0, -0.65, 0.12);
    this.armR.add(this.gloveR);
    this.chest.add(this.armR);

    // Left Arm (Back)
    this.armL = new THREE.Group();
    this.armL.position.set(-0.62, 0.15, 0.1);
    const shoulderL = new THREE.Mesh(shoulderGeo, skinMat);
    this.armL.add(shoulderL);

    const bicepL = new THREE.Mesh(armGeo, skinMat);
    bicepL.position.y = -0.28;
    this.armL.add(bicepL);

    // Left Boxing Glove
    this.gloveL = new THREE.Mesh(gloveGeo, gloveMat);
    this.gloveL.position.set(0, -0.65, 0.12);
    this.armL.add(this.gloveL);
    this.chest.add(this.armL);

    // Legs & Boxing Shoes
    const legGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.85, 8);
    this.legR = new THREE.Group();
    this.legR.position.set(0.28, 0.9, 0);
    const legMeshR = new THREE.Mesh(legGeo, skinMat);
    legMeshR.position.y = -0.42;
    this.legR.add(legMeshR);
    this.root.add(this.legR);

    this.legL = new THREE.Group();
    this.legL.position.set(-0.28, 0.9, 0);
    const legMeshL = new THREE.Mesh(legGeo, skinMat);
    legMeshL.position.y = -0.42;
    this.legL.add(legMeshL);
    this.root.add(this.legL);

    // Boxing Boots
    const bootGeo = new THREE.BoxGeometry(0.26, 0.32, 0.42);
    const bootR = new THREE.Mesh(bootGeo, darkMat);
    bootR.position.set(0, -0.85, 0.08);
    this.legR.add(bootR);

    const bootL = new THREE.Mesh(bootGeo, darkMat);
    bootL.position.set(0, -0.85, 0.08);
    this.legL.add(bootL);
  }

  updateTransform() {
    this.root.position.set(this.x, this.y, this.z);
    this.root.rotation.y = this.facing === 1 ? Math.PI / 2 : -Math.PI / 2;
  }

  takeDamage(amount, heavy = false) {
    if (this.isDead) return;

    if (this.isBlocking) {
      amount = Math.floor(amount * 0.16); // 84% block absorption
      audioFX.playBlock();
    } else {
      audioFX.playImpact(heavy);
    }

    this.hp = Math.max(0, this.hp - Math.floor(amount));
    this.isHurt = true;
    this.hurtTimer = heavy ? 0.26 : 0.18;

    // Recoil backward on impact
    this.x += -this.facing * (heavy ? 0.35 : 0.2);
    this.x = Math.max(-4.2, Math.min(4.2, this.x));
    if (this.chest) this.chest.rotation.x = -0.32;

    this.chest.material.color.setHex(0xFFFFFF);
    setTimeout(() => {
      if (this.chest) {
        this.chest.material.color.setHex(this.isAI ? (this.isHardcore ? 0x991B1B : 0xE2AA68) : 0xD5A272);
      }
    }, 70);

    if (this.hp <= 0) {
      this.isDead = true;
      audioFX.playBell();
    }
  }

  punch() {
    if (this.isAttacking || this.isHurt || this.isDead || this.isBlocking || this.punchCooldown > 0) return false;
    this.isAttacking = true;
    this.punchCooldown = this.maxCooldown;
    this.attackTimer = 0.22;
    this.punchHand = this.punchHand === 'right' ? 'left' : 'right';
    audioFX.playWhoosh();
    return true;
  }

  update(dt) {
    this.animTime += dt;

    if (this.punchCooldown > 0) {
      this.punchCooldown = Math.max(0, this.punchCooldown - dt);
    }

    if (!this.isGrounded) {
      this.vy -= 26 * dt;
      this.y += this.vy * dt;
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.isGrounded = true;
      }
    }

    this.x += this.vx * dt;
    this.x = Math.max(-4.2, Math.min(4.2, this.x));

    if (this.isAttacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
        this.armR.position.set(0.62, 0.15, 0.1);
        this.armL.position.set(-0.62, 0.15, 0.1);
        this.armR.rotation.set(0, 0, 0);
        this.armL.rotation.set(0, 0, 0);
        this.chest.rotation.y = 0;
      } else {
        const p = Math.sin((this.attackTimer / 0.22) * Math.PI);
        if (this.punchHand === 'right') {
          this.armR.position.z = 0.1 + p * 1.3;
          this.armR.position.y = 0.15 + p * 0.18;
          this.armR.rotation.y = -p * 0.45;
          this.chest.rotation.y = -p * 0.22;
        } else {
          this.armL.position.z = 0.1 + p * 1.3;
          this.armL.position.y = 0.15 + p * 0.18;
          this.armL.rotation.y = p * 0.45;
          this.chest.rotation.y = p * 0.22;
        }
      }
    }

    if (this.isHurt) {
      this.hurtTimer -= dt;
      if (this.hurtTimer <= 0) {
        this.isHurt = false;
        this.chest.rotation.x = 0;
      }
    }

    if (this.isDead) {
      this.root.rotation.z = THREE.MathUtils.lerp(this.root.rotation.z, -Math.PI / 2 * this.facing, dt * 7);
      this.y = THREE.MathUtils.lerp(this.y, -0.45, dt * 7);
    } else if (!this.isAttacking && !this.isHurt) {
      const bounce = Math.sin(this.animTime * 10) * 0.06;
      this.chest.position.y = 1.95 + bounce;

      if (this.isBlocking) {
        this.armR.position.set(0.24, 0.52, 0.48);
        this.armL.position.set(-0.24, 0.52, 0.48);
        this.armR.rotation.z = -0.3;
        this.armL.rotation.z = 0.3;
      } else {
        this.armR.position.set(0.48, 0.4 + bounce * 0.6, 0.38);
        this.armL.position.set(-0.48, 0.4 - bounce * 0.6, 0.38);
        this.armR.rotation.z = 0;
        this.armL.rotation.z = 0;
      }

      if (Math.abs(this.vx) > 0.1) {
        const step = Math.sin(this.animTime * 14) * 0.35;
        this.legR.rotation.x = step;
        this.legL.rotation.x = -step;
      } else {
        this.legR.rotation.x = 0;
        this.legL.rotation.x = 0;
      }
    }

    this.updateTransform();
  }
}

class ArenaFightingGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animFrameId = null;

    this.player = null; // YOU
    this.enemy = null;  // Aaditya Raj
    this.particles = [];
    this.isPlaying = false;
    this.isVictory = false;
    this.isDefeat = false;
    this.isHardcore = false;
    this.hasDefeatedHardcore = localStorage.getItem('hardcore_ai_defeated') === 'true';

    this.keys = { left: false, right: false };
    this.clock = new THREE.Clock();

    this.aiTimer = 0;
    this.aiNextAction = 0.5;

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x080B10, 0.018);

    const w = window.innerWidth;
    const h = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 800);
    this.camera.position.set(0, 3.0, 9.8);
    this.camera.lookAt(0, 1.5, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x080B10);

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambient);

    const spotBlue = new THREE.SpotLight(0x0284C7, 3.5, 45, Math.PI / 4, 0.35);
    spotBlue.position.set(-6, 12, 5);
    this.scene.add(spotBlue);

    const spotGold = new THREE.SpotLight(0xF59E0B, 3.5, 45, Math.PI / 4, 0.35);
    spotGold.position.set(6, 12, 5);
    this.scene.add(spotGold);

    const ringCenterLight = new THREE.PointLight(0xFFFFFF, 2.0, 30);
    ringCenterLight.position.set(0, 8, 0);
    this.scene.add(ringCenterLight);

    this.buildProBoxingRing();
    this.buildStadiumCrowd();

    this.player = new BoxerRig(this.scene, false, false);
    this.enemy = new BoxerRig(this.scene, true, false);

    this.bindControls();

    this.animate = this.animate.bind(this);
    this.animFrameId = requestAnimationFrame(this.animate);
  }

  buildProBoxingRing() {
    const matGeo = new THREE.BoxGeometry(11.5, 0.6, 11.5);
    const matMat = new THREE.MeshStandardMaterial({
      color: 0x181F2C,
      roughness: 0.75,
      metalness: 0.15
    });
    const canvasMat = new THREE.Mesh(matGeo, matMat);
    canvasMat.position.y = -0.3;
    this.scene.add(canvasMat);

    const circleGeo = new THREE.RingGeometry(1.6, 1.8, 32);
    circleGeo.rotateX(-Math.PI / 2);
    const circleMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
    const circleMesh = new THREE.Mesh(circleGeo, circleMat);
    circleMesh.position.y = 0.01;
    this.scene.add(circleMesh);

    const postGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.5, 16);
    const padGeo = new THREE.BoxGeometry(0.45, 2.6, 0.45);

    const postMatBlue = new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.8, roughness: 0.2 });
    const postMatRed = new THREE.MeshStandardMaterial({ color: 0xDC2626, metalness: 0.8, roughness: 0.2 });
    const postMatWhite = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.8, roughness: 0.2 });

    const corners = [
      { x: -5.3, z: 5.3, mat: postMatBlue },
      { x: 5.3, z: 5.3, mat: postMatRed },
      { x: -5.3, z: -5.3, mat: postMatWhite },
      { x: 5.3, z: -5.3, mat: postMatWhite }
    ];

    corners.forEach(c => {
      const post = new THREE.Mesh(postGeo, c.mat);
      post.position.set(c.x, 1.45, c.z);
      this.scene.add(post);

      const pad = new THREE.Mesh(padGeo, c.mat);
      pad.position.set(c.x * 0.94, 1.45, c.z * 0.94);
      this.scene.add(pad);
    });

    const ropeHeights = [0.75, 1.35, 1.95, 2.55];
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.3 });

    ropeHeights.forEach(rh => {
      // Back rope
      const ropeGeoH = new THREE.BoxGeometry(10.6, 0.05, 0.05);
      const ropeBack = new THREE.Mesh(ropeGeoH, ropeMat);
      ropeBack.position.set(0, rh, -5.3);
      this.scene.add(ropeBack);

      // Side ropes (Left and Right)
      const ropeGeoSide = new THREE.BoxGeometry(0.05, 0.05, 10.6);
      const ropeLeft = new THREE.Mesh(ropeGeoSide, ropeMat);
      ropeLeft.position.set(-5.3, rh, 0);
      this.scene.add(ropeLeft);

      const ropeRight = new THREE.Mesh(ropeGeoSide, ropeMat);
      ropeRight.position.set(5.3, rh, 0);
      this.scene.add(ropeRight);

      // Front rope is semi-transparent so it never blocks the camera view of the fighters
      const frontRopeMat = new THREE.MeshBasicMaterial({ color: 0xF8FAFC, transparent: true, opacity: 0.1 });
      const ropeFront = new THREE.Mesh(ropeGeoH, frontRopeMat);
      ropeFront.position.set(0, rh, 5.3);
      this.scene.add(ropeFront);
    });
  }

  buildStadiumCrowd() {
    const flashCount = 60;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(flashCount * 3);

    for (let i = 0; i < flashCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i + 1] = Math.random() * 12 + 2;
      positions[i + 2] = -Math.random() * 25 - 8;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.8,
      transparent: true,
      opacity: 0.7
    });

    this.crowdFlashes = new THREE.Points(geo, mat);
    this.scene.add(this.crowdFlashes);
  }

  bindControls() {
    window.addEventListener('resize', () => {
      if (!this.isPlaying) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mouse Controls (Desktop)
    this.canvas.addEventListener('pointerdown', (e) => {
      if (!this.isPlaying) return;
      if (e.pointerType === 'mouse') {
        if (e.button === 0) {
          this.triggerPlayerPunch();
        } else if (e.button === 2) {
          this.player.isBlocking = true;
        }
      }
    });

    this.canvas.addEventListener('pointerup', (e) => {
      if (e.button === 2) {
        this.player.isBlocking = false;
      }
    });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying) return;

      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        this.keys.left = true;
      }
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        this.keys.right = true;
      }
      if ((e.key === ' ' || e.key === 'w' || e.key === 'W') && this.player.isGrounded) {
        this.player.vy = 11.5;
        this.player.isGrounded = false;
        audioFX.playWhoosh();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        this.keys.left = false;
      }
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        this.keys.right = false;
      }
    });

    // Dedicated Touch Controls for Mobile
    this.bindTouchButton('btnMobileLeft', 
      () => { this.keys.left = true; }, 
      () => { this.keys.left = false; }
    );

    this.bindTouchButton('btnMobileRight', 
      () => { this.keys.right = true; }, 
      () => { this.keys.right = false; }
    );

    this.bindTouchButton('btnMobileJump', 
      () => {
        if (this.player && this.player.isGrounded) {
          this.player.vy = 11.5;
          this.player.isGrounded = false;
          audioFX.playWhoosh();
        }
      },
      () => {}
    );

    this.bindTouchButton('btnMobilePunch', 
      () => { this.triggerPlayerPunch(); }, 
      () => {}
    );

    this.bindTouchButton('btnMobileBlock', 
      () => { if (this.player) this.player.isBlocking = true; }, 
      () => { if (this.player) this.player.isBlocking = false; }
    );
  }

  bindTouchButton(id, onStart, onEnd) {
    const btn = document.getElementById(id);
    if (!btn) return;

    const startHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.add('active');
      onStart();
    };

    const endHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.remove('active');
      onEnd();
    };

    btn.addEventListener('touchstart', startHandler, { passive: false });
    btn.addEventListener('touchend', endHandler, { passive: false });
    btn.addEventListener('touchcancel', endHandler, { passive: false });

    btn.addEventListener('pointerdown', startHandler);
    btn.addEventListener('pointerup', endHandler);
    btn.addEventListener('pointercancel', endHandler);
  }

  activateHardcoreMode(forceImmediate = true) {
    // Only allow trigger if player hasn't defeated the hardcore AI yet!
    if (this.hasDefeatedHardcore) {
      return;
    }

    this.isHardcore = true;
    audioFX.isMuted = false;
    audioFX.init();
    audioFX.playHardcoreRoar();

    // Rebuild enemy in Hardcore Raged Boss Form
    if (this.enemy && this.enemy.root) {
      this.scene.remove(this.enemy.root);
    }
    this.enemy = new BoxerRig(this.scene, true, true);
    this.enemy.x = 2.8;

    const enemyName = document.getElementById('enemyNameLabel');
    if (enemyName) {
      enemyName.innerHTML = `<span style="color: #EF4444; font-size: 1rem;">🔥</span> Aaditya Raj (BOSS)`;
    }

    const banner = document.getElementById('hardcoreBannerToast');
    if (banner) {
      banner.innerHTML = `🔥 HARDCORE BOSS MODE 🔥`;
      banner.classList.remove('hidden');
      setTimeout(() => banner.classList.add('hidden'), 4500);
    }

    // Bring fight screen back to view immediately if user was on website
    const root = document.getElementById('fightScreenRoot');
    if (root) {
      root.style.display = 'block';
      root.classList.remove('dismissed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Resume animation frame loop if stopped
    if (!this.animFrameId) {
      this.animate = this.animate.bind(this);
      this.animFrameId = requestAnimationFrame(this.animate);
    }

    // Start fight immediately into raged gameplay
    if (forceImmediate) {
      this.startFight();
    }
  }

  triggerPlayerPunch() {
    if (!this.player || this.player.isDead || this.player.punchCooldown > 0) return;
    const didPunch = this.player.punch();
    if (!didPunch) return;
    const damage = Math.floor(Math.random() * 5) + 14;
    this.checkHit(this.player, this.enemy, damage, 'JAB!');
  }

  checkHit(attacker, defender, damage, label) {
    const dist = Math.abs(attacker.x - defender.x);
    if (dist < 1.95) {
      // Challenging AI Defensive Reactions (Slipping & Guard Blocking with Counters)
      if (defender.isAI && !defender.isAttacking) {
        const roll = Math.random();
        if (roll < (this.isHardcore ? 0.35 : 0.24)) {
          // Slip backward out of range
          defender.x += defender.facing * -0.65;
          defender.x = Math.max(-4.2, Math.min(4.2, defender.x));
          this.showDamageText('SLIP!', defender.x);
          return;
        } else if (roll < (this.isHardcore ? 0.70 : 0.48)) {
          // Guard block absorbing 84% damage + immediate counter jab!
          defender.isBlocking = true;
          setTimeout(() => {
            if (defender) defender.isBlocking = false;
          }, 320);
          setTimeout(() => {
            if (defender && !defender.isDead && this.isPlaying && defender.punchCooldown <= 0.15) {
              defender.punchCooldown = 0;
              defender.punch();
              this.checkHit(defender, attacker, 14, 'COUNTER!');
            }
          }, 220);
        }
      }

      defender.takeDamage(damage, damage > 18);
      this.spawnSparks(defender.x, defender.y + 1.4);
      this.showDamageText(`${label} -${damage}`, defender.x);
      this.updateHUD();

      this.shakeCamera();

      if (defender.isDead) {
        if (defender === this.enemy) {
          this.triggerVictory();
        } else {
          this.triggerDefeat();
        }
      }
    }
  }

  shakeCamera() {
    this.camera.position.x = (Math.random() - 0.5) * 0.24;
    setTimeout(() => {
      this.camera.position.x = 0;
    }, 110);
  }

  spawnSparks(x, y) {
    for (let i = 0; i < 9; i++) {
      const geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const mat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
      const p = new THREE.Mesh(geo, mat);
      p.position.set(x, y, 0);
      p.userData = {
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 1.5,
        life: 0.3
      };
      this.scene.add(p);
      this.particles.push(p);
    }
  }

  showDamageText(text, x) {
    const el = document.createElement('div');
    el.className = 'floating-hit-text';
    el.textContent = text;
    el.style.left = `${(x + 5.5) / 11 * 100}%`;
    el.style.top = '44%';
    const root = document.getElementById('fightScreenRoot');
    if (root) {
      root.appendChild(el);
      setTimeout(() => el.remove(), 750);
    }
  }

  startFight() {
    this.isPlaying = true;
    this.isVictory = false;
    this.isDefeat = false;

    this.player.hp = 100;
    this.player.isDead = false;
    this.player.punchCooldown = 0;
    this.player.x = -2.8;
    this.player.root.rotation.z = 0;

    this.enemy.hp = 100;
    this.enemy.isDead = false;
    this.enemy.punchCooldown = 0;
    this.enemy.x = 2.8;
    this.enemy.root.rotation.z = 0;

    this.updateHUD();
    audioFX.playBell();

    const startOv = document.getElementById('fightStartOverlay');
    const winOv = document.getElementById('fightWinOverlay');
    const loseOv = document.getElementById('fightLoseOverlay');

    if (startOv) startOv.classList.add('hidden');
    if (winOv) winOv.classList.add('hidden');
    if (loseOv) loseOv.classList.add('hidden');
  }

  triggerVictory() {
    this.isPlaying = false;
    this.isVictory = true;
    audioFX.playVictory();

    const winOv = document.getElementById('fightWinOverlay');
    const winTitle = document.getElementById('winTitleText');
    const winSubtitle = document.getElementById('winSubtitleText');

    if (this.isHardcore) {
      this.hasDefeatedHardcore = true;
      localStorage.setItem('hardcore_ai_defeated', 'true');

      if (winTitle) {
        winTitle.textContent = `Hardcore Boss Defeated`;
        winTitle.style.color = '#F59E0B';
      }
      if (winSubtitle) {
        winSubtitle.innerHTML = `You conquered <strong>Aaditya Raj (AI)</strong> in Hardcore Mode. Champion status achieved.`;
      }
      document.body.classList.add('boss-champion');
      const badge = document.getElementById('bossAchievementBanner');
      if (badge) badge.classList.remove('hidden');
    } else {
      if (winTitle) {
        winTitle.textContent = `Victory`;
        winTitle.style.color = '#22C55E';
      }
      if (winSubtitle) {
        winSubtitle.textContent = `Match won. Welcome to Aaditya Raj's portfolio website.`;
      }
    }

    if (winOv) winOv.classList.remove('hidden');
  }

  triggerDefeat() {
    this.isPlaying = false;
    this.isDefeat = true;
    audioFX.playBell();

    const loseOv = document.getElementById('fightLoseOverlay');
    if (loseOv) loseOv.classList.remove('hidden');
  }

  updateHUD() {
    const playerBar = document.getElementById('playerHpFill');
    const enemyBar = document.getElementById('enemyHpFill');
    const playerHpLag = document.getElementById('playerHpLag');
    const enemyHpLag = document.getElementById('enemyHpLag');
    const playerHpText = document.getElementById('playerHpVal');
    const enemyHpText = document.getElementById('enemyHpVal');
    const cdBar = document.getElementById('playerCdFill');

    const pPercent = Math.max(0, Math.floor(this.player.hp));
    const ePercent = Math.max(0, Math.floor(this.enemy.hp));

    if (playerBar) playerBar.style.width = `${pPercent}%`;
    if (enemyBar) enemyBar.style.width = `${ePercent}%`;
    if (playerHpLag) playerHpLag.style.width = `${pPercent}%`;
    if (enemyHpLag) enemyHpLag.style.width = `${ePercent}%`;

    if (playerHpText) playerHpText.textContent = pPercent;
    if (enemyHpText) enemyHpText.textContent = ePercent;

    if (cdBar && this.player) {
      const cdPercent = Math.max(0, Math.min(100, (1 - (this.player.punchCooldown / this.player.maxCooldown)) * 100));
      cdBar.style.width = `${cdPercent}%`;
      if (cdPercent >= 98) {
        cdBar.classList.add('ready');
      } else {
        cdBar.classList.remove('ready');
      }
    }
  }

  destroy() {
    this.isPlaying = false;
    audioFX.isMuted = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  animate() {
    if (!this.isPlaying && (this.isVictory || !this.player)) {
      return;
    }

    this.animFrameId = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.1);

    if (this.isPlaying) {
      this.updateHUD();

      const moveSpeed = 5.2;
      if (this.keys.left && !this.player.isBlocking) {
        this.player.vx = -moveSpeed;
      } else if (this.keys.right && !this.player.isBlocking) {
        this.player.vx = moveSpeed;
      } else {
        this.player.vx = 0;
      }

      this.updateAI(dt);

      this.player.update(dt);
      this.enemy.update(dt);

      if (this.player.x < this.enemy.x) {
        this.player.facing = 1;
        this.enemy.facing = -1;
      } else {
        this.player.facing = -1;
        this.enemy.facing = 1;
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.userData.life -= dt;
        p.position.x += p.userData.vx * dt;
        p.position.y += p.userData.vy * dt;
        p.userData.vy -= 14 * dt;
        p.scale.multiplyScalar(0.92);

        if (p.userData.life <= 0) {
          this.scene.remove(p);
          this.particles.splice(i, 1);
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  updateAI(dt) {
    if (this.enemy.isDead) return;

    const dist = Math.abs(this.enemy.x - this.player.x);
    this.aiTimer += dt;

    // Responsive footwork & distance control
    const speed = this.isHardcore ? 4.5 : 3.4;
    if (dist > 1.8) {
      this.enemy.vx = (this.player.x < this.enemy.x) ? -speed : speed;
    } else if (dist < 1.3) {
      // Step back slightly if overcrowded
      this.enemy.vx = (this.player.x < this.enemy.x) ? speed * 0.7 : -speed * 0.7;
    } else {
      this.enemy.vx = 0;
    }

    // Dynamic jump counter
    if (!this.player.isGrounded && this.enemy.isGrounded && Math.random() < 0.35) {
      this.enemy.vy = 11.5;
      this.enemy.isGrounded = false;
      audioFX.playWhoosh();
    }

    // Faster action decision rhythm
    if (this.aiTimer > this.aiNextAction) {
      this.aiTimer = 0;
      this.aiNextAction = (this.isHardcore ? 0.28 : 0.42) + Math.random() * 0.25;

      if (dist < 2.15 && this.enemy.punchCooldown <= 0) {
        const roll = Math.random();

        if (roll > (this.isHardcore ? 0.15 : 0.28)) {
          const didPunch = this.enemy.punch();
          if (didPunch) {
            const dmg = (this.isHardcore ? 20 : 14) + Math.floor(Math.random() * 4);
            this.checkHit(this.enemy, this.player, dmg, this.isHardcore ? 'BOSS HOOK!' : 'JAB!');

            // 1-2 Combination (Jab into Cross)
            if (this.isHardcore || Math.random() < 0.42) {
              setTimeout(() => {
                if (this.enemy && !this.enemy.isDead && this.isPlaying) {
                  this.enemy.punchCooldown = 0;
                  this.enemy.punch();
                  const followUpDmg = this.isHardcore ? 18 : 13;
                  this.checkHit(this.enemy, this.player, followUpDmg, 'CROSS!');

                  // In Hardcore: 3-hit flurry finish
                  if (this.isHardcore && Math.random() < 0.5) {
                    setTimeout(() => {
                      if (this.enemy && !this.enemy.isDead && this.isPlaying) {
                        this.enemy.punchCooldown = 0;
                        this.enemy.punch();
                        this.checkHit(this.enemy, this.player, 22, 'UPPERCUT!');
                      }
                    }, 200);
                  }
                }
              }, 190);
            }
          }
        } else {
          this.enemy.isBlocking = true;
          setTimeout(() => {
            if (this.enemy) this.enemy.isBlocking = false;
          }, 360);
        }
      }
    }
  }
}

// Global Easter Egg Listener: Secret Code "ihatecholebhature"
(function initGlobalEasterEgg() {
  let secretBuffer = '';
  window.addEventListener('keydown', (e) => {
    // Hardcore mode CANNOT be triggered again if player has already defeated the hardcore AI!
    if (localStorage.getItem('hardcore_ai_defeated') === 'true') {
      return;
    }

    if (e.key && e.key.length === 1) {
      secretBuffer += e.key.toLowerCase();
      if (secretBuffer.length > 35) secretBuffer = secretBuffer.slice(-35);
      if (secretBuffer.includes('ihatecholebhature')) {
        secretBuffer = '';
        if (window.fightGame) {
          window.fightGame.activateHardcoreMode(true);
        } else if (typeof ArenaFightingGame !== 'undefined' && document.getElementById('fightCanvas')) {
          window.fightGame = new ArenaFightingGame('fightCanvas');
          window.fightGame.activateHardcoreMode(true);
        }
      }
    }
  }, true);
})();

window.ArenaFightingGame = ArenaFightingGame;
