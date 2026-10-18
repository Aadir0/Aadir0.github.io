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

  playCrowdCheer() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Layered noise swell = arena crowd roar
      const dur = 1.6;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        last = 0.94 * last + 0.06 * white; // brownish noise, closer to crowd rumble
        data[i] = last * 3;
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      const filt = this.ctx.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.value = 900;
      filt.Q.value = 0.7;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.25);
      gain.gain.linearRampToValueAtTime(0.16, t + dur * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filt);
      filt.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(t);
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
    this.isKicking = false;
    this.isBlocking = false;
    this.isHurt = false;
    this.isDead = false;
    this.facing = isAI ? -1 : 1;
    this.attackTimer = 0;
    this.kickTimer = 0;
    this.punchHand = 'right';
    this.hurtTimer = 0;
    this.animTime = Math.random() * 5;
    // Emote / celebration state (looping showcase animations)
    this.emote = null;
    this.emoteT = 0;

    // Punch & Kick Cooldown management
    this.punchCooldown = 0;
    this.maxCooldown = isAI ? 0.65 : 0.3;
    this.kickCooldown = 0;
    this.maxKickCooldown = isAI ? 0.95 : 0.55;

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

  reset(x, facing) {
    this.hp = this.maxHp;
    this.x = x;
    this.y = 0;
    this.z = 0;
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = true;
    this.isAttacking = false;
    this.isKicking = false;
    this.isBlocking = false;
    this.isHurt = false;
    this.isDead = false;
    this.facing = facing;
    this.attackTimer = 0;
    this.kickTimer = 0;
    this.punchCooldown = 0;
    this.kickCooldown = 0;
    this.hurtTimer = 0;
    this.emote = null;
    this.emoteT = 0;

    // Reset root position and rotation to neutral fight stance facing each other
    this.root.position.set(this.x, 0, 0);
    this.root.rotation.set(0, facing === 1 ? Math.PI / 2 : -Math.PI / 2, 0);

    // Reset chest, arms, and legs to neutral upright pose
    if (this.chest) {
      this.chest.position.set(0, 1.95, 0);
      this.chest.rotation.set(0, 0, 0);
      this.chest.material.color.setHex(this.isAI ? (this.isHardcore ? 0x991B1B : 0xE2AA68) : 0xD5A272);
    }
    if (this.armR) {
      this.armR.position.set(0.62, 0.15, 0.1);
      this.armR.rotation.set(0, 0, 0);
    }
    if (this.armL) {
      this.armL.position.set(-0.62, 0.15, 0.1);
      this.armL.rotation.set(0, 0, 0);
    }
    if (this.legR) {
      this.legR.position.set(0.28, 0.9, 0);
      this.legR.rotation.set(0, 0, 0);
    }
    if (this.legL) {
      this.legL.position.set(-0.28, 0.9, 0);
      this.legL.rotation.set(0, 0, 0);
    }
  }

  updateTransform() {
    this.root.position.set(this.x, this.y, this.z);
    if (this.emote) {
      if (this.emote !== 'spin' && this.emote !== 'taunt') {
        this.root.rotation.y = 0; // Face forward towards audience during celebration
      }
    } else {
      this.root.rotation.y = this.facing === 1 ? Math.PI / 2 : -Math.PI / 2;
    }
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
    if (this.isAttacking || this.isKicking || this.isHurt || this.isDead || this.isBlocking || this.punchCooldown > 0) return false;
    this.isAttacking = true;
    this.punchCooldown = this.maxCooldown;
    this.attackTimer = 0.18;
    this.punchHand = this.punchHand === 'right' ? 'left' : 'right';
    audioFX.playWhoosh();
    return true;
  }

  kick() {
    if (this.isAttacking || this.isKicking || this.isHurt || this.isDead || this.isBlocking || this.kickCooldown > 0) return false;
    this.isKicking = true;
    this.kickCooldown = this.maxKickCooldown;
    this.kickTimer = 0.28;
    audioFX.playWhoosh();
    return true;
  }

  startEmote(type) {
    if (this.isDead && type !== 'taunt') return;
    this.emote = type;
    this.emoteT = 0;
    this.vx = 0;
    this.vy = 0;
    this.y = 0;
    this.isGrounded = true;
    this.isAttacking = false;
    this.isKicking = false;
    this.isBlocking = false;
    this.punchCooldown = 0;
    this.kickCooldown = 0;
    this.attackTimer = 0;
    this.kickTimer = 0;
    this.armR.rotation.set(0, 0, 0);
    this.armL.rotation.set(0, 0, 0);
    this.legR.rotation.set(0, 0, 0);
    this.legL.rotation.set(0, 0, 0);
    this.legR.position.set(0.28, 0.9, 0);
    this.legL.position.set(-0.28, 0.9, 0);
    this.chest.rotation.set(0, 0, 0);
    this.chest.position.set(0, 1.95, 0);
    if (type !== 'spin') {
      this.root.rotation.y = 0;
    }
  }

  updateEmote(dt) {
    const t = this.emoteT += dt;

    if (this.emote === 'spin') {
      // Victory spin: model turns a couple of full circles, arms flared
      this.root.rotation.y += dt * 9;
      const flare = Math.sin(Math.min(t / 0.3, 1) * Math.PI / 2);
      this.armR.rotation.z = flare * 1.9;
      this.armL.rotation.z = -flare * 1.9;
      this.chest.position.y = 1.95 + Math.sin(t * 12) * 0.05;
      if (t > 1.8) {
        this.root.rotation.y = 0;
        this.armR.rotation.z = 0;
        this.armL.rotation.z = 0;
        this.startEmote('raise');
      }
      return;
    }

    if (this.emote === 'raise') {
      // Traditional arms-up celebration with enthusiastic victory hops
      this.root.rotation.y = 0;
      this.armR.position.set(0.34, 0.65, 0.28);
      this.armL.position.set(-0.34, 0.65, 0.28);
      this.armR.rotation.z = -0.45;
      this.armL.rotation.z = 0.45;
      this.armR.rotation.x = -0.2;
      this.armL.rotation.x = -0.2;
      this.y = Math.abs(Math.sin(t * 7)) * 0.2;
      this.chest.position.y = 1.95 + Math.sin(t * 8) * 0.05;
      return;
    }

    if (this.emote === 'flex') {
      // Double bicep flex, slow power pulse
      this.root.rotation.y = 0;
      const pulse = 1 + Math.sin(t * 5) * 0.14;
      this.armR.position.set(0.40, 0.32, 0.40);
      this.armL.position.set(-0.40, 0.32, 0.40);
      this.armR.rotation.z = -0.95 * pulse;
      this.armL.rotation.z = 0.95 * pulse;
      this.armR.rotation.x = -1.35;
      this.armL.rotation.x = -1.35;
      this.chest.rotation.x = -0.14;
      this.chest.position.y = 1.95 + Math.sin(t * 5) * 0.05;
      return;
    }

    if (this.emote === 'dance') {
      // Side-step dance: alternating arms + hip sway
      this.root.rotation.y = 0;
      const s = Math.sin(t * 9);
      const c = Math.cos(t * 9);
      this.armR.position.set(0.46, 0.5 + s * 0.28, 0.36);
      this.armL.position.set(-0.46, 0.5 - s * 0.28, 0.36);
      this.armR.rotation.z = -0.5 - s * 0.3;
      this.armL.rotation.z = 0.5 - s * 0.3;
      this.root.rotation.z = c * 0.09;
      this.chest.position.y = 1.95 + Math.abs(s) * 0.08;
      this.legR.rotation.x = s * 0.5;
      this.legL.rotation.x = -s * 0.5;
      return;
    }

    if (this.emote === 'taunt') {
      // "Come on!" beckon, for the AI after a win
      this.root.rotation.y = Math.sin(t * 2) * 0.12;
      const swing = Math.sin(t * 6);
      this.armR.position.set(0.55, 0.45 + swing * 0.14, 0.32);
      this.armR.rotation.z = -0.5;
      this.armR.rotation.x = -0.9 + swing * 0.55;
      this.armL.position.set(-0.3, 0.18, 0.40);
      this.armL.rotation.z = 0.25;
      this.chest.position.y = 1.95 + Math.sin(t * 10) * 0.05;
      return;
    }

    this.emote = null;
  }

  update(dt) {
    this.animTime += dt;

    if (this.punchCooldown > 0) {
      this.punchCooldown = Math.max(0, this.punchCooldown - dt);
    }
    if (this.kickCooldown > 0) {
      this.kickCooldown = Math.max(0, this.kickCooldown - dt);
    }

    // Freeze horizontal speed when dead or celebrating so fighters never slide
    if (this.emote || this.isDead) {
      this.vx = 0;
    }

    if (!this.isGrounded && !this.emote) {
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
        const p = Math.sin((this.attackTimer / 0.18) * Math.PI);
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

    if (this.isKicking) {
      this.kickTimer -= dt;
      if (this.kickTimer <= 0) {
        this.isKicking = false;
        this.legR.position.set(0.28, 0.9, 0);
        this.legL.position.set(-0.28, 0.9, 0);
        this.legR.rotation.set(0, 0, 0);
        this.legL.rotation.set(0, 0, 0);
        this.chest.rotation.x = 0;
        this.chest.rotation.z = 0;
      } else {
        const p = Math.sin((this.kickTimer / 0.28) * Math.PI);
        const kickLeg = this.facing === 1 ? this.legR : this.legL;
        const plantLeg = this.facing === 1 ? this.legL : this.legR;

        // Dynamic martial-arts front / roundhouse kick
        kickLeg.rotation.x = -p * 1.65;
        kickLeg.position.z = p * 0.48;
        kickLeg.position.y = 0.9 + p * 0.32;

        plantLeg.rotation.x = p * 0.2;
        this.chest.rotation.x = p * 0.35;
        this.chest.rotation.z = -this.facing * p * 0.14;
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
    } else if (this.emote) {
      this.updateEmote(dt);
    } else if (!this.isAttacking && !this.isKicking && !this.isHurt) {
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

    // Presentation / scenery state
    this.destroyed = false;
    this.envTime = 0;
    this.crowdGroups = [];
    this.crowdFlashMat = null;
    this.belt = null;
    this.modelData = null;
    this.shakeTime = 0;
    this.shakeAmp = 0;
    this.camAngle = 0;
    this.emoteMode = null;
    this.confetti = [];

    // Ease-in camera follow task
    this.camCurrent = new THREE.Vector3(0, 3.0, 9.8);

    this.aiTimer = 0;
    this.aiNextAction = 0.5;

    // Low-poly props exported from Blender (assets/lowpoly_models.json)
    this.loadBlenderProps();

    // Difficulty tuning (Casual / Normal / Hardcore). Hardcore was slightly
    // rebalanced to stay intense but fair: slower decisions, softer combos,
    // fewer free slips.
    this.difficulty = 'normal';
    this.diffConfig = {
      easy: {
        aiMoveSpeed: 2.6,    aiActGap: 0.60, aiActVariance: 0.35, aiMaxCd: 0.95,
        aiDmg: 9,            aiDmgVar: 3,    slipChance: 0.08,    blockChance: 0.28,
        comboChance: 0.10,   jumpReact: 0.15
      },
      normal: {
        aiMoveSpeed: 3.4,    aiActGap: 0.42, aiActVariance: 0.25, aiMaxCd: 0.65,
        aiDmg: 12,           aiDmgVar: 3,    slipChance: 0.24,    blockChance: 0.48,
        comboChance: 0.42,   jumpReact: 0.35
      },
      hardcore: {
        aiMoveSpeed: 3.9,    aiActGap: 0.36, aiActVariance: 0.22, aiMaxCd: 0.52,
        aiDmg: 14,           aiDmgVar: 3,    slipChance: 0.32,    blockChance: 0.58,
        comboChance: 0.55,   jumpReact: 0.40
      }
    };

    this.init();
  }

  diff() {
    return this.diffConfig[this.difficulty] || this.diffConfig.normal;
  }

  setDifficulty(d) {
    if (!this.diffConfig[d]) return;
    this.difficulty = d;
    this.isHardcore = d === 'hardcore';
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
    // Canvas-printed ring mat: navy floor, sponsor ring, corner wedges
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = '#151B27';
    g.fillRect(0, 0, 512, 512);
    // Corner wedges
    g.fillStyle = 'rgba(2, 132, 199, 0.25)';
    g.beginPath(); g.moveTo(0, 0); g.lineTo(120, 0); g.lineTo(0, 120); g.fill();
    g.fillStyle = 'rgba(220, 38, 38, 0.25)';
    g.beginPath(); g.moveTo(512, 0); g.lineTo(392, 0); g.lineTo(512, 120); g.fill();
    g.fillStyle = 'rgba(245, 158, 11, 0.35)';
    g.beginPath(); g.moveTo(256, 512); g.lineTo(180, 512); g.lineTo(256, 436); g.fill();
    // Center logo circle
    g.strokeStyle = 'rgba(245, 158, 11, 0.9)';
    g.lineWidth = 5;
    g.beginPath(); g.arc(256, 256, 74, 0, Math.PI * 2); g.stroke();
    g.font = 'bold 34px Arial';
    g.fillStyle = 'rgba(245, 158, 11, 0.85)';
    g.textAlign = 'center';
    g.fillText('A R', 256, 268);
    g.strokeStyle = 'rgba(226, 232, 240, 0.5)';
    g.lineWidth = 2;
    g.strokeRect(40, 40, 432, 432);

    const matTexture = new THREE.CanvasTexture(c);
    const sideMat = new THREE.MeshStandardMaterial({ color: 0x10141D, roughness: 0.8 });
    const topMat = new THREE.MeshStandardMaterial({ map: matTexture, roughness: 0.85 });

    const canvasMat = new THREE.Mesh(
      new THREE.BoxGeometry(11.5, 0.6, 11.5),
      [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]
    );
    canvasMat.position.y = -0.3;
    this.scene.add(canvasMat);

    const apronGeo = new THREE.BoxGeometry(12.4, 0.5, 12.4);
    const apronMat = new THREE.MeshStandardMaterial({ color: 0x0B0E14, roughness: 0.95 });
    const apron = new THREE.Mesh(apronGeo, apronMat);
    apron.position.y = -0.62;
    this.scene.add(apron);

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
    // Tiered rope colors: white, red, white, amber for a televised look
    const ropeColors = [0xF8FAFC, 0xDC2626, 0xF8FAFC, 0xF59E0B];

    ropeHeights.forEach((rh, idx) => {
      const ropeMat = new THREE.MeshStandardMaterial({ color: ropeColors[idx], roughness: 0.35 });

      const ropeGeoH = new THREE.BoxGeometry(10.6, 0.05, 0.05);
      const ropeBack = new THREE.Mesh(ropeGeoH, ropeMat);
      ropeBack.position.set(0, rh, -5.3);
      this.scene.add(ropeBack);

      const ropeGeoSide = new THREE.BoxGeometry(0.05, 0.05, 10.6);
      const ropeLeft = new THREE.Mesh(ropeGeoSide, ropeMat);
      ropeLeft.position.set(-5.3, rh, 0);
      this.scene.add(ropeLeft);

      const ropeRight = new THREE.Mesh(ropeGeoSide, ropeMat);
      ropeRight.position.set(5.3, rh, 0);
      this.scene.add(ropeRight);

      const frontRopeMat = new THREE.MeshBasicMaterial({ color: ropeColors[idx], transparent: true, opacity: 0.1 });
      const ropeFront = new THREE.Mesh(ropeGeoH, frontRopeMat);
      ropeFront.position.set(0, rh, 5.3);
      this.scene.add(ropeFront);
    });

    // Banner flags strung along the back rope
    const flagColors = [0xF59E0B, 0x0284C7, 0x22C55E, 0xDC2626];
    for (let i = 0; i < 10; i++) {
      const shape = new THREE.BufferGeometry();
      const w = 0.22, h = 0.34;
      const x0 = -4.75 + i * 1.0;
      shape.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        x0, 2.5, -5.3,  x0 + w, 2.5, -5.3,  x0 + w * 0.5, 2.5 - h, -5.3
      ]), 3));
      shape.computeVertexNormals();
      const flag = new THREE.Mesh(shape, new THREE.MeshBasicMaterial({
        color: flagColors[i % flagColors.length],
        side: THREE.DoubleSide
      }));
      this.scene.add(flag);
    }

    // LED advertising boards ringing the floor
    const led = document.createElement('canvas');
    led.width = 1024; led.height = 64;
    const lg = led.getContext('2d');
    lg.fillStyle = '#0A0D13';
    lg.fillRect(0, 0, 1024, 64);
    lg.font = 'bold 30px Arial';
    lg.fillStyle = '#F59E0B';
    lg.fillText('AADITYA RAJ ● UNITY ● C# ● GAME JAMS ● SHIP IT ● AADITYA RAJ', 18, 42);
    const ledTex = new THREE.CanvasTexture(led);
    ledTex.wrapS = THREE.RepeatWrapping;

    const boardGeo = new THREE.BoxGeometry(24, 0.9, 0.3);
    const ledMat = new THREE.MeshBasicMaterial({ map: ledTex });
    const boardDark = new THREE.MeshStandardMaterial({ color: 0x0A0D13 });
    [
      { z: -6.4, y: 0.45 },
      { x: -8.2, rot: Math.PI / 2 },
      { x: 8.2, rot: Math.PI / 2 }
    ].forEach(p => {
      const board = new THREE.Mesh(
        boardGeo,
        [p.x !== undefined ? boardDark : boardDark, boardDark, ledMat, boardDark, boardDark, boardDark]
      );
      if (p.rot) board.rotation.y = p.rot;
      board.position.set(p.x || 0, p.y || 0.45, p.z || 0);
      this.scene.add(board);
    });

    // Hanging light rigs above the ring
    const rigHousingGeo = new THREE.ConeGeometry(0.55, 0.5, 8, 1, true);
    const rigHousingMat = new THREE.MeshStandardMaterial({ color: 0x11151C, roughness: 0.8, side: THREE.DoubleSide });
    const rigBulbGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const rigBulbMat = new THREE.MeshBasicMaterial({ color: 0xFFF7D6 });
    [[-4.5, -4], [4.5, -4], [-4.5, 4], [4.5, 4]].forEach(([x, z]) => {
      const rig = new THREE.Group();
      const housing = new THREE.Mesh(rigHousingGeo, rigHousingMat);
      const bulb = new THREE.Mesh(rigBulbGeo, rigBulbMat);
      bulb.position.y = -0.3;
      rig.add(housing, bulb);
      rig.position.set(x, 7.6, z);
      this.scene.add(rig);

      const cable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 4, 4),
        new THREE.MeshStandardMaterial({ color: 0x1A1F28 })
      );
      cable.position.copy(rig.position);
      cable.position.y = 9.8;
      this.scene.add(cable);
    });
  }

  // --- Blender low-poly props -------------------------------------------------
  loadBlenderProps() {
    fetch('assets/lowpoly_models.json')
      .then(r => r.json())
      .then(json => {
        this.modelData = json;
        if (this.scene) this.buildBlenderProps();
      })
      .catch(() => { /* props are optional; the arena still plays without them */ });
  }

  buildPropGeometry(partObj) {
    // Blender verts/faces -> non-indexed triangle soup
    const tri = [];
    partObj.faces.forEach(f => {
      for (let k = 1; k < f.length - 1; k++) {
        [f[0], f[k], f[k + 1]].forEach(i => {
          const v = partObj.verts[i];
          tri.push(v[0], v[1], v[2]);
        });
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(tri), 3));
    geo.computeVertexNormals();
    return geo;
  }

  buildBlenderProps() {
    const props = this.modelData && this.modelData.props;
    if (!props) return;

    const make = (name, opts = {}) => {
      const parts = props[name];
      if (!parts) return null;
      const group = new THREE.Group();
      parts.forEach((part, idx) => {
        const mat = new THREE.MeshStandardMaterial({
          color: opts.colors ? opts.colors[idx % opts.colors.length] : (opts.color || 0x94A3B8),
          roughness: opts.roughness !== undefined ? opts.roughness : 0.75,
          metalness: opts.metalness || 0
        });
        group.add(new THREE.Mesh(this.buildPropGeometry(part), mat));
      });
      if (opts.position) group.position.set(...opts.position);
      if (opts.rotation) group.rotation.set(...opts.rotation);
      if (opts.scale) group.scale.setScalar(opts.scale);
      this.scene.add(group);
      return group;
    };

    // Championship belt hanging above the ring center
    this.belt = make('belt', {
      colors: [0x1C1917, 0xFBBF24],
      metalness: 0.85,
      roughness: 0.3,
      position: [0, 4.55, 0],
      rotation: [0, 0, 0],
      scale: 1.05
    });

    // Corner stools by the blue / red corners
    make('stool', { colors: [0x0284C7], position: [-4.6, 0, 3.55], scale: 1.15 });
    make('stool', { colors: [0xDC2626], position: [4.6, 0, 3.55], scale: 1.15 });
    make('stool', { colors: [0x0B0E14], position: [-4.6, 0, -4.6], scale: 1.15 });
    make('stool', { colors: [0x0B0E14], position: [4.6, 0, -4.6], scale: 1.15 });

    // Grandstand crowd: merged Blender fans with per-fan clothing color
    const clothes = [0x334155, 0x1E3A8A, 0x7C2D12, 0x831843, 0x134E4A, 0x4C1D95, 0x713F12];
    const skins = [0xD5A272, 0xB97F52, 0x8C5A34];

    for (let sideIdx = 0; sideIdx < 3; sideIdx++) {
      // Accumulate ALL fans of this stand into one buffer -> 1 draw call per stand
      const positions = [];
      const colors = [];
      const angles = sideIdx === 0
        ? Array.from({ length: 15 }, (_, i) => -7.6 + i * 1.08)  // back straight
        : Array.from({ length: 6 }, (_, i) => -13 + i * 0.95);   // angled wings

      for (let row = 0; row < 4; row++) {
        angles.forEach(bx => {
          const skin = skins[Math.floor(Math.random() * skins.length)];
          const cloth = clothes[Math.floor(Math.random() * clothes.length)];
          const offsetX = sideIdx === 1 ? 10.5 : sideIdx === 2 ? -10.5 : 0;
          const forwardZ = sideIdx === 0 ? 0 : 2.4;
          const jitter = (Math.random() - 0.5) * 0.4;
          const y = 0.9 + row * 0.72;
          const z = -8.6 - row * 1.45 + Math.abs(bx) * 0.06 + forwardZ;
          const scale = 0.95 + Math.random() * 0.3;
          const mat4 = new THREE.Matrix4().compose(
            new THREE.Vector3(bx + offsetX + jitter, y, z),
            new THREE.Quaternion(),
            new THREE.Vector3(scale, scale, scale)
          );

          props['crowdfolk'].forEach((partObj, partIdx) => {
            const color = new THREE.Color(partIdx === 0 ? cloth : skin);
            partObj.faces.forEach(f => {
              for (let k = 1; k < f.length - 1; k++) {
                [f[0], f[k], f[k + 1]].forEach(i => {
                  const v = partObj.verts[i];
                  const p = new THREE.Vector3(v[0], v[1], v[2]).applyMatrix4(mat4);
                  positions.push(p.x, p.y, p.z);
                  colors.push(color.r, color.g, color.b);
                });
              }
            });
          });
        });
      }

      const mergedGeo = new THREE.BufferGeometry();
      mergedGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
      mergedGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
      mergedGeo.computeVertexNormals();

      const group = new THREE.Group();
      group.userData.bobPhase = sideIdx * 2.1;
      group.add(new THREE.Mesh(mergedGeo, new THREE.MeshStandardMaterial({
        vertexColors: true, roughness: 0.9
      })));
      this.crowdGroups.push(group);
      this.scene.add(group);
    }

    // Press cameras filming from the wings
    make('presscam', { colors: [0x1F2937, 0x111827], position: [-8.6, 2.4, -6.4], rotation: [0, 0.6, 0] });
    make('presscam', { colors: [0x1F2937, 0x111827], position: [8.6, 2.4, -6.4], rotation: [0, -0.6, 0] });
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
    this.crowdFlashMat = mat;
    this.scene.add(this.crowdFlashes);
  }

  bindControls() {
    const handleViewportChange = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.checkOrientation();
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleViewportChange, 200);
    });

    // Mark touch device early
    const markTouch = () => {
      document.body.classList.add('touch-device');
      const root = document.getElementById('fightScreenRoot');
      if (root) root.classList.add('touch-device');
    };
    if (this.isTouchDevice()) {
      markTouch();
    }
    window.addEventListener('touchstart', markTouch, { once: true, passive: true });

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
      if ((e.key === ' ' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') && this.player.isGrounded) {
        this.player.vy = 11.5;
        this.player.isGrounded = false;
        audioFX.playWhoosh();
      }
      // Kick: E or K
      if (e.key === 'e' || e.key === 'E' || e.key === 'k' || e.key === 'K') {
        this.triggerPlayerKick();
      }
      // Punch via keyboard: F or J
      if (e.key === 'f' || e.key === 'F' || e.key === 'j' || e.key === 'J') {
        this.triggerPlayerPunch();
      }
      // Block via keyboard: S, L, or Shift
      if (e.key === 's' || e.key === 'S' || e.key === 'l' || e.key === 'L' || e.key === 'Shift') {
        if (this.player) this.player.isBlocking = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        this.keys.left = false;
      }
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        this.keys.right = false;
      }
      if (e.key === 's' || e.key === 'S' || e.key === 'l' || e.key === 'L' || e.key === 'Shift') {
        if (this.player) this.player.isBlocking = false;
      }
    });

    // Dedicated Touch Controls for Mobile
    this.bindTouchButton('btnMobileJump', 
      () => {
        if (this.player && this.player.isGrounded) {
          this.player.vy = 11.5;
          this.player.isGrounded = false;
          audioFX.playWhoosh();
          if (navigator.vibrate) navigator.vibrate(10);
        }
      }, 
      () => {}
    );

    this.bindTouchButton('btnMobileKick', 
      () => { this.triggerPlayerKick(); }, 
      () => {}
    );

    this.bindTouchButton('btnMobilePunch', 
      () => { this.triggerPlayerPunch(); }, 
      () => {}
    );

    this.bindTouchButton('btnMobileBlock', 
      () => {
        if (this.player) {
          this.player.isBlocking = true;
          if (navigator.vibrate) navigator.vibrate(12);
        }
      }, 
      () => { if (this.player) this.player.isBlocking = false; }
    );

    // Continuous Slide D-Pad Rocker (smooth thumb sliding without dead stops)
    const dpadZone = document.getElementById('mobileDpadZone');
    const btnLeft = document.getElementById('btnMobileLeft');
    const btnRight = document.getElementById('btnMobileRight');

    if (dpadZone) {
      const updateDpadTouch = (touchX) => {
        const rect = dpadZone.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const deadzone = rect.width * 0.10;

        if (touchX < midX - deadzone) {
          if (!this.keys.left) {
            this.keys.left = true;
            this.keys.right = false;
            if (btnLeft) btnLeft.classList.add('active');
            if (btnRight) btnRight.classList.remove('active');
            if (navigator.vibrate) navigator.vibrate(8);
          }
        } else if (touchX > midX + deadzone) {
          if (!this.keys.right) {
            this.keys.right = true;
            this.keys.left = false;
            if (btnRight) btnRight.classList.add('active');
            if (btnLeft) btnLeft.classList.remove('active');
            if (navigator.vibrate) navigator.vibrate(8);
          }
        } else {
          this.keys.left = false;
          this.keys.right = false;
          if (btnLeft) btnLeft.classList.remove('active');
          if (btnRight) btnRight.classList.remove('active');
        }
      };

      const resetDpad = (e) => {
        if (e && e.cancelable) e.preventDefault();
        this.keys.left = false;
        this.keys.right = false;
        if (btnLeft) btnLeft.classList.remove('active');
        if (btnRight) btnRight.classList.remove('active');
      };

      dpadZone.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        if (touch) updateDpadTouch(touch.clientX);
      }, { passive: false });

      dpadZone.addEventListener('touchmove', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        if (touch) updateDpadTouch(touch.clientX);
      }, { passive: false });

      dpadZone.addEventListener('touchend', resetDpad, { passive: false });
      dpadZone.addEventListener('touchcancel', resetDpad, { passive: false });
    }

    // Tap-to-Punch on arena canvas (forgiving mobile strikes)
    this.canvas.addEventListener('touchstart', (e) => {
      if (!this.isPlaying) return;
      const touch = e.touches[0];
      if (!touch) return;
      // Right 58% of viewport triggers instant punch
      if (touch.clientX > window.innerWidth * 0.42) {
        this.triggerPlayerPunch();
      }
    }, { passive: true });
  }

  isTouchDevice() {
    return window.matchMedia('(pointer: coarse)').matches || 
           'ontouchstart' in window || 
           (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
  }

  // Mobile: fullscreen + landscape lock (falls back to a rotate prompt when
  // the browser blocks orientation locking)
  enterMobileLandscape() {
    if (!this.isTouchDevice()) return;

    const el = document.getElementById('fightScreenRoot');
    if (el && !document.fullscreenElement && !document.webkitFullscreenElement) {
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) {
        try {
          const p = el.requestFullscreen();
          if (p && p.catch) p.catch(() => {});
        } catch (e) {}
      }
    }

    const lockLandscape = () => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    };
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      lockLandscape();
    } else {
      // Give the fullscreen transition a moment before locking orientation
      setTimeout(lockLandscape, 400);
    }

    // Show / clear the rotate prompt once the layout settles
    setTimeout(() => this.checkOrientation(), 150);
    setTimeout(() => this.checkOrientation(), 900);
  }

  checkOrientation() {
    const prompt = document.getElementById('rotatePrompt');
    if (!prompt) return;

    if (!prompt._hasDismissListener) {
      prompt._hasDismissListener = true;
      prompt.addEventListener('click', () => {
        prompt.classList.add('hidden');
        this.enterMobileLandscape();
      });
    }

    const isPortrait = window.innerHeight > window.innerWidth;
    const show = this.isTouchDevice() && this.isPlaying && isPortrait;
    prompt.classList.toggle('hidden', !show);
  }

  bindTouchButton(id, onStart, onEnd) {
    const btn = document.getElementById(id);
    if (!btn) return;

    const startHandler = (e) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      btn.classList.add('active');
      onStart();
    };

    const endHandler = (e) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      btn.classList.remove('active');
      onEnd();
    };

    btn.addEventListener('touchstart', startHandler, { passive: false });
    btn.addEventListener('touchend', endHandler, { passive: false });
    btn.addEventListener('touchcancel', endHandler, { passive: false });

    // Pointer events for desktop or hybrid devices: ignore touch pointerType to avoid duplicate triggers
    btn.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return;
      startHandler(e);
    });
    btn.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') return;
      endHandler(e);
    });
    btn.addEventListener('pointercancel', (e) => {
      if (e.pointerType === 'touch') return;
      endHandler(e);
    });
  }

  activateHardcoreMode(forceImmediate = true) {
    // Typing the secret code resets defeat state so the creator/player can always replay
    this.hasDefeatedHardcore = false;
    try {
      localStorage.removeItem('hardcore_ai_defeated');
    } catch (e) {}

    this.destroyed = false;
    this.isHardcore = true;
    this.difficulty = 'hardcore';
    audioFX.isMuted = false;
    audioFX.init();
    audioFX.playHardcoreRoar();

    // Rebuild enemy in Hardcore Raged Boss Form
    this.rebuildEnemyRig(true);
    this.enemy.x = 2.8;

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
    // Auto-face opponent so attacks never swing backwards
    if (this.enemy) {
      this.player.facing = this.enemy.x > this.player.x ? 1 : -1;
      this.player.root.rotation.y = this.player.facing === 1 ? Math.PI / 2 : -Math.PI / 2;
    }
    const didPunch = this.player.punch();
    if (!didPunch) return;
    if (navigator.vibrate) navigator.vibrate(16);
    const damage = Math.floor(Math.random() * 5) + 14;
    this.checkHit(this.player, this.enemy, damage, 'JAB!');
  }

  triggerPlayerKick() {
    if (!this.player || this.player.isDead || this.player.kickCooldown > 0) return;
    // Auto-face opponent
    if (this.enemy) {
      this.player.facing = this.enemy.x > this.player.x ? 1 : -1;
      this.player.root.rotation.y = this.player.facing === 1 ? Math.PI / 2 : -Math.PI / 2;
    }
    const didKick = this.player.kick();
    if (!didKick) return;
    if (navigator.vibrate) navigator.vibrate(26);
    const damage = Math.floor(Math.random() * 6) + 20;
    this.checkHit(this.player, this.enemy, damage, 'ROUNDHOUSE KICK!', true);
  }

  checkHit(attacker, defender, damage, label, isKick = false) {
    const dist = Math.abs(attacker.x - defender.x);
    // Player gets slightly more forgiving reach (2.25 punch / 2.65 kick) so mobile combat connects crisply
    const baseReach = isKick ? 2.35 : 1.95;
    const maxReach = attacker === this.player ? (baseReach + 0.3) : baseReach;
    if (dist < maxReach) {
      // AI Defensive Reactions (Slipping & Guard Blocking with Counters)
      if (defender.isAI && !defender.isAttacking) {
        const cfg = this.diff();
        const roll = Math.random();
        if (roll < cfg.slipChance) {
          // Slip backward out of range
          defender.x += defender.facing * -0.65;
          defender.x = Math.max(-4.2, Math.min(4.2, defender.x));
          this.showDamageText('SLIP!', defender.x);
          return;
        } else if (roll < cfg.blockChance) {
          // Guard block absorbing 84% damage + immediate counter jab!
          defender.isBlocking = true;
          setTimeout(() => {
            if (defender) defender.isBlocking = false;
          }, 320);
          setTimeout(() => {
            if (defender && !defender.isDead && this.isPlaying && defender.punchCooldown <= 0.15) {
              defender.punchCooldown = 0;
              defender.punch();
              this.checkHit(defender, attacker, Math.max(8, this.diff().aiDmg - 2), 'COUNTER!');
            }
          }, 220);
        }
      }

      const wasBlocked = defender.isBlocking;
      defender.takeDamage(damage, damage > 18);
      this.spawnSparks(defender.x, defender.y + 1.4);
      this.showDamageText(wasBlocked ? `BLOCKED!` : `${label} -${damage}`, defender.x);
      this.updateHUD();

      this.shakeCamera(damage > 18 || defender.isDead);

      if (defender.isDead) {
        if (defender === this.enemy) {
          this.triggerVictory();
        } else {
          this.triggerDefeat();
        }
      }
    }
  }

  shakeCamera(heavy = false) {
    this.shakeAmp = heavy ? 0.3 : 0.18;
    this.shakeTime = heavy ? 0.30 : 0.18;
  }

  updateCamera(dt) {
    const base = this.camCurrent;

    if (this.emoteMode) {
      // Victory / Defeat showcase: smooth cinematic orbit around the winning fighter
      this.camAngle += dt * 0.45;
      const winner = this.isVictory ? this.player : this.enemy;
      const winnerX = winner ? winner.x : 0;
      const radius = 5.6;
      const target = new THREE.Vector3(
        winnerX + Math.sin(this.camAngle) * radius,
        2.6,
        Math.cos(this.camAngle) * radius
      );
      base.lerp(target, Math.min(1, dt * 2.8));
      this.camera.position.copy(base);
      this.camera.lookAt(winnerX, 1.7, 0);
      return;
    }

    // Gameplay: camera gently follows the midpoint of the fighters
    const mid = this.player ? (this.player.x + this.enemy.x) / 2 : 0;
    const target = new THREE.Vector3(mid * 0.35, 3.0, 9.8);
    base.lerp(target, Math.min(1, dt * 3));

    let sx = 0, sy = 0;
    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      const k = this.shakeAmp * Math.max(0, this.shakeTime / (this.shakeAmp > 0.2 ? 0.3 : 0.18));
      sx = (Math.random() - 0.5) * k;
      sy = (Math.random() - 0.5) * k;
    }

    this.camera.position.set(base.x + sx, base.y + sy, base.z);
    this.camera.lookAt(mid * 0.35, 1.5, 0);
  }

  spawnConfetti(x, y, count = 70) {
    const palette = [0xF59E0B, 0x0284C7, 0x22C55E, 0xF8FAFC, 0xDC2626, 0xFBBF24];
    for (let i = 0; i < count; i++) {
      const color = palette[i % palette.length];
      const p = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.02, 0.06),
        new THREE.MeshBasicMaterial({ color })
      );
      p.position.set(x + (Math.random() - 0.5) * 3.4, y + Math.random() * 1.5, (Math.random() - 0.5) * 2.5);
      p.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      p.userData = {
        vx: (Math.random() - 0.5) * 1.8,
        vy: Math.random() * 2.4 + 1.2,
        vz: (Math.random() - 0.5) * 1.4,
        rx: (Math.random() - 0.5) * 10,
        rz: (Math.random() - 0.5) * 10,
        life: 4 + Math.random() * 2
      };
      this.scene.add(p);
      this.confetti.push(p);
    }
  }

  updateConfetti(dt) {
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const p = this.confetti[i];
      const d = p.userData;
      d.vy -= 2.4 * dt;
      p.position.x += d.vx * dt;
      p.position.y += d.vy * dt;
      p.position.z += d.vz * dt;
      if (p.position.y < 0.02) {
        p.position.y = 0.02;
        d.vy = 0; d.vx *= 0.9; d.vz *= 0.9;
      }
      p.rotation.x += d.rx * dt;
      p.rotation.z += d.rz * dt;
      d.life -= dt;
      if (d.life <= 0 || this.confetti.length > 240) {
        this.scene.remove(p);
        p.geometry.dispose();
        this.confetti.splice(i, 1);
      }
    }
  }

  updateScenery(dt) {
    this.envTime += dt;

    // Crowd bobbing in three staggered groups + camera flash flicker
    this.crowdGroups.forEach((g, i) => {
      g.position.y = Math.abs(Math.sin(this.envTime * 2.2 + g.userData.bobPhase)) * 0.05;
    });
    if (this.crowdFlashMat) {
      this.crowdFlashMat.opacity = 0.5 + Math.abs(Math.sin(this.envTime * 2.6)) * 0.35;
    }

    // Championship belt sway
    if (this.belt) {
      this.belt.rotation.z = Math.sin(this.envTime * 0.9) * 0.09;
      this.belt.rotation.x = Math.sin(this.envTime * 0.6 + 1) * 0.05;
    }
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
    if (text.includes('KICK') || text.includes('UPPERCUT') || text.includes('ROUNDHOUSE')) {
      el.classList.add('crit-hit');
    } else if (text.includes('BLOCKED')) {
      el.classList.add('blocked-hit');
    } else if (text.includes('SLIP')) {
      el.classList.add('slip-hit');
    }
    el.textContent = text;
    el.style.left = `${(x + 5.5) / 11 * 100}%`;
    el.style.top = '44%';
    const root = document.getElementById('fightScreenRoot');
    if (root) {
      root.appendChild(el);
      setTimeout(() => el.remove(), 750);
    }
  }

  rebuildEnemyRig(hardcore) {
    const x = this.enemy ? this.enemy.x : 2.8;
    if (this.enemy && this.enemy.root) {
      this.scene.remove(this.enemy.root);
    }
    this.enemy = new BoxerRig(this.scene, true, hardcore);
    this.enemy.x = x;
    this.enemy.maxCooldown = this.diff().aiMaxCd;

    const enemyName = document.getElementById('enemyNameLabel');
    if (enemyName) {
      enemyName.innerHTML = hardcore
        ? `<span style="color: #EF4444; font-size: 1rem;">🔥</span> Aaditya Raj (BOSS)`
        : `Aaditya Raj (AI)`;
    }
  }

  startFight() {
    this.isPlaying = true;
    this.isVictory = false;
    this.isDefeat = false;

    // Keep the enemy's visual form in sync with the selected difficulty
    if (this.enemy.isHardcore !== (this.difficulty === 'hardcore')) {
      this.rebuildEnemyRig(this.difficulty === 'hardcore');
    }
    this.enemy.maxCooldown = this.diff().aiMaxCd;

    // Reset both fighters cleanly into upright combat stances
    this.player.reset(-2.8, 1);
    this.enemy.reset(2.8, -1);

    // Reset camera immediately to pristine standard combat viewpoint
    this.emoteMode = null;
    this.camAngle = 0;
    this.shakeTime = 0;
    this.shakeAmp = 0;
    this.camCurrent.set(0, 3.0, 9.8);
    this.camera.position.set(0, 3.0, 9.8);
    this.camera.lookAt(0, 1.5, 0);

    this.keys.left = false;
    this.keys.right = false;

    this.setOverlay(null);
    this.updateHUD();
    audioFX.playBell();
    this.enterMobileLandscape();
  }

  setOverlay(name) {
    // Central overlay switcher; also clasps the touch gamepad while a modal is open
    const root = document.getElementById('fightScreenRoot');
    const overlays = {
      start: document.getElementById('fightStartOverlay'),
      win: document.getElementById('fightWinOverlay'),
      lose: document.getElementById('fightLoseOverlay')
    };
    Object.entries(overlays).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle('hidden', key !== name);
    });
    if (root) root.classList.toggle('overlay-open', !!name);
  }

  triggerVictory() {
    this.isPlaying = false;
    this.isVictory = true;
    this.emoteMode = 'victory';
    this.keys.left = false;
    this.keys.right = false;
    this.player.vx = 0;
    this.enemy.vx = 0;
    audioFX.playVictory();
    audioFX.playCrowdCheer();
    this.checkOrientation();
    this.setOverlay('win');

    // Winner celebrates right at their current position!
    const victoryEmotes = ['dance', 'flex', 'spin', 'raise'];
    const chosenEmote = victoryEmotes[Math.floor(Math.random() * victoryEmotes.length)];
    this.player.startEmote(chosenEmote);
    this.spawnConfetti(this.player.x, 3.4, 90);
    setTimeout(() => this.spawnConfetti(this.player.x, 3.8, 50), 700);

    // Keep alive the Raged Boss achievement flow
    if (this.isHardcore) {
      this.hasDefeatedHardcore = true;
      localStorage.setItem('hardcore_ai_defeated', 'true');

      const winTitle = document.getElementById('winTitleText');
      const winSubtitle = document.getElementById('winSubtitleText');
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
      const winTitle = document.getElementById('winTitleText');
      const winSubtitle = document.getElementById('winSubtitleText');
      if (winTitle) {
        winTitle.textContent = `Victory 🏆`;
        winTitle.style.color = '#22C55E';
      }
      if (winSubtitle) {
        winSubtitle.textContent = `Match won! Step right into Aaditya's developer portfolio.`;
      }
    }
  }

  triggerDefeat() {
    this.isPlaying = false;
    this.isDefeat = true;
    this.emoteMode = 'defeat';
    this.keys.left = false;
    this.keys.right = false;
    this.player.vx = 0;
    this.enemy.vx = 0;
    audioFX.playBell();
    audioFX.playCrowdCheer();
    this.checkOrientation();
    this.setOverlay('lose');

    // The AI gloats right at their current position with a randomized celebration emote
    if (this.enemy && !this.enemy.isDead) {
      const aiEmotes = ['taunt', 'dance', 'flex', 'spin', 'raise'];
      const chosenAiEmote = aiEmotes[Math.floor(Math.random() * aiEmotes.length)];
      this.enemy.startEmote(chosenAiEmote);
      this.spawnConfetti(this.enemy.x, 3.4, 70);
    }
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

      // Mirror cooldown readiness onto the mobile punch button
      const punchBtn = document.getElementById('btnMobilePunch');
      if (punchBtn) {
        punchBtn.classList.toggle('punch-ready', cdPercent >= 98);
      }
    }
  }

  destroy() {
    this.isPlaying = false;
    this.destroyed = true;
    this.emoteMode = null;
    audioFX.isMuted = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    const prompt = document.getElementById('rotatePrompt');
    if (prompt) prompt.classList.add('hidden');

    // Release fullscreen & orientation lock so the website returns to normal vertical display
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const exitFs = document.exitFullscreen || document.webkitExitFullscreen;
      if (exitFs) {
        try {
          const p = exitFs.call(document);
          if (p && p.catch) p.catch(() => {});
        } catch (e) {}
      }
    }
    if (typeof screen !== 'undefined' && screen.orientation) {
      if (screen.orientation.unlock) {
        try { screen.orientation.unlock(); } catch (e) {}
      }
      if (screen.orientation.lock) {
        try { screen.orientation.lock('portrait').catch(() => {}); } catch (e) {}
      }
    }
  }

  animate() {
    if (this.destroyed || !this.player) return;

    this.animFrameId = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.1);

    this.updateScenery(dt);

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
    } else {
      // Emote showcase keeps animating with a live camera during overlays
      this.player.update(dt);
      this.enemy.update(dt);
    }

    // Hit sparks (always alive, regardless of state)
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

    this.updateConfetti(dt);
    this.updateCamera(dt);

    this.renderer.render(this.scene, this.camera);
  }

  updateAI(dt) {
    if (this.enemy.isDead) return;

    const dist = Math.abs(this.enemy.x - this.player.x);
    this.aiTimer += dt;

    // Responsive footwork & distance control
    const cfg = this.diff();
    const speed = cfg.aiMoveSpeed;
    if (dist > 1.8) {
      this.enemy.vx = (this.player.x < this.enemy.x) ? -speed : speed;
    } else if (dist < 1.3) {
      // Step back slightly if overcrowded
      this.enemy.vx = (this.player.x < this.enemy.x) ? speed * 0.7 : -speed * 0.7;
    } else {
      this.enemy.vx = 0;
    }

    // Dynamic jump counter (chance is per-second, not per-frame)
    if (!this.player.isGrounded && this.enemy.isGrounded && Math.random() < cfg.jumpReact * dt * 8) {
      this.enemy.vy = 11.5;
      this.enemy.isGrounded = false;
      audioFX.playWhoosh();
    }

    // Faster action decision rhythm
    if (this.aiTimer > this.aiNextAction) {
      this.aiTimer = 0;
      this.aiNextAction = cfg.aiActGap + Math.random() * cfg.aiActVariance;

      // AI Kick Decision: kicks have longer reach
      if (dist < 2.3 && this.enemy.kickCooldown <= 0) {
        const kickRoll = Math.random();
        if (kickRoll < (this.isHardcore ? 0.38 : 0.22)) {
          const didKick = this.enemy.kick();
          if (didKick) {
            const kickDmg = this.isHardcore ? 20 : 16;
            this.checkHit(this.enemy, this.player, kickDmg, this.isHardcore ? 'BOSS ROUNDHOUSE!' : 'AI KICK!', true);
            return;
          }
        }
      }

      if (dist < 2.15 && this.enemy.punchCooldown <= 0) {
        const roll = Math.random();

        if (roll > 0.2) {
          const didPunch = this.enemy.punch();
          if (didPunch) {
            const dmg = cfg.aiDmg + Math.floor(Math.random() * cfg.aiDmgVar);
            this.checkHit(this.enemy, this.player, dmg, this.isHardcore ? 'BOSS HOOK!' : 'JAB!');

            // 1-2 Combination (Jab into Cross)
            if (this.isHardcore || Math.random() < cfg.comboChance) {
              setTimeout(() => {
                if (this.enemy && !this.enemy.isDead && this.isPlaying) {
                  this.enemy.punchCooldown = 0;
                  this.enemy.punch();
                  const followUpDmg = this.isHardcore ? 15 : 12;
                  this.checkHit(this.enemy, this.player, followUpDmg, 'CROSS!');

                  // In Hardcore: 3-hit flurry finish
                  if (this.isHardcore && Math.random() < 0.5) {
                    setTimeout(() => {
                      if (this.enemy && !this.enemy.isDead && this.isPlaying) {
                        this.enemy.punchCooldown = 0;
                        this.enemy.punch();
                        this.checkHit(this.enemy, this.player, 17, 'UPPERCUT!');
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

  const triggerEgg = () => {
    secretBuffer = '';
    try {
      localStorage.removeItem('hardcore_ai_defeated');
    } catch (e) {}

    if (window.fightGame) {
      window.fightGame.hasDefeatedHardcore = false;
      window.fightGame.activateHardcoreMode(true);
    } else if (typeof ArenaFightingGame !== 'undefined' && document.getElementById('fightCanvas')) {
      window.fightGame = new ArenaFightingGame('fightCanvas');
      window.fightGame.activateHardcoreMode(true);
    }
  };

  // 1. Keyboard event listener (Desktop physical typing)
  window.addEventListener('keydown', (e) => {
    if (e.key && e.key.length === 1) {
      secretBuffer += e.key.toLowerCase();
      if (secretBuffer.length > 40) secretBuffer = secretBuffer.slice(-40);
      if (secretBuffer.includes('ihatecholebhature')) {
        triggerEgg();
      }
    }
  }, true);

  // 2. Input event listener (Mobile software keyboards, copy-paste, or contact form inputs)
  document.addEventListener('input', (e) => {
    const val = (e.target && e.target.value ? e.target.value : '').toLowerCase();
    if (val.includes('ihatecholebhature')) {
      triggerEgg();
    }
  }, true);

  // 3. URL Hash & Query Trigger (e.g., cholebhature.me#ihatecholebhature)
  const checkUrlTrigger = () => {
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    if (hash.includes('ihatecholebhature') || search.includes('ihatecholebhature')) {
      setTimeout(triggerEgg, 300);
    }
  };
  checkUrlTrigger();
  window.addEventListener('hashchange', checkUrlTrigger);

  // 4. Console shortcut for testing: ihatecholebhature()
  window.ihatecholebhature = triggerEgg;
})();

window.ArenaFightingGame = ArenaFightingGame;
