/* ==========================================================================
   SNEHA & JATIN - THE COSMIC BIRTHDAY & 3D ROMANCE JAVASCRIPT ENGINE
   Advanced GSAP ScrollTrigger, Three.js Cosmic Canvas & Audio Synthesis
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* --------------------------------------------------------------------------
     1. THREE.JS 3D COSMIC BACKGROUND & FLOATING ROSE PETALS
     -------------------------------------------------------------------------- */
  function initThreeBackground() {
    const canvas = document.getElementById('threeCanvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Starfield Particle Geometry
    const starsCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    const palette = [
      new THREE.Color(0xff1a60),
      new THREE.Color(0xffd700),
      new THREE.Color(0x00f0ff),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < starsCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Floating 3D Love Crystal Orbs
    const orbs = [];
    const orbGeo = new THREE.IcosahedronGeometry(0.8, 1);

    for (let i = 0; i < 18; i++) {
      const orbMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff1a60 : 0xffd700,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 30
      );
      orb.rotSpeedX = (Math.random() - 0.5) * 0.02;
      orb.rotSpeedY = (Math.random() - 0.5) * 0.02;
      scene.add(orb);
      orbs.push(orb);
    }

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateThree() {
      requestAnimationFrame(animateThree);

      starField.rotation.y += 0.0008;
      starField.rotation.x += 0.0004;

      camera.position.x += (mouseX * 5 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      orbs.forEach(orb => {
        orb.rotation.x += orb.rotSpeedX;
        orb.rotation.y += orb.rotSpeedY;
      });

      renderer.render(scene, camera);
    }
    animateThree();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  initThreeBackground();

  /* --------------------------------------------------------------------------
     2. FAIRY WAND STARDUST SPARKLE TRAIL
     -------------------------------------------------------------------------- */
  const trailCanvas = document.getElementById('sparkleTrailCanvas');
  const trailCtx = trailCanvas.getContext('2d');
  const fairyCursor = document.getElementById('fairyCursor');
  const fairyCursorGlow = document.getElementById('fairyCursorGlow');
  let sparkles = [];

  function resizeTrailCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeTrailCanvas);
  resizeTrailCanvas();

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 1.5;
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2 - 0.8;
      this.color = Math.random() > 0.5 ? '#ff1a60' : (Math.random() > 0.5 ? '#ffd700' : '#00f0ff');
      this.life = 1;
      this.decay = Math.random() * 0.03 + 0.02;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
    }
    draw() {
      trailCtx.save();
      trailCtx.globalAlpha = Math.max(this.life, 0);
      trailCtx.fillStyle = this.color;
      trailCtx.shadowBlur = 10;
      trailCtx.shadowColor = this.color;
      trailCtx.beginPath();
      trailCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      trailCtx.fill();
      trailCtx.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    if (fairyCursor && fairyCursorGlow) {
      fairyCursor.style.left = `${e.clientX}px`;
      fairyCursor.style.top = `${e.clientY}px`;
      fairyCursorGlow.style.left = `${e.clientX}px`;
      fairyCursorGlow.style.top = `${e.clientY}px`;
    }

    for (let i = 0; i < 2; i++) {
      sparkles.push(new Sparkle(e.clientX, e.clientY));
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      for (let i = 0; i < 2; i++) {
        sparkles.push(new Sparkle(touch.clientX, touch.clientY));
      }
    }
  });

  function animateSparkleTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    sparkles = sparkles.filter(s => s.life > 0);
    sparkles.forEach(s => {
      s.update();
      s.draw();
    });
    requestAnimationFrame(animateSparkleTrail);
  }
  animateSparkleTrail();

  /* --------------------------------------------------------------------------
     3. AUDIO SYNTHESIS & REAL HINDI BIRTHDAY MUSIC ENGINE (Downloaded MP3s)
     -------------------------------------------------------------------------- */
  class CosmicAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.isMuted = false;
      this.userHasInteracted = false;
      this.activeSongId = 'bday_wish';
      this.trackIndex = 0;
      this.timerId = null;

      // Real HTML5 Audio Player for actual downloaded MP3 files
      this.htmlAudio = new Audio();
      this.htmlAudio.preload = 'auto';
      this.htmlAudio.volume = 0.9;

      // When audio finishes, loop seamlessly
      this.htmlAudio.addEventListener('ended', () => {
        if (this.isPlaying) {
          this.htmlAudio.currentTime = 0;
          this.htmlAudio.play().catch(() => {});
        }
      });

      // Direct paths to the user's downloaded songs in the audio/ directory
      this.audioStreamUrls = {
        bday_wish: [
          'audio/A-Wish-You-Happy-Happy-Birthday.mp3',
          'audio/Birthday-Hindi-Song.mp3'
        ],
        hindi_song: [
          'audio/Birthday-Hindi-Song.mp3',
          'audio/Birthday-Hindi-Song-1.mp3'
        ],
        song_hindi: [
          'audio/Birthday-Song-Hindi.mp3',
          'audio/Birthday-Hindi-Song.mp3'
        ],
        hindi_wishes: [
          'audio/Tera-Happy-Birthday-Hindi-Wishes.mp3',
          'audio/A-Wish-You-Happy-Happy-Birthday.mp3'
        ],
        hindi_song_1: [
          'audio/Birthday-Hindi-Song-1.mp3',
          'audio/Birthday-Song-Hindi.mp3'
        ],
        tere_bhai: [
          'audio/Tere-Bhai-Ka-Birthday-Hai.mp3',
          'audio/Birthday-Hindi-Song.mp3'
        ]
      };

      this.tracks = [
        {
          id: 'bday_wish',
          file: 'audio/A-Wish-You-Happy-Happy-Birthday.mp3',
          name: "विश यू हैप्पी बर्थडे (A Wish You Happy Birthday)",
          sub: "Sneha's Birthday Anthem • Grand Celebration Mix",
          melody: [
            { f: 392.00, d: 0.35, t: 0.0 }, { f: 392.00, d: 0.35, t: 0.35 }, { f: 440.00, d: 0.5, t: 0.7 },
            { f: 392.00, d: 0.5, t: 1.2 }, { f: 523.25, d: 0.7, t: 1.7 }, { f: 493.88, d: 0.9, t: 2.4 },
            { f: 392.00, d: 0.35, t: 3.4 }, { f: 392.00, d: 0.35, t: 3.75 }, { f: 440.00, d: 0.5, t: 4.1 },
            { f: 392.00, d: 0.5, t: 4.6 }, { f: 587.33, d: 0.7, t: 5.1 }, { f: 523.25, d: 0.9, t: 5.8 }
          ],
          duration: 14000
        },
        {
          id: 'hindi_song',
          file: 'audio/Birthday-Hindi-Song.mp3',
          name: "जन्मदिन का तोहफा (Birthday Hindi Song)",
          sub: "Royal Surprise & Sacred Vows • Sneha & Jatin",
          melody: [
            { f: 392.00, d: 0.5, t: 0.0 }, { f: 523.25, d: 0.7, t: 0.6 }, { f: 493.88, d: 0.5, t: 1.3 },
            { f: 440.00, d: 0.6, t: 1.9 }, { f: 392.00, d: 0.8, t: 2.6 }, { f: 349.23, d: 0.5, t: 3.5 }
          ],
          duration: 9000
        },
        {
          id: 'song_hindi',
          file: 'audio/Birthday-Song-Hindi.mp3',
          name: "दिल की धड़कन (Birthday Song Hindi)",
          sub: "Soulmate Connection & 100 Reasons • Jatin's Heartbeat",
          melody: [
            { f: 293.66, d: 0.5, t: 0.0 }, { f: 349.23, d: 0.5, t: 0.6 }, { f: 392.00, d: 0.6, t: 1.2 },
            { f: 440.00, d: 0.8, t: 1.9 }, { f: 523.25, d: 0.6, t: 2.8 }, { f: 466.16, d: 0.5, t: 3.5 }
          ],
          duration: 8500
        },
        {
          id: 'hindi_wishes',
          file: 'audio/Tera-Happy-Birthday-Hindi-Wishes.mp3',
          name: "तेरा हैप्पी बर्थडे (Tera Happy Birthday Wishes)",
          sub: "Milestone Storybook & Love Letter • Eternal Love",
          melody: [
            { f: 261.63, d: 0.45, t: 0.0 }, { f: 329.63, d: 0.45, t: 0.5 }, { f: 392.00, d: 0.6, t: 1.0 },
            { f: 440.00, d: 0.8, t: 1.7 }, { f: 392.00, d: 0.5, t: 2.6 }, { f: 349.23, d: 0.5, t: 3.2 }
          ],
          duration: 9500
        },
        {
          id: 'hindi_song_1',
          file: 'audio/Birthday-Hindi-Song-1.mp3',
          name: "दिल से दुआ शायरी (Birthday Hindi Special 1)",
          sub: "Dil Ki Awaaz & Melodic Harmony • For Sneha",
          melody: [
            { f: 311.13, d: 0.5, t: 0.0 }, { f: 349.23, d: 0.5, t: 0.6 }, { f: 369.99, d: 0.6, t: 1.2 },
            { f: 415.30, d: 0.8, t: 1.9 }, { f: 466.16, d: 0.9, t: 2.8 }, { f: 523.25, d: 0.8, t: 3.8 }
          ],
          duration: 8800
        },
        {
          id: 'tere_bhai',
          file: 'audio/Tere-Bhai-Ka-Birthday-Hai.mp3',
          name: "बर्थडे पार्टी धूम (Tere Bhai Ka Birthday Hai)",
          sub: "Polaroid Gallery & Meme Arena • Masti Beats",
          melody: [
            { f: 261.63, d: 0.3, t: 0.0 }, { f: 293.66, d: 0.3, t: 0.35 }, { f: 329.63, d: 0.4, t: 0.7 },
            { f: 392.00, d: 0.4, t: 1.15 }, { f: 329.63, d: 0.4, t: 1.6 }, { f: 392.00, d: 0.4, t: 2.05 }
          ],
          duration: 7000
        }
      ];
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.userHasInteracted = true;
    }

    playNote(freq, type = 'triangle', duration = 0.9, delay = 0, gainLevel = 0.16) {
      if (this.isMuted || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      // Warm harmonic tone with gentle attack
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(gainLevel, this.ctx.currentTime + delay + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration + 0.12);
    }

    playChord(freqs, type = 'sine', duration = 2.4, gainLevel = 0.08) {
      freqs.forEach((f, idx) => {
        this.playNote(f, type, duration, idx * 0.04, gainLevel);
      });
    }

    playRealAudioFile(songId) {
      const track = this.tracks.find(t => t.id === songId) || this.tracks[0];
      const audioPath = track.file || `audio/${songId}.mp3`;

      // If already playing this exact track source, don't restart from beginning
      if (this.htmlAudio.src.endsWith(encodeURI(audioPath)) || this.htmlAudio.src.endsWith(audioPath)) {
        if (this.htmlAudio.paused) {
          this.htmlAudio.play().catch(() => {});
        }
        return;
      }

      this.htmlAudio.src = audioPath;
      this.htmlAudio.muted = this.isMuted;
      this.htmlAudio.currentTime = 0;
      this.htmlAudio.play().catch((err) => {
        console.log('Audio autoplay prevented or file loading:', err);
      });
    }

    startMusic(songId = null) {
      this.init();
      if (songId) {
        const idx = this.tracks.findIndex(t => t.id === songId);
        if (idx !== -1) {
          this.trackIndex = idx;
          this.activeSongId = songId;
        }
      } else {
        songId = this.tracks[this.trackIndex].id;
      }

      this.isPlaying = true;
      if (this.timerId) clearTimeout(this.timerId);

      const vinylDisc = document.getElementById('vinylDisc');
      const dockVisualizer = document.getElementById('dockVisualizer');
      const dockPlayIcon = document.getElementById('dockPlayIcon');

      if (vinylDisc) vinylDisc.classList.add('spinning');
      if (dockVisualizer) dockVisualizer.classList.add('active');
      if (dockPlayIcon) dockPlayIcon.setAttribute('data-lucide', 'pause');

      this.updateTrackDisplay();
      this.updateSectionBarsUI();

      // Play real downloaded MP3 track + light acoustic synth backing
      this.playRealAudioFile(songId);
      this.playMusicLoop();

      if (window.lucide) window.lucide.createIcons();
    }

    stopMusic() {
      this.isPlaying = false;
      if (this.timerId) clearTimeout(this.timerId);

      if (this.htmlAudio) {
        this.htmlAudio.pause();
      }

      const vinylDisc = document.getElementById('vinylDisc');
      const dockVisualizer = document.getElementById('dockVisualizer');
      const dockPlayIcon = document.getElementById('dockPlayIcon');

      if (vinylDisc) vinylDisc.classList.remove('spinning');
      if (dockVisualizer) dockVisualizer.classList.remove('active');
      if (dockPlayIcon) dockPlayIcon.setAttribute('data-lucide', 'play');

      this.updateSectionBarsUI();
      if (window.lucide) window.lucide.createIcons();
    }

    togglePlay(songId = null) {
      if (this.isPlaying) {
        if (songId && songId !== this.tracks[this.trackIndex].id) {
          this.startMusic(songId);
        } else {
          this.stopMusic();
        }
      } else {
        this.startMusic(songId || this.activeSongId);
      }
    }

    nextTrack() {
      this.trackIndex = (this.trackIndex + 1) % this.tracks.length;
      this.activeSongId = this.tracks[this.trackIndex].id;
      this.updateTrackDisplay();
      this.updateSectionBarsUI();
      if (this.isPlaying) {
        if (this.timerId) clearTimeout(this.timerId);
        this.playRealAudioFile(this.activeSongId);
        this.playMusicLoop();
      }
    }

    prevTrack() {
      this.trackIndex = (this.trackIndex - 1 + this.tracks.length) % this.tracks.length;
      this.activeSongId = this.tracks[this.trackIndex].id;
      this.updateTrackDisplay();
      this.updateSectionBarsUI();
      if (this.isPlaying) {
        if (this.timerId) clearTimeout(this.timerId);
        this.playRealAudioFile(this.activeSongId);
        this.playMusicLoop();
      }
    }

    updateTrackDisplay() {
      const track = this.tracks[this.trackIndex];
      const nameEl = document.getElementById('dockSongName');
      const subEl = document.getElementById('dockSongSub');
      if (nameEl) nameEl.textContent = track.name;
      if (subEl) subEl.textContent = track.sub;
    }

    updateSectionBarsUI() {
      const currentId = this.tracks[this.trackIndex].id;
      document.querySelectorAll('.section-hindi-song-bar').forEach(bar => {
        const barSongId = bar.getAttribute('data-song-id');
        const playBtn = bar.querySelector('.btn-play-hindi-song');
        const btnText = playBtn ? playBtn.querySelector('span') : null;
        const btnIcon = playBtn ? playBtn.querySelector('i') : null;

        if (this.isPlaying && barSongId === currentId) {
          bar.classList.add('playing');
          if (btnText) btnText.textContent = 'Pause Song';
          if (btnIcon) btnIcon.setAttribute('data-lucide', 'pause');
        } else {
          bar.classList.remove('playing');
          if (btnText) btnText.textContent = 'Play Song';
          if (btnIcon) btnIcon.setAttribute('data-lucide', 'play');
        }
      });

      // Update Envelope Song Pill
      const envPill = document.querySelector('.envelope-hindi-song-pill');
      if (envPill) {
        const pillState = envPill.querySelector('.pill-play-state');
        if (pillState) {
          pillState.innerHTML = this.isPlaying ? '<i data-lucide="pause"></i> Playing BGM' : '<i data-lucide="play"></i> Play BGM';
        }
      }

      if (window.lucide) window.lucide.createIcons();
    }

    playMusicLoop() {
      if (!this.isPlaying) return;

      const track = this.tracks[this.trackIndex];
      if (track && track.melody) {
        track.melody.forEach(n => {
          this.playNote(n.f, 'triangle', n.d, n.t, 0.14);
          this.playNote(n.f / 2, 'sine', n.d * 1.2, n.t, 0.06);
        });
        const loopTime = track.duration || 9000;
        this.timerId = setTimeout(() => this.playMusicLoop(), loopTime);
      }
    }

    playSfx(type) {
      this.init();
      if (this.isMuted) return;

      if (type === 'fanfare' || type === 'celebration') {
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
          this.playNote(freq, 'triangle', 0.7, i * 0.09, 0.18);
        });
      } else if (type === 'heart') {
        this.playChord([440, 554.37, 659.25], 'sine', 1.2, 0.1);
      } else if (type === 'slice') {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.28);
      } else if (type === 'boing') {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      } else if (type === 'laugh') {
        [320, 480, 620, 800, 620, 850].forEach((freq, i) => {
          this.playNote(freq, 'sine', 0.15, i * 0.08, 0.12);
        });
      } else if (type === 'cricket') {
        [1250, 1300, 1250, 1300].forEach((freq, i) => {
          this.playNote(freq, 'sawtooth', 0.05, i * 0.06, 0.04);
        });
      } else if (type === 'cheer') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          this.playNote(freq, 'triangle', 0.7, i * 0.1, 0.15);
        });
      } else if (type === 'stamp') {
        this.playChord([180, 220, 280], 'triangle', 0.8, 0.22);
      }
    }
  }

  const audio = new CosmicAudioEngine();

  // Music Dock Controls
  document.getElementById('dockPlayBtn').addEventListener('click', () => audio.togglePlay());
  document.getElementById('dockNextBtn').addEventListener('click', () => audio.nextTrack());
  document.getElementById('dockPrevBtn').addEventListener('click', () => audio.prevTrack());
  document.getElementById('dockMuteBtn').addEventListener('click', () => {
    audio.isMuted = !audio.isMuted;
    if (audio.htmlAudio) audio.htmlAudio.muted = audio.isMuted;
    const icon = document.getElementById('dockVolIcon');
    icon.setAttribute('data-lucide', audio.isMuted ? 'volume-x' : 'volume-2');
    if (window.lucide) window.lucide.createIcons();
  });

  // Section Play Button Click Handlers
  document.querySelectorAll('.btn-play-hindi-song').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentBar = btn.closest('.section-hindi-song-bar');
      if (parentBar) {
        const songId = parentBar.getAttribute('data-song-id');
        audio.togglePlay(songId);
      }
    });
  });

  // Entire section bar click to play
  document.querySelectorAll('.section-hindi-song-bar').forEach(bar => {
    bar.addEventListener('click', (e) => {
      if (e.target.closest('.btn-play-hindi-song')) return;
      const songId = bar.getAttribute('data-song-id');
      audio.togglePlay(songId);
    });
  });

  // Envelope Hindi Song Pill Click Handler
  const envPill = document.querySelector('.envelope-hindi-song-pill');
  if (envPill) {
    envPill.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.togglePlay('bday_wish');
    });
  }

  /* --------------------------------------------------------------------------
     SCROLL-BASED AUDIO CHANGER (Song changes smoothly when scrolling sections)
     -------------------------------------------------------------------------- */
  let lastScrolledSongId = null;
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const songBar = entry.target.querySelector('.section-hindi-song-bar');
          if (songBar) {
            const songId = songBar.getAttribute('data-song-id');
            if (songId && songId !== lastScrolledSongId) {
              lastScrolledSongId = songId;
              const trackIdx = audio.tracks.findIndex(t => t.id === songId);
              if (trackIdx !== -1) {
                audio.trackIndex = trackIdx;
                audio.activeSongId = songId;
                audio.updateTrackDisplay();
                audio.updateSectionBarsUI();

                // If user has unlocked envelope or music is running, switch to section's song immediately!
                if (audio.isPlaying || audio.userHasInteracted) {
                  audio.startMusic(songId);
                }
              }
            }
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-15% 0px -15% 0px',
      threshold: 0.25
    });

    document.querySelectorAll('section').forEach(sec => {
      sectionObserver.observe(sec);
    });
  }

  /* --------------------------------------------------------------------------
     4. LUXURY ENVELOPE OPENING & SLIDER INTERACTION (Exact User Design)
     -------------------------------------------------------------------------- */
  const envelopeOverlay = document.getElementById('envelopeHeroOverlay');
  const interactiveEnvelope = document.getElementById('interactiveEnvelope');
  const envWaxSeal = document.getElementById('envWaxSeal');
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderRoseThumb = document.getElementById('sliderRoseThumb');
  const btnEnterUniverse = document.getElementById('btnEnterUniverse');
  let isEnvelopeOpened = false;

  function triggerEnvelopeOpen() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    interactiveEnvelope.classList.add('opened');
    audio.playSfx('fanfare');

    // Confetti celebration
    if (window.confetti) {
      window.confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.45 },
        colors: ['#ff1a60', '#ffd700', '#ff80ab', '#ffffff']
      });
      setTimeout(() => {
        window.confetti({ particleCount: 80, angle: 60, spread: 80, origin: { x: 0.1 } });
        window.confetti({ particleCount: 80, angle: 120, spread: 80, origin: { x: 0.9 } });
      }, 400);
    }
  }

  function dismissEnvelopeAndEnter() {
    triggerEnvelopeOpen();
    setTimeout(() => {
      envelopeOverlay.classList.add('unveiled');
      document.body.classList.remove('locked-body');
      audio.startMusic('bday_wish');
      showToast('👑 Welcome to Sneha\'s Royal Birthday Wonderland! ❤️');
    }, 600);
  }

  // Click triggers
  if (envWaxSeal) envWaxSeal.addEventListener('click', triggerEnvelopeOpen);
  if (interactiveEnvelope) interactiveEnvelope.addEventListener('click', (e) => {
    if (e.target.closest('.btn-enter-universe')) return;
    triggerEnvelopeOpen();
  });
  if (btnEnterUniverse) btnEnterUniverse.addEventListener('click', dismissEnvelopeAndEnter);

  /* --------------------------------------------------------------------------
     5. 3D ROYAL CELESTIAL DIAMOND RING CHAMBER & SURPRISE BURST
     -------------------------------------------------------------------------- */
  const jewelryBoxContainer = document.getElementById('jewelryBoxContainer');
  const btnToggleRingBox = document.getElementById('btnToggleRingBox');
  const ringBoxBtnText = document.getElementById('ringBoxBtnText');
  const btnChamberSurprise = document.getElementById('btnChamberSurprise');
  let isRingBoxOpened = false;

  function toggleRingBox() {
    isRingBoxOpened = !isRingBoxOpened;
    if (jewelryBoxContainer) {
      jewelryBoxContainer.classList.toggle('opened', isRingBoxOpened);
    }
    if (ringBoxBtnText) {
      ringBoxBtnText.textContent = isRingBoxOpened ? '✨ Royal Ring Unlocked! (Sealed with Love)' : 'Tap to Open Royal Ring Box ✨';
    }

    if (isRingBoxOpened) {
      audio.playSfx('fanfare');
      if (window.confetti) {
        window.confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.4 },
          colors: ['#ffd700', '#ff1a60', '#ffffff', '#00f0ff']
        });
      }
      showToast('💍 Jatin\'s Engagement Ring Unlocked: Sneha, You are my Universe! ❤️');
    }
  }

  if (jewelryBoxContainer) jewelryBoxContainer.addEventListener('click', toggleRingBox);
  if (btnToggleRingBox) btnToggleRingBox.addEventListener('click', toggleRingBox);

  if (btnChamberSurprise) {
    btnChamberSurprise.addEventListener('click', () => {
      audio.playSfx('celebration');
      if (window.confetti) {
        const count = 200;
        const defaults = { origin: { y: 0.6 } };
        function fire(particleRatio, opts) {
          window.confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
        }
        fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ffd700', '#ffffff'] });
        fire(0.2, { spread: 60, colors: ['#ff1a60', '#ff80ab'] });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#00f0ff', '#ffd700'] });
      }
      showToast('🎉 Grand Royal Surprise Burst Unleashed for Queen Sneha! 👑💖');
    });
  }

  // DRAGGABLE ROSE SLIDER
  if (sliderTrack && sliderRoseThumb) {
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    function getTrackMax() {
      return sliderTrack.offsetWidth - sliderRoseThumb.offsetWidth - 12;
    }

    function onDragStart(clientX) {
      isDragging = true;
      startX = clientX - currentX;
    }

    function onDragMove(clientX) {
      if (!isDragging) return;
      const maxDrag = getTrackMax();
      currentX = Math.max(0, Math.min(clientX - startX, maxDrag));
      sliderRoseThumb.style.transform = `translateX(${currentX}px)`;

      // Progress check
      if (currentX / maxDrag > 0.75) {
        isDragging = false;
        sliderRoseThumb.style.transform = `translateX(${maxDrag}px)`;
        triggerEnvelopeOpen();
      }
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      const maxDrag = getTrackMax();
      if (currentX / maxDrag <= 0.75) {
        currentX = 0;
        sliderRoseThumb.style.transform = `translateX(0px)`;
      }
    }

    sliderRoseThumb.addEventListener('mousedown', (e) => onDragStart(e.clientX));
    window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
    window.addEventListener('mouseup', onDragEnd);

    sliderRoseThumb.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        onDragMove(e.touches[0].clientX);
      }
    }, { passive: true });
    window.addEventListener('touchend', onDragEnd);
  }

  // SCROLL-WHEEL & TOUCH SWIPE TO OPEN
  window.addEventListener('wheel', (e) => {
    if (!envelopeOverlay.classList.contains('unveiled') && e.deltaY > 15) {
      triggerEnvelopeOpen();
    }
  }, { passive: true });


  /* --------------------------------------------------------------------------
     5. 3D HOLOGRAPHIC FOIL PARALLAX TILT
     -------------------------------------------------------------------------- */
  const holoCard = document.getElementById('holoCard');
  if (holoCard) {
    holoCard.addEventListener('mousemove', (e) => {
      const rect = holoCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -16;
      const rotateY = ((x - centerX) / centerX) * 16;

      holoCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      const sheen = holoCard.querySelector('.holo-foil-sheen');
      if (sheen) {
        sheen.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
      }
    });

    holoCard.addEventListener('mouseleave', () => {
      holoCard.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
    });
  }

  /* --------------------------------------------------------------------------
     6. BIOMETRIC FINGERPRINT SCANNER & EKG MONITOR
     -------------------------------------------------------------------------- */
  const fingerprintSensor = document.getElementById('fingerprintSensor');
  const scannerStatus = document.getElementById('scannerStatus');
  const ekgCanvas = document.getElementById('ekgCanvas');
  const ekgCtx = ekgCanvas.getContext('2d');
  let isScanning = false;
  let ekgPoints = [];
  let ekgOffset = 0;

  function drawEKG() {
    ekgCtx.clearRect(0, 0, ekgCanvas.width, ekgCanvas.height);
    ekgCtx.strokeStyle = isScanning ? '#00f0ff' : '#ff1a60';
    ekgCtx.lineWidth = 2.5;
    ekgCtx.shadowBlur = 8;
    ekgCtx.shadowColor = isScanning ? '#00f0ff' : '#ff1a60';

    ekgCtx.beginPath();
    const midY = ekgCanvas.height / 2;
    for (let x = 0; x < ekgCanvas.width; x++) {
      let y = midY;
      const pos = (x + ekgOffset) % 120;
      if (pos > 40 && pos < 50) {
        y = midY - (isScanning ? 28 : 14);
      } else if (pos >= 50 && pos < 60) {
        y = midY + (isScanning ? 24 : 12);
      } else if (pos >= 60 && pos < 70) {
        y = midY - (isScanning ? 12 : 6);
      }
      if (x === 0) ekgCtx.moveTo(x, y);
      else ekgCtx.lineTo(x, y);
    }
    ekgCtx.stroke();
    ekgOffset += isScanning ? 4 : 2;
    requestAnimationFrame(drawEKG);
  }
  drawEKG();

  function startScan() {
    isScanning = true;
    fingerprintSensor.classList.add('scanning');
    scannerStatus.textContent = "⚡ SCANNING SOUL FREQUENCY & HEARTBEAT...";
    document.getElementById('ekgBpm').textContent = "175 BPM (In Love)";
    audio.playSfx('heart');

    setTimeout(() => {
      if (isScanning) {
        scannerStatus.textContent = "✅ 1000% ETERNAL SOULMATE VERIFIED WITH JATIN 💍";
        audio.playSfx('celebration');
        if (window.confetti) {
          window.confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
        }
        showToast('💖 Biometric Scan: Sneha & Jatin are Made for Each Other! ✨');
      }
    }, 2000);
  }

  function stopScan() {
    isScanning = false;
    fingerprintSensor.classList.remove('scanning');
    document.getElementById('ekgBpm').textContent = "140 BPM";
  }

  fingerprintSensor.addEventListener('mousedown', startScan);
  fingerprintSensor.addEventListener('mouseup', stopScan);
  fingerprintSensor.addEventListener('touchstart', startScan, { passive: true });
  fingerprintSensor.addEventListener('touchend', stopScan);

  /* --------------------------------------------------------------------------
     7. 3D FLIP POLAROID GALLERY WITH SECRET HANDWRITTEN NOTES
     -------------------------------------------------------------------------- */
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
      audio.playSfx('heart');
    });
  });

  /* --------------------------------------------------------------------------
     8. MEME ARENA ENGINE (JATIN VS SNEHA)
     -------------------------------------------------------------------------- */
  const memeList = [
    {
      scenario: "Sneha: 'Main bilkul ready hoon, bas 5 minute lagenge!'",
      punchline: "Reality: 45 minutes later, Jatin is still waiting in the car growing a full philosopher beard 😂⏳",
      tip: "Fiancé Rule #10: '5 minutes' is a conceptual illusion that ignores modern physics.",
      emoji: "⏳"
    },
    {
      scenario: "Sneha: 'Kuch bhi mangwa lo, main sab kha lungi.'",
      punchline: "Jatin suggests Pizza ❌, Momos ❌, Biryani ❌, Burgers ❌... Sneha: 'Tumhe pata hi nahi mera kya khane ka mann hai!' 😭🍕",
      tip: "Fiancé Survival Tip: Keep emergency chocolates in the car glove compartment at all times.",
      emoji: "🍕"
    },
    {
      scenario: "Jatin taking Sneha's birthday photos:",
      punchline: "Jatin takes 342 photos from 18 different ninja angles. Sneha inspects: 'Ek bhi achhi nahi aayi!' 📸💀",
      tip: "Course Required: Master's Degree in Aesthetic Fiancée Photography & Golden Hour Lighting.",
      emoji: "📸"
    },
    {
      scenario: "When Sneha is mad but won't say why:",
      punchline: "Sneha: 'Main gussa nahi hoon.' Jatin: *Heart rate exceeds 180 BPM, mentally analyzing every sentence spoken since 2024* 💀😱",
      tip: "Instant Remedy: Give an immediate hug, compliment her outfit, and order waffles.",
      emoji: "🍫"
    },
    {
      scenario: "Engagement Done! Sneha's new official decree:",
      punchline: "Sneha: 'Now Jatin is officially obligated to carry all shopping bags and listen to all daily gossip forever!' 🛍️💍",
      tip: "Jatin: And I happily accept the lifelong contract with the biggest smile! ❤️",
      emoji: "💍"
    }
  ];

  let activeMemeIdx = 0;
  const mScenario = document.getElementById('mScenario');
  const mPunchline = document.getElementById('mPunchline');
  const mTip = document.getElementById('mTip');
  const memeBadge = document.getElementById('memeBadge');
  const memeEmoji = document.getElementById('memeEmoji');

  function updateMeme(idx) {
    const item = memeList[idx];
    mScenario.textContent = item.scenario;
    mPunchline.textContent = item.punchline;
    mTip.textContent = item.tip;
    memeBadge.textContent = `Meme #${idx + 1} of ${memeList.length}`;
    memeEmoji.textContent = item.emoji;
  }

  document.getElementById('nextMemeBtn').addEventListener('click', () => {
    activeMemeIdx = (activeMemeIdx + 1) % memeList.length;
    updateMeme(activeMemeIdx);
    audio.playSfx('boing');
  });

  document.getElementById('prevMemeBtn').addEventListener('click', () => {
    activeMemeIdx = (activeMemeIdx - 1 + memeList.length) % memeList.length;
    updateMeme(activeMemeIdx);
    audio.playSfx('boing');
  });

  // Sound FX buttons in Meme zone
  document.querySelectorAll('.sfx-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sfx = btn.getAttribute('data-sfx');
      audio.playSfx(sfx);
    });
  });

  // Melodic Snippet Buttons in Shayari Section
  document.querySelectorAll('.sh-melody-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playSfx('celebration');
      showToast('🎶 Playing Romantic Chords for Sneha...');
    });
  });

  // Copy Shayari
  document.querySelectorAll('.sh-copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.shayari-holo-card');
      const text = card.querySelector('.sh-urdu-verse').innerText;
      navigator.clipboard.writeText(text).then(() => {
        showToast('💌 Shayari copied to clipboard with love!');
        audio.playSfx('heart');
      });
    });
  });

  // Instant Quote Forge
  const quotes = [
    "तेरी मुस्कुराहट से शुरू होती है मेरी हर सुबह, तेरे नाम से ही पूरी होती है मेरी हर दुआ... ❤️",
    "चाँद भी फीका लगता है तेरी मुस्कान के आगे, ये दिल हर बार झुक जाता है तेरे प्यार के आगे... 🎂✨",
    "मेरी जिंदगी का सबसे हसीन फैसला तू है, मेरे हर ख्वाब का सबसे खूबसूरत सच तू है... 💍",
    "लोग कहते हैं किस्मत रब लिखता है, पर मुझे लगता है मेरी किस्मत में तुझे लिखकर रब ने अपनी सबसे खूबसूरत कला दिखाई है! 🌹"
  ];
  let quoteIdx = 0;
  document.getElementById('genNewQuoteBtn').addEventListener('click', () => {
    quoteIdx = (quoteIdx + 1) % quotes.length;
    document.getElementById('genQuoteText').textContent = `"${quotes[quoteIdx]}"`;
    audio.playSfx('heart');
  });

  /* --------------------------------------------------------------------------
     9. FIANCÉE CONTRACT SIGNATURE CANVAS & STAMP
     -------------------------------------------------------------------------- */
  const sigCanvas = document.getElementById('sigCanvas');
  const sigCtx = sigCanvas.getContext('2d');
  let isDrawingSig = false;

  sigCtx.lineWidth = 2.8;
  sigCtx.lineCap = 'round';
  sigCtx.strokeStyle = '#ff1a60';

  function getSigCoords(e) {
    const rect = sigCanvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  }

  function startSig(e) {
    isDrawingSig = true;
    const { x, y } = getSigCoords(e);
    sigCtx.beginPath();
    sigCtx.moveTo(x, y);
  }

  function drawSig(e) {
    if (!isDrawingSig) return;
    e.preventDefault();
    const { x, y } = getSigCoords(e);
    sigCtx.lineTo(x, y);
    sigCtx.stroke();
  }

  function stopSig() {
    isDrawingSig = false;
  }

  sigCanvas.addEventListener('mousedown', startSig);
  sigCanvas.addEventListener('mousemove', drawSig);
  sigCanvas.addEventListener('mouseup', stopSig);
  sigCanvas.addEventListener('mouseleave', stopSig);

  sigCanvas.addEventListener('touchstart', startSig, { passive: false });
  sigCanvas.addEventListener('touchmove', drawSig, { passive: false });
  sigCanvas.addEventListener('touchend', stopSig);

  document.getElementById('clearSigBtn').addEventListener('click', () => {
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  });

  document.getElementById('sealContractBtn').addEventListener('click', () => {
    const stamp = document.getElementById('contractStamp');
    stamp.style.transform = 'scale(1.3) rotate(16deg)';
    audio.playSfx('stamp');

    if (window.confetti) {
      window.confetti({
        particleCount: 130,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff1a60', '#ffffff']
      });
    }

    setTimeout(() => {
      stamp.style.transform = 'scale(1) rotate(12deg)';
      showToast('💍 The Royal Fiancée Contract is Officially Sealed for Eternity! ❤️');
    }, 350);
  });

  /* --------------------------------------------------------------------------
     10. 3D VIRTUAL BIRTHDAY CAKE CUTTING & GOLDEN KNIFE CEREMONY
     -------------------------------------------------------------------------- */
  const blowCandlesBtn = document.getElementById('blowCandlesBtn');
  const sliceCakeBtn = document.getElementById('sliceCakeBtn');
  const feedBiteBtn = document.getElementById('feedBiteBtn');
  const royalCakeKnife = document.getElementById('royalCakeKnife');
  const cakeInteractiveStage = document.getElementById('cakeInteractiveStage');
  const cakeStatusPill = document.getElementById('cakeStatusPill');
  let areCandlesLit = true;
  let isCakeSliced = false;

  // 1. Blow Out Candles
  if (blowCandlesBtn) {
    blowCandlesBtn.addEventListener('click', () => {
      if (!areCandlesLit) return;
      areCandlesLit = false;
      document.querySelectorAll('.cake-candle').forEach(c => c.setAttribute('data-lit', 'false'));
      blowCandlesBtn.classList.add('disabled');
      blowCandlesBtn.setAttribute('disabled', 'true');
      
      if (sliceCakeBtn) {
        sliceCakeBtn.classList.remove('disabled');
        sliceCakeBtn.removeAttribute('disabled');
      }

      if (cakeStatusPill) {
        cakeStatusPill.textContent = '🎉 Candles are blown out! Now tap the Golden Knife or "Slice Birthday Cake" 🍰';
      }
      audio.playSfx('celebration');

      if (window.confetti) {
        window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
      showToast('🎂 Candles blown out! Sneha\'s secret wish has flown to the stars! ✨');
    });
  }

  // 2. Perform 3D Knife Slice Action
  function performCakeSlice() {
    if (isCakeSliced) return;
    isCakeSliced = true;

    // Animate Golden Knife
    if (royalCakeKnife) {
      royalCakeKnife.classList.add('animating-slice');
    }
    audio.playSfx('slice');

    setTimeout(() => {
      if (cakeInteractiveStage) {
        cakeInteractiveStage.classList.add('cake-sliced');
      }
      audio.playSfx('celebration');
      audio.startMusic('bday_wish');

      if (sliceCakeBtn) {
        sliceCakeBtn.classList.add('disabled');
        sliceCakeBtn.setAttribute('disabled', 'true');
      }

      if (feedBiteBtn) {
        feedBiteBtn.classList.remove('disabled');
        feedBiteBtn.removeAttribute('disabled');
      }

      if (cakeStatusPill) {
        cakeStatusPill.textContent = '🍰 Sliced! Queen Sneha\'s first bite is served on the gold plate! Tap "Feed Virtual Bite" 🍓';
      }

      // Grand Multi-stage fireworks & confetti
      if (window.confetti) {
        window.confetti({
          particleCount: 220,
          spread: 140,
          origin: { y: 0.55 },
          colors: ['#ff007f', '#ffd700', '#ffffff', '#00f0ff', '#ff80ab']
        });
        setTimeout(() => {
          window.confetti({ particleCount: 100, angle: 60, spread: 90, origin: { x: 0.15 } });
          window.confetti({ particleCount: 100, angle: 120, spread: 90, origin: { x: 0.85 } });
        }, 300);
      }

      showToast('🍰 Happy Birthday Sneha! Royal cake sliced & celebrating with full music! 🎉');
    }, 450);
  }

  if (sliceCakeBtn) sliceCakeBtn.addEventListener('click', performCakeSlice);
  if (royalCakeKnife) royalCakeKnife.addEventListener('click', () => {
    if (areCandlesLit && blowCandlesBtn) {
      blowCandlesBtn.click();
      setTimeout(performCakeSlice, 500);
    } else {
      performCakeSlice();
    }
  });

  // 3. Feed Virtual Bite to Sneha
  if (feedBiteBtn) {
    feedBiteBtn.addEventListener('click', () => {
      audio.playSfx('heart');
      if (window.confetti) {
        window.confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ff1a60', '#ff80ab', '#ffd700']
        });
      }
      if (cakeStatusPill) {
        cakeStatusPill.textContent = '💖 Delicious! Sneha & Jatin, together forever & ever! 🍓👑';
      }
      showToast('🍓 Om nom nom! Jatin feeds Sneha the sweetest birthday bite! Happy Birthday Queen! ❤️');
    });
  }

  // Save Secret Birthday Wish
  document.getElementById('saveWishBtn').addEventListener('click', () => {
    const input = document.getElementById('wishInput');
    if (input.value.trim().length > 0) {
      document.getElementById('wishFeedback').classList.remove('hidden');
      audio.playSfx('heart');
      if (window.confetti) {
        window.confetti({ particleCount: 60, spread: 70 });
      }
      showToast('💌 Wish safely locked in Jatin\'s heart for eternity! ❤️');
      input.value = '';
    }
  });

  /* --------------------------------------------------------------------------
     11. 100 REASONS WHY JATIN LOVES SNEHA
     -------------------------------------------------------------------------- */
  const reasonsList = [
    "Because your smile in that green dress lights up my entire existence like a thousand Diwali lamps.",
    "Because of the sweet way you get angry and then immediately start laughing.",
    "Because talking to you makes the most exhausting day turn into pure happiness.",
    "Because you are not just my future wife, but my best friend and my biggest blessing.",
    "Because you make me want to be the best version of myself every single day.",
    "Because your kindness, compassion, and innocence are rarer than diamonds.",
    "Because the way our hands fit together feels like they were crafted by destiny.",
    "Because seeing your name light up on my phone screen still gives me butterflies.",
    "Because I know our future together is going to be the most beautiful adventure."
  ];

  let currentReason = 0;
  document.getElementById('nextReasonOrb').addEventListener('click', () => {
    currentReason = (currentReason + 1) % reasonsList.length;
    document.getElementById('reasonBadge').textContent = `Reason #${currentReason + 1}`;
    document.getElementById('reasonMainQuote').textContent = `"${reasonsList[currentReason]}"`;
    audio.playSfx('heart');
    if (window.confetti) {
      window.confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    }
  });

  /* --------------------------------------------------------------------------
     12. METEOR & FIREWORKS HYPERDRIVE ACTIONS
     -------------------------------------------------------------------------- */
  function triggerLoveShower() {
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff1a60', '#ff80ab', '#ffd700', '#ffffff']
      });
    }
    audio.playSfx('heart');
    showToast('🌹 Showering infinite rose petals & stars on Queen Sneha! ❤️');
  }

  document.getElementById('meteorShowerBtn').addEventListener('click', triggerLoveShower);
  document.getElementById('heroBurstLoveBtn').addEventListener('click', triggerLoveShower);

  document.getElementById('fireworksLauncherBtn').addEventListener('click', () => {
    if (window.confetti) {
      // Multi-stage fireworks
      const end = Date.now() + 2000;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        window.confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2
          },
          colors: ['#ff0055', '#ffd700', '#00f0ff', '#ffffff', '#ff80ab']
        });
      }, 250);
    }
    audio.playSfx('celebration');
    showToast('🎆 Happy Birthday Fireworks exploding for Sneha across the galaxy! ✨');
  });

  /* --------------------------------------------------------------------------
     13. LIVE BIRTHDAY COUNTDOWN (5th October 2026)
     -------------------------------------------------------------------------- */
  function updateCountdown() {
    const targetDate = new Date('2026-10-05T00:00:00+05:30').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      document.getElementById('countdownHeadline').textContent = "🎉 IT'S SNEHA'S BIRTHDAY TODAY! HAPPY BIRTHDAY QUEEN! 👑";
      document.getElementById('cdDays').textContent = "00";
      document.getElementById('cdHours').textContent = "00";
      document.getElementById('cdMins').textContent = "00";
      document.getElementById('cdSecs').textContent = "00";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(seconds).padStart(2, '0');
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* --------------------------------------------------------------------------
     14. GSAP SCROLLTRIGGER REVEAL ANIMATIONS
     -------------------------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.glass-panel:not(.story-orbit-card)').forEach(panel => {
      gsap.from(panel, {
        scrollTrigger: {
          trigger: panel,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.story-orbit-card').forEach((card, idx) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: idx * 0.1,
        ease: 'power2.out'
      });
    });
  }

  /* --------------------------------------------------------------------------
     15. SCROLL-DRIVEN BOY & GIRL WALKING & GRAND ROMANTIC HUG ENGINE
     -------------------------------------------------------------------------- */
  const scrollHugSection = document.getElementById('scrollHugSection');
  const hugArena = document.getElementById('hugArena');
  const boyWalker = document.getElementById('boyWalker');
  const girlWalker = document.getElementById('girlWalker');
  const hugDistVal = document.getElementById('hugDistVal');
  const hugStatusBadge = document.getElementById('hugStatusBadge');
  const hugProgressSlider = document.getElementById('hugProgressSlider');
  const btnTriggerHugBurst = document.getElementById('btnTriggerHugBurst');
  const btnResetHug = document.getElementById('btnResetHug');

  let hasHugCelebrated = false;

  function updateHugState(progress) {
    progress = Math.min(Math.max(progress, 0), 1);

    if (hugProgressSlider && document.activeElement !== hugProgressSlider) {
      hugProgressSlider.value = Math.round(progress * 100);
    }

    // Distance calculation (1000m down to 0m)
    const distanceMeters = Math.max(0, Math.round(1000 - progress * 1000));
    if (hugDistVal) {
      hugDistVal.textContent = `${distanceMeters}m`;
    }

    const arenaWidth = hugArena ? hugArena.offsetWidth : 800;
    const maxWalkX = Math.min(arenaWidth * 0.36, 250);

    const boyX = progress * maxWalkX;
    const girlX = -progress * maxWalkX;

    if (boyWalker) boyWalker.style.transform = `translateX(${boyX}px)`;
    if (girlWalker) girlWalker.style.transform = `translateX(${girlX}px)`;

    if (progress >= 0.92) {
      if (hugArena && !hugArena.classList.contains('hugged')) {
        hugArena.classList.add('hugged');
        if (hugStatusBadge) {
          hugStatusBadge.textContent = '💖 United in Warm Hug! 💍';
          hugStatusBadge.style.background = 'linear-gradient(135deg, #ffd700 0%, #ff1a60 100%)';
        }

        if (!hasHugCelebrated) {
          hasHugCelebrated = true;
          audio.playSfx('fanfare');
          if (window.confetti) {
            window.confetti({
              particleCount: 160,
              spread: 120,
              origin: { y: 0.55 },
              colors: ['#ff1a60', '#ffd700', '#ffffff', '#00f0ff', '#ff80ab']
            });
            setTimeout(() => {
              window.confetti({ particleCount: 90, angle: 60, spread: 80, origin: { x: 0.1 } });
              window.confetti({ particleCount: 90, angle: 120, spread: 80, origin: { x: 0.9 } });
            }, 300);
          }
          showToast('💖 Jatin & Sneha united in a forever warm hug! Two souls bound for eternity! ❤️');
        }
      }
    } else {
      if (hugArena && hugArena.classList.contains('hugged')) {
        hugArena.classList.remove('hugged');
        hasHugCelebrated = false;
        if (hugStatusBadge) {
          hugStatusBadge.textContent = '🚶 Walking Closer...';
          hugStatusBadge.style.background = 'var(--pink-gradient)';
        }
      }
    }
  }

  // Scroll listener for the hug section
  window.addEventListener('scroll', () => {
    if (!scrollHugSection) return;
    const rect = scrollHugSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const currentPos = windowHeight - rect.top;
    const rawProgress = (currentPos - windowHeight * 0.25) / (rect.height * 0.85);

    if (rawProgress >= 0 && rawProgress <= 1.25) {
      updateHugState(rawProgress);
    }
  });

  // Slider input
  if (hugProgressSlider) {
    hugProgressSlider.addEventListener('input', (e) => {
      const p = parseFloat(e.target.value) / 100;
      updateHugState(p);
    });
  }

  // Action Buttons
  if (btnTriggerHugBurst) {
    btnTriggerHugBurst.addEventListener('click', () => {
      hasHugCelebrated = false;
      updateHugState(1.0);
    });
  }

  if (btnResetHug) {
    btnResetHug.addEventListener('click', () => {
      hasHugCelebrated = false;
      updateHugState(0);
      showToast('🚶 Distance reset! Scroll or drag slider to walk again! ❤️');
    });
  }

  /* --------------------------------------------------------------------------
     16. CONTINUOUS FLOATING HEARTS & TAP BURST ENGINE
     -------------------------------------------------------------------------- */
  const heartsLayer = document.getElementById('floatingHeartsLayer');
  const heartEmojis = ['💖', '💕', '💗', '💓', '💘', '🌹', '✨'];

  function spawnFloatingHeart() {
    if (!heartsLayer) return;
    const heart = document.createElement('div');
    heart.className = 'heart-rise-particle';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = `${Math.random() * 95}vw`;
    heart.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`;
    heart.style.animationDuration = `${Math.random() * 5 + 6}s`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
    heartsLayer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 11000);
  }

  // Spawn hearts continuously
  setInterval(spawnFloatingHeart, 600);
  for (let i = 0; i < 10; i++) {
    setTimeout(spawnFloatingHeart, i * 200);
  }

  // Click / Tap anywhere to spawn floating mini hearts
  window.addEventListener('click', (e) => {
    if (e.target.closest('button, input, a, .interactive-envelope, .flip-card')) return;
    for (let i = 0; i < 3; i++) {
      const burstHeart = document.createElement('div');
      burstHeart.className = 'heart-rise-particle';
      burstHeart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      burstHeart.style.left = `${e.clientX + (Math.random() - 0.5) * 40}px`;
      burstHeart.style.bottom = `${window.innerHeight - e.clientY}px`;
      burstHeart.style.fontSize = '1.8rem';
      burstHeart.style.animationDuration = '3.5s';
      if (heartsLayer) heartsLayer.appendChild(burstHeart);
      setTimeout(() => burstHeart.remove(), 3500);
    }
  });

  // Interactive White Cartoon Couple Stickers Click Handlers (Exact User Request)
  const titanicSticker = document.querySelector('.titanic-pose-sticker');
  const ringSticker = document.querySelector('.ring-propose-sticker');
  const bdaySticker = document.querySelector('.birthday-hug-sticker');

  if (titanicSticker) {
    titanicSticker.addEventListener('click', () => {
      audio.playSfx('heart');
      if (window.confetti) {
        window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
      }
      showToast('🚢 Jatin & Sneha: Our love story is bigger than Titanic! ❤️');
    });
  }

  if (ringSticker) {
    ringSticker.addEventListener('click', () => {
      audio.playSfx('celebration');
      if (window.confetti) {
        window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
      showToast('💍 Sneha & Jatin: Families Blessed! Counting down to 4th January 2027! 💖');
    });
  }

  if (bdaySticker) {
    bdaySticker.addEventListener('click', () => {
      audio.playSfx('celebration');
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
      }
      showToast('🎂 Happy Birthday My Queen Sneha • 5th October 2026! 🎉');
    });
  }

  /* --------------------------------------------------------------------------
     18. SNEHA BIRTHDAY VIDEO AUTOPLAY & WISHING EFFECTS CONTROLLER
     -------------------------------------------------------------------------- */
  const snehaVideo = document.getElementById('snehaBirthdayVideo');
  const btnToggleVideoSound = document.getElementById('btnToggleVideoSound');
  const btnToggleVideoPlay = document.getElementById('btnToggleVideoPlay');
  const btnBurstVideoWish = document.getElementById('btnBurstVideoWish');
  const videoVolIcon = document.getElementById('videoVolIcon');
  const videoPlayIcon = document.getElementById('videoPlayIcon');

  if (snehaVideo) {
    // Ensure video attempts autoplay smoothly
    snehaVideo.play().catch(e => console.log('Autoplay waiting for interaction:', e));

    if (btnToggleVideoSound) {
      btnToggleVideoSound.addEventListener('click', () => {
        snehaVideo.muted = !snehaVideo.muted;
        const btnText = btnToggleVideoSound.querySelector('span');
        if (snehaVideo.muted) {
          if (videoVolIcon) videoVolIcon.setAttribute('data-lucide', 'volume-x');
          if (btnText) btnText.textContent = 'Unmute Video';
        } else {
          if (videoVolIcon) videoVolIcon.setAttribute('data-lucide', 'volume-2');
          if (btnText) btnText.textContent = 'Mute Video';
        }
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (btnToggleVideoPlay) {
      btnToggleVideoPlay.addEventListener('click', () => {
        const btnText = btnToggleVideoPlay.querySelector('span');
        if (snehaVideo.paused) {
          snehaVideo.play();
          if (videoPlayIcon) videoPlayIcon.setAttribute('data-lucide', 'pause');
          if (btnText) btnText.textContent = 'Pause';
        } else {
          snehaVideo.pause();
          if (videoPlayIcon) videoPlayIcon.setAttribute('data-lucide', 'play');
          if (btnText) btnText.textContent = 'Play';
        }
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (btnBurstVideoWish) {
      btnBurstVideoWish.addEventListener('click', () => {
        audio.playSfx('celebration');
        if (window.confetti) {
          window.confetti({
            particleCount: 140,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ff1a60', '#ffd700', '#ffffff', '#00f0ff', '#ff80ab']
          });
          setTimeout(() => {
            window.confetti({ particleCount: 70, angle: 60, spread: 80, origin: { x: 0.2 } });
            window.confetti({ particleCount: 70, angle: 120, spread: 80, origin: { x: 0.8 } });
          }, 250);
        }
        showToast('✨ Happy Birthday Sneha! Sending sparkling video wishes & hugs! 🎬💖');
      });
    }
  }

  /* --------------------------------------------------------------------------
     15. TOAST NOTIFICATION HELPER
     -------------------------------------------------------------------------- */

  function showToast(msg) {
    const toast = document.getElementById('cosmicToast');
    const msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  }
});

