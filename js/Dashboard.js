const IMPROVEMENTS_DATA = {
  solar:      { name: 'Energia Solar',         icon: '☀️', sust: 15, water: 0,  co2: 20, bio: 5,  eco: 800  },
  cistern:    { name: 'Cisterna Inteligente',  icon: '💧', sust: 10, water: 30, co2: 5,  bio: 5,  eco: 300  },
  compost:    { name: 'Compostagem',           icon: '♻️', sust: 10, water: 5,  co2: 10, bio: 10, eco: 200  },
  reforest:   { name: 'Reflorestamento',       icon: '🌲', sust: 15, water: 5,  co2: 15, bio: 20, eco: 100  },
  irrigation: { name: 'Irrigação Inteligente', icon: '🤖', sust: 10, water: 40, co2: 5,  bio: 5,  eco: 500  },
  pollinator: { name: 'Jardim Polinizadores',  icon: '🐝', sust: 10, water: 2,  co2: 5,  bio: 15, eco: 250  },
  biopest:    { name: 'Controle Biológico',    icon: '🐞', sust: 15, water: 3,  co2: 10, bio: 20, eco: 400  },
  agroforest: { name: 'Agrofloresta',          icon: '🌳', sust: 15, water: 15, co2: 30, bio: 20, eco: 600  }
};

function loadDashboardData() {
  const installedRaw = localStorage.getItem('ecofarm-installed');
  const installed = installedRaw ? JSON.parse(installedRaw) : [];
  let sust = 0, water = 0, co2 = 0, bio = 0, eco = 0;
  installed.forEach(id => {
    const d = IMPROVEMENTS_DATA[id];
    if (!d) return;
    sust  += d.sust;
    water += d.water;
    co2   += d.co2;
    bio   += d.bio;
    eco   += d.eco;
  });
  sust  = Math.min(sust,  100);
  water = Math.min(water, 100);
  co2   = Math.min(co2,   100);
  bio   = Math.min(bio,   100);
  const score = Math.round((sust + water + co2 + bio) / 4);
  return { sust, water, co2, bio, eco, score, installed };
}

function getCategory(score) {
  if (score >= 90) return '🏆 Fazenda Perfeita';
  if (score >= 75) return '🌟 Mestre Sustentável';
  if (score >= 50) return '🌿 Guardião Verde';
  if (score >= 25) return '🌱 Agricultor Consciente';
  return '🚜 Agricultor Iniciante';
}

function animateCounter(el, target, suffix = '', duration = 1500) {
  if (!el) return;
  const steps = 50;
  const step = target / steps;
  let current = 0;
  let count = 0;
  const timer = setInterval(() => {
    current += step;
    count++;
    if (count >= steps) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = typeof target === 'number' && !Number.isInteger(target)
      ? current.toFixed(1) + suffix
      : Math.round(current) + suffix;
  }, duration / steps);
}

function animateCircular(id, valId, percent) {
  const circ = document.getElementById(id);
  const val  = document.getElementById(valId);
  if (!circ || !val) return;
  const circumference = 251.2;
  const offset = circumference - (percent / 100) * circumference;
  setTimeout(() => {
    circ.style.strokeDashoffset = offset;
    animateCounter(val, percent);
  }, 400);
}

function buildMiniChart(data) {
  const chart = document.getElementById('miniChart');
  if (!chart) return;
  const ecoMax = 2950;
  const categories = [
    { label: 'Sustent.', value: data.sust,  color: '#22c55e' },
    { label: 'Água',     value: data.water, color: '#38bdf8' },
    { label: 'CO₂',      value: data.co2,   color: '#4ade80' },
    { label: 'Biodiv.',  value: data.bio,   color: '#facc15' },
    { label: 'Economia', value: Math.min((data.eco / ecoMax) * 100, 100), color: '#fb923c' },
  ];
  chart.innerHTML = '';
  categories.forEach(cat => {
    const col = document.createElement('div');
    col.className = 'mini-bar-col';
    const bar = document.createElement('div');
    bar.className = 'mini-bar';
    bar.style.height = '0px';
    bar.style.background = cat.color;
    bar.style.boxShadow = `0 0 10px ${cat.color}40`;
    bar.title = `${cat.label}: ${Math.round(cat.value)}%`;
    const lbl = document.createElement('div');
    lbl.className = 'mini-bar-xlabel';
    lbl.textContent = cat.label;
    col.appendChild(bar);
    col.appendChild(lbl);
    chart.appendChild(col);
    setTimeout(() => {
      bar.style.height = Math.max(cat.value, 2) + 'px';
    }, 600);
  });
}

function buildInstalledList(installed) {
  const list = document.getElementById('installedList');
  if (!list) return;
  if (installed.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🌱</div>
        <p>Nenhuma melhoria instalada ainda. <a href="simulador.html" style="color:var(--verde-vivo)">Vá ao simulador →</a></p>
      </div>`;
    return;
  }
  list.innerHTML = '';
  installed.forEach((id, i) => {
    const d = IMPROVEMENTS_DATA[id];
    if (!d) return;
    const chip = document.createElement('div');
    chip.className = 'installed-chip';
    chip.style.animationDelay = (i * 0.08) + 's';
    chip.innerHTML = `${d.icon} ${d.name}`;
    list.appendChild(chip);
  });
  const total = Object.keys(IMPROVEMENTS_DATA).length;
  const pct = Math.round((installed.length / total) * 100);
  const progressEl = document.getElementById('dcInst');
  if (progressEl) progressEl.textContent = `${installed.length}/${total}`;
  const trendEl = document.getElementById('trendInst');
  if (trendEl) trendEl.textContent = `${installed.length}/${total}`;
}

function updateImpactNumbers(data) {
  const co2Tons = Math.round(data.co2 * 0.95);
  const waterK  = Math.round(data.water * 42);
  const trees   = Math.round(data.bio * 14);
  const species = Math.round(data.bio * 0.5 + data.sust * 0.4);
  animateCounter(document.getElementById('impactCO2'),     co2Tons);
  animateCounter(document.getElementById('impactWater'),   waterK);
  animateCounter(document.getElementById('impactTrees'),   trees);
  animateCounter(document.getElementById('impactSpecies'), species);
}

document.addEventListener('DOMContentLoaded', () => {
  const data = loadDashboardData();
  const scoreEl = document.getElementById('dashScoreNum');
  if (scoreEl) animateCounter(scoreEl, data.score);
  const catEl = document.getElementById('dashScoreCat');
  if (catEl) catEl.textContent = getCategory(data.score);
  setTimeout(() => {
    animateCounter(document.getElementById('dcSust'),  data.sust,  '%');
    animateCounter(document.getElementById('dcWater'), data.water, '%');
    animateCounter(document.getElementById('dcCO2'),   data.co2,   '%');
    animateCounter(document.getElementById('dcBio'),   data.bio,   '%');
    const ecoEl = document.getElementById('dcEco');
    if (ecoEl) ecoEl.textContent = 'R$' + data.eco.toLocaleString('pt-BR');
    const setTrend = (id, value, suffix = '%') => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = (value > 0 ? '↑ ' : '') + value + suffix;
        el.className = 'metric-card-trend ' + (value > 0 ? 'trend-up' : '');
      }
    };
    setTrend('trendSust',  data.sust);
    setTrend('trendWater', data.water);
    setTrend('trendCO2',   data.co2);
    setTrend('trendBio',   data.bio);
    setTrend('trendEco',   data.eco, '');
    ['Sust','Water','CO2','Bio'].forEach(key => {
      const k = key.toLowerCase();
      const map = { sust: data.sust, water: data.water, co2: data.co2, bio: data.bio };
      const fill = document.getElementById('b' + key + 'Fill');
      const val  = document.getElementById('b' + key + 'Val');
      if (fill) fill.style.width = map[k] + '%';
      if (val)  val.textContent = map[k] + '%';
    });
    const bEcoFill = document.getElementById('bEcoFill');
    const bEcoVal  = document.getElementById('bEcoVal');
    if (bEcoFill) bEcoFill.style.width = Math.min((data.eco / 2950) * 100, 100) + '%';
    if (bEcoVal)  bEcoVal.textContent  = 'R$' + data.eco.toLocaleString('pt-BR');
  }, 500);
  setTimeout(() => {
    animateCircular('circSust',  'circSustVal',  data.sust);
    animateCircular('circWater', 'circWaterVal', data.water);
    animateCircular('circCO2',   'circCO2Val',   data.co2);
    animateCircular('circBio',   'circBioVal',   data.bio);
  }, 800);
  setTimeout(() => buildMiniChart(data), 1000);
  buildInstalledList(data.installed);
  setTimeout(() => updateImpactNumbers(data), 600);
});
