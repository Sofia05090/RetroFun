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

// Vitrina de cartuchos, al dar click se "inserta".
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.cart').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.add('is-in');
      setTimeout(() => card.classList.remove('is-in'), 220);
    });
  });
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
})();

document.addEventListener('click', (e) => {
  const laser = document.createElement('div');
  laser.className = 'laser-shot';
  laser.style.left = `${e.clientX}px`;
  laser.style.top = `${e.clientY}px`;
  document.body.appendChild(laser);
  setTimeout(() => laser.remove(), 600);
});

// --- MOTOR DE PATRULLAJE OPTIMIZADO (COOLDOWN REDUCIDO Y MAYOR ESPACIADO) ---
document.addEventListener('DOMContentLoaded', () => {
  let idleTimer;
  let isRunning = false;
  const idleLimit = 2500; // Cooldown reducido a 2.5 segundos de inactividad
  const ghostTypes = ['blinky', 'pinky', 'inky', 'clyde'];
  const squad = [];

  // Crear la fila de fantasmas con mayor distancia entre ellos (120px)
  ghostTypes.forEach((type, index) => {
    const ghost = document.createElement('div');
    ghost.className = `pacman-ghost-idle ${type}`;
    document.body.appendChild(ghost);
    squad.push({ element: ghost, spacing: index * 120 });
  });

  function triggerGhostPatrol() {
    if (isRunning) return;
    isRunning = true;

    squad.forEach(item => item.element.classList.add('active'));

    const startTime = performance.now();
    const duration = 5500;

    function animateSquad(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const leadLeft = -140 + (progress * (window.innerWidth + 500));

      squad.forEach((item) => {
        const ghostLeft = leadLeft - item.spacing;
        item.element.style.left = `${ghostLeft}px`;
      });

      if (progress < 1) {
        requestAnimationFrame(animateSquad);
      } else {
        squad.forEach(item => item.element.classList.remove('active'));
        isRunning = false;
      }
    }

    requestAnimationFrame(animateSquad);
  }

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(triggerGhostPatrol, idleLimit);
  }

  window.addEventListener('mousemove', resetIdleTimer);
  window.addEventListener('keydown', resetIdleTimer);
  window.addEventListener('scroll', resetIdleTimer);

  resetIdleTimer();
});