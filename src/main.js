// Resalta en el menú la sección que el usuario está viendo (scrollspy).
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = Array.from(document.querySelectorAll('.brandnav .nav-link'));
  if (!navLinks.length) return;

  const targets = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  targets.forEach((section) => observer.observe(section));
});

// ============================================================
// MEJORA 5: Cartuchos coleccionables con contador persistente
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.cart');
  const counter = document.getElementById('collectCount');
  const STORAGE_KEY = 'retrofun-collected';

  let collected = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

  function updateCounter() {
    if (counter) counter.textContent = `${collected.size}/${cards.length}`;
  }

  cards.forEach((card, index) => {
    const id = card.dataset.cartId || `cart-${index}`;
    card.dataset.cartId = id;
    if (collected.has(id)) card.classList.add('collected');

    card.addEventListener('click', () => {
      card.classList.add('is-in');
      setTimeout(() => card.classList.remove('is-in'), 220);

      if (!collected.has(id)) {
        collected.add(id);
        card.classList.add('collected');
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...collected]));
        updateCounter();

        if (collected.size === cards.length) {
          window.dispatchEvent(new CustomEvent('konami:unlocked')); // reutiliza el toast de logro
        }
      }
    });
  });

  updateCounter();
});

// Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
(() => {
  const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let progress = 0;

  const gemColors = ['--red','--yellow','--blue','--green','--cyan','--magenta'];

  function spawnGemRain() {
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const gem = document.createElement('div');
        gem.className = 'gem-fall';
        const color = gemColors[Math.floor(Math.random() * gemColors.length)];
        gem.style.left = Math.random() * 100 + 'vw';
        gem.style.background = `var(${color})`;
        gem.style.animationDuration = (2 + Math.random() * 1.2) + 's';
        document.body.appendChild(gem);
        setTimeout(() => gem.remove(), 4000);
      }, i * 45);
    }
  }

  function showToast() {
    const toast = document.createElement('div');
    toast.className = 'konami-toast';
    toast.innerHTML = '¡LOGRO DESBLOQUEADO!<small>Encontraste el código secreto — +50000 pts</small>';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 2600);
  }

  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    progress = key === sequence[progress] ? progress + 1 : (key === sequence[0] ? 1 : 0);
    if (progress === sequence.length) {
      progress = 0;
      spawnGemRain();
      showToast();
    }
  });
  if (progress === sequence.length) {
  progress = 0;
  spawnGemRain();
  showToast();
  window.dispatchEvent(new CustomEvent('konami:unlocked')); // ← agrega esta línea
}
})();

// ============================================================
// MEJORA 1: Laser shots fieles al arcade original
// Un solo disparo en pantalla a la vez (igual que el cañón del
// jugador en Space Invaders: no puedes disparar de nuevo hasta
// que el tiro anterior desaparece), trayectoria recta hacia arriba.
// Reemplaza el bloque original de "document.addEventListener('click', ...)"
// ============================================================
(() => {
  let activeLaser = null;

  document.addEventListener('click', (e) => {
    if (activeLaser) return; // en el juego original no hay disparo múltiple

    const laser = document.createElement('div');
    laser.className = 'laser-shot';
    laser.style.left = `${e.clientX}px`;
    laser.style.top = `${e.clientY}px`;

    document.body.appendChild(laser);
    activeLaser = laser;

    setTimeout(() => {
      laser.remove();
      activeLaser = null;
    }, 500);
  });
})();

// ============================================================
// MEJORA 2: Patrullaje de fantasmas con variación orgánica
// Reemplaza el bloque original "MOTOR DE PATRULLAJE OPTIMIZADO"
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  let idleTimer;
  let isRunning = false;
  const idleMin = 2500;
  const idleMax = 6000; // el cooldown ya no es fijo, se siente menos robótico
  const ghostTypes = ['blinky', 'pinky', 'inky', 'clyde'];
  const squad = [];

  ghostTypes.forEach((type, index) => {
    const ghost = document.createElement('div');
    ghost.className = `pacman-ghost-idle ${type}`;
    document.body.appendChild(ghost);
    squad.push({
      element: ghost,
      baseSpacing: index * 120,
      bobOffset: Math.random() * Math.PI * 2, // desfase para el bobbing
    });
  });

  function triggerGhostPatrol() {
    if (isRunning) return;
    isRunning = true;

    const reverse = Math.random() < 0.5; // a veces vienen de derecha a izquierda
    const speedFactor = 0.85 + Math.random() * 0.4; // 0.85x - 1.25x velocidad
    const duration = 5500 / speedFactor;
    const spacingJitter = 20;

    squad.forEach((item) => {
      item.jitter = (Math.random() - 0.5) * spacingJitter;
      item.element.classList.add('active');
      item.element.style.setProperty('--ghost-flip', reverse ? '-1' : '1');
    });

    const startTime = performance.now();
    const travel = window.innerWidth + 500;

    function animateSquad(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const leadPos = reverse
        ? window.innerWidth + 140 - progress * travel
        : -140 + progress * travel;

      squad.forEach((item) => {
        const spacing = item.baseSpacing + item.jitter;
        const posX = reverse ? leadPos + spacing : leadPos - spacing;
        const bob = Math.sin(progress * Math.PI * 6 + item.bobOffset) * 6;

        item.element.style.left = `${posX}px`;
        item.element.style.setProperty('--ghost-bob', `${bob.toFixed(2)}px`);
      });

      if (progress < 1) {
        requestAnimationFrame(animateSquad);
      } else {
        squad.forEach((item) => item.element.classList.remove('active'));
        isRunning = false;
      }
    }

    requestAnimationFrame(animateSquad);
  }

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    const nextDelay = idleMin + Math.random() * (idleMax - idleMin);
    idleTimer = setTimeout(triggerGhostPatrol, nextDelay);
  }

  window.addEventListener('mousemove', resetIdleTimer);
  window.addEventListener('keydown', resetIdleTimer);
  window.addEventListener('scroll', resetIdleTimer);

  resetIdleTimer();
});

// Vigía de barriles: pistas rotativas del Konami Code + reacción al lograrlo
document.addEventListener('DOMContentLoaded', () => {
  const bubble = document.getElementById('heroBubble');
  const hero = document.getElementById('barrelHero');
  if (!bubble || !hero) return;

  const pistas = [
    '¿Conoces algún código secreto?',
    'Dicen que empieza con las flechas...',
    '↑ ↑ ↓ ↓',
    '← → ← →',
    'Termina con B y A',
    '¡Pruébalo en tu teclado!',
  ];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % pistas.length;
    bubble.style.opacity = 0;
    setTimeout(() => {
      bubble.textContent = pistas[i];
      bubble.style.opacity = 1;
    }, 200);
  }, 3200);

  window.addEventListener('konami:unlocked', () => {
    bubble.textContent = '¡Lo lograste! +50000 pts';
    hero.classList.add('celebrate');
    setTimeout(() => hero.classList.remove('celebrate'), 1400);
  });
});
// ============================================================
// MEJORA 3 (v3): Mini-Tetris con tetrominós reales (I, O, T, S, Z, J, L)
// Las piezas caen con gravedad simple por columna y se apilan;
// al completar una fila, se limpia con el flash clásico.
// El progreso solo avanza con el scroll (no se deshace al subir).
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('tetrisGrid');
  if (!grid) return;

  const COLS = 6;
  const ROWS = 10;
  const pieceColors = ['--cyan', '--yellow', '--magenta', '--green', '--red', '--blue', '--steel'];

  // Cada celda [dx, dy]: dx = columna relativa, dy = fila relativa desde ABAJO de la pieza
  const SHAPES = {
    I: [[0,0],[1,0],[2,0],[3,0]],
    O: [[0,0],[1,0],[0,1],[1,1]],
    T: [[0,0],[1,0],[2,0],[1,1]],
    S: [[1,0],[2,0],[0,1],[1,1]],
    Z: [[0,0],[1,0],[1,1],[2,1]],
    J: [[0,0],[1,0],[2,0],[0,1]],
    L: [[0,0],[1,0],[2,0],[2,1]],
  };
  const shapeNames = Object.keys(SHAPES);

  // Crea la cuadrícula del DOM una sola vez
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'tetris-cell';
      grid.appendChild(cell);
      row.push(cell);
    }
    cells.push(row);
  }

  const colHeights = new Array(COLS).fill(0); // altura ocupada por columna
  const TOTAL_PIECES = Math.floor((COLS * ROWS) / 4); // llena la cuadrícula exacta
  let piecesPlaced = 0;
  let gridFull = false;

  function showToast(text) {
    let toast = document.querySelector('.tetris-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'tetris-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 900);
  }

  function checkLineClear(absRow) {
    const gridRow = ROWS - 1 - absRow;
    if (gridRow < 0 || gridRow >= ROWS) return;
    const isFull = cells[gridRow].every((cell) => cell.classList.contains('filled'));
    if (!isFull) return;

    cells[gridRow].forEach((cell) => cell.classList.add('clearing'));
    showToast('¡LÍNEA!');
    setTimeout(() => {
      cells[gridRow].forEach((cell) => { cell.className = 'tetris-cell'; });
    }, 350);
  }

  function placePiece() {
    if (gridFull) return;

    const shapeName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
    const shape = SHAPES[shapeName];
    const width = Math.max(...shape.map(([dx]) => dx)) + 1;
    const startCol = Math.floor(Math.random() * (COLS - width + 1));

    // Altura mínima por columna dentro de la pieza (para saber dónde "apoya")
    const minDyPerCol = {};
    const maxDyPerCol = {};
    shape.forEach(([dx, dy]) => {
      minDyPerCol[dx] = minDyPerCol[dx] === undefined ? dy : Math.min(minDyPerCol[dx], dy);
      maxDyPerCol[dx] = maxDyPerCol[dx] === undefined ? dy : Math.max(maxDyPerCol[dx], dy);
    });

    // Fila base: la más alta necesaria para que ninguna columna se solape
    let baseRow = 0;
    Object.keys(minDyPerCol).forEach((dx) => {
      const col = startCol + Number(dx);
      const needed = colHeights[col] - minDyPerCol[dx];
      baseRow = Math.max(baseRow, needed);
    });

    // Si ya no cabe, la cuadrícula se considera llena
    if (baseRow + Math.max(...shape.map(([, dy]) => dy)) >= ROWS) {
      gridFull = true;
      showToast('¡TETRIS! 🎉');
      return;
    }

    const color = pieceColors[Math.floor(Math.random() * pieceColors.length)];
    const touchedRows = new Set();

    shape.forEach(([dx, dy]) => {
      const absRow = baseRow + dy;
      const col = startCol + dx;
      const gridRow = ROWS - 1 - absRow;
      const cell = cells[gridRow]?.[col];
      if (cell) {
        cell.style.background = `var(${color})`;
        cell.classList.add('filled');
        touchedRows.add(absRow);
      }
    });

    // Actualiza altura de cada columna tocada
    Object.keys(maxDyPerCol).forEach((dx) => {
      const col = startCol + Number(dx);
      colHeights[col] = Math.max(colHeights[col], baseRow + maxDyPerCol[dx] + 1);
    });

    touchedRows.forEach((r) => checkLineClear(r));
    piecesPlaced++;
  }

  function getScrollPercent() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? scrollTop / docHeight : 0;
  }

  function updateGrid() {
    const percent = getScrollPercent();
    const target = Math.round(percent * TOTAL_PIECES);
    while (piecesPlaced < target && !gridFull) {
      placePiece();
    }
  }

  window.addEventListener('scroll', updateGrid, { passive: true });
  updateGrid();
});

// ============================================================
// Vigía interactivo: pistas + mini-juego de esquive con el barril DK
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const bubble = document.getElementById('heroBubble');
  const hero = document.getElementById('barrelHero');
  const combo = document.getElementById('heroCombo');
  if (!bubble || !hero) return;

  const pistas = [
    '¿Conoces algún código secreto?',
    'Dicen que empieza con las flechas...',
    '↑ ↑',
    'Termina con B y A',
    '¡Pruébalo en tu teclado!',
    'Psst... funciona igual que en Donkey Kong',
    'Tan clásico como encajar una pieza en Tetris',
    'Haz clic aquí si te aburres',
  ];
  let i = 0;
  let score = 0;
  let dodgeWindowOpen = false;

  function nextPista() {
    i = (i + 1) % pistas.length;
    bubble.style.opacity = 0;
    setTimeout(() => {
      bubble.textContent = pistas[i];
      bubble.style.opacity = 1;
    }, 200);
  }

  let autoTimer = setInterval(nextPista, 3200);

  // Clic manual: avanza pista Y reinicia el timer para que no compitan
  hero.addEventListener('click', () => {
    clearInterval(autoTimer);
    nextPista();
    autoTimer = setInterval(nextPista, 3200);

    // Si el clic ocurre durante la ventana de esquive del barril, suma puntos
    if (dodgeWindowOpen) {
      score += 100;
      combo.textContent = `+${score}`;
      combo.hidden = false;
      hero.classList.add('jump');
      setTimeout(() => hero.classList.remove('jump'), 500);
      dodgeWindowOpen = false;
    }
  });

  hero.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') hero.click();
  });

  window.addEventListener('konami:unlocked', () => {
    bubble.textContent = '¡Lo lograste! +50000 pts';
    hero.classList.add('celebrate');
    setTimeout(() => hero.classList.remove('celebrate'), 1400);
  });

  // Expone la ventana de esquive para que el barril la active
  window.addEventListener('dk:barrel-near', () => {
    dodgeWindowOpen = true;
    hero.classList.add('dodge-window');
    setTimeout(() => {
      dodgeWindowOpen = false;
      hero.classList.remove('dodge-window');
    }, 700); // 700ms para reaccionar
  });
  const HS_KEY = 'retrofun-highscore';
const highScoreEl = document.getElementById('highScoreValue');
let highScore = parseInt(localStorage.getItem(HS_KEY) || '0', 10);
if (highScoreEl) highScoreEl.textContent = highScore;

// dentro del if (dodgeWindowOpen) { ... } donde ya sumas score += 100:
if (score > highScore) {
  highScore = score;
  localStorage.setItem(HS_KEY, String(highScore));
  if (highScoreEl) highScoreEl.textContent = highScore;
}
});

// ============================================================
// MEJORA 6: Beep 8-bits al pasar/clicar los botones de color
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('#iconografia .icon-tile');
  if (!buttons.length) return;

  let audioCtx = null;
  const notes = [261.6, 329.6, 392.0, 523.3]; // C-E-G-C, una por botón

  function playBeep(freq) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square'; // el timbre "8-bit" clásico
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  }

  buttons.forEach((btn, index) => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => playBeep(notes[index % notes.length]));
  });
});

// ============================================================
// MEJORA 10: Flechas ↑/↓ navegan entre secciones como un menú de nivel
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (!sections.length) return;

  function currentIndex() {
    const scrollPos = window.scrollY + window.innerHeight * 0.4;
    let idx = 0;
    sections.forEach((s, i) => {
      if (s.offsetTop <= scrollPos) idx = i;
    });
    return idx;
  }

  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = currentIndex();
      const nextIdx = e.key === 'ArrowDown'
        ? Math.min(idx + 1, sections.length - 1)
        : Math.max(idx - 1, 0);
      sections[nextIdx].scrollIntoView({ behavior: 'smooth' });
    }
  });
});
