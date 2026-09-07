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
