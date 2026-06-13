const IMPROVEMENTS = {
  compost:    { name: 'Compostagem',           icon: '♻️', sust: 10, water: 5,  co2: 10, bio: 10, eco: 200,  cost: 300,  category: 'solo' },
  pollinator: { name: 'Jardim Polinizadores',  icon: '🐝', sust: 10, water: 2,  co2: 5,  bio: 15, eco: 250,  cost: 400,  category: 'biodiversidade' },
  cistern:    { name: 'Cisterna Inteligente',  icon: '💧', sust: 10, water: 30, co2: 5,  bio: 5,  eco: 300,  cost: 500,  category: 'agua' },
  reforest:   { name: 'Reflorestamento',       icon: '🌲', sust: 15, water: 5,  co2: 15, bio: 20, eco: 100,  cost: 600,  category: 'biodiversidade' },
  biopest:    { name: 'Controle Biológico',    icon: '🐞', sust: 15, water: 3,  co2: 10, bio: 20, eco: 400,  cost: 700,  category: 'solo' },
  irrigation: { name: 'Irrigação Inteligente', icon: '🤖', sust: 10, water: 40, co2: 5,  bio: 5,  eco: 500,  cost: 800,  category: 'agua' },
  solar:      { name: 'Energia Solar',         icon: '☀️', sust: 15, water: 0,  co2: 20, bio: 5,  eco: 800,  cost: 1000, category: 'energia' },
  agroforest: { name: 'Agrofloresta',          icon: '🌳', sust: 15, water: 15, co2: 30, bio: 20, eco: 600,  cost: 1200, category: 'biodiversidade' }
};

const IMPROVEMENT_ORDER = [
  'compost', 'pollinator', 'cistern', 'reforest', 'biopest', 'irrigation', 'solar', 'agroforest'
];

let simState = {
  installed:  new Set(),
  metrics:    { sust: 0, water: 0, co2: 0, bio: 0, eco: 0 },
  score:      0,
  _budget:    1500,
  incomeRate: 100,
  tick:       0,
  get budget() { return this._budget; },
  set budget(val) {
    this._budget = val;
    onBudgetChanged();
  }
};

function onBudgetChanged() {
  const formatted = 'R$ ' + simState._budget.toLocaleString('pt-BR');
  const budgetEl = document.getElementById('budgetVal');
  if (budgetEl) {
    budgetEl.textContent = formatted;
  }
  updateFarmCards();
}

function loadState() {
  try {
    const raw = localStorage.getItem('ecofarm-sim');
    if (!raw) return;
    const saved = JSON.parse(raw);
    simState.installed  = new Set(saved.installed  || []);
    simState.budget     = saved.budget     ?? 1500;
    simState.incomeRate = saved.incomeRate ?? 100;
    simState.tick       = saved.tick       ?? 0;
    recalcMetrics();
  } catch(e) { console.warn('Load state error', e); }
}

function saveState() {
  try {
    const data = {
      installed:  [...simState.installed],
      budget:     simState.budget,
      incomeRate: simState.incomeRate,
      tick:       simState.tick,
      metrics:    simState.metrics
    };
    localStorage.setItem('ecofarm-sim', JSON.stringify(data));
    localStorage.setItem('ecofarm-installed', JSON.stringify([...simState.installed]));
  } catch(e) {}
}

function recalcMetrics() {
  let sust = 0, water = 0, co2 = 0, bio = 0, eco = 0, income = 100;
  simState.installed.forEach(id => {
    const d = IMPROVEMENTS[id];
    if (!d) return;
    sust  += d.sust;
    water += d.water;
    co2   += d.co2;
    bio   += d.bio;
    eco   += d.eco;
    income += d.eco * 0.12;
  });
  simState.metrics = {
    sust:  Math.min(Math.round(sust),  100),
    water: Math.min(Math.round(water), 100),
    co2:   Math.min(Math.round(co2),   100),
    bio:   Math.min(Math.round(bio),   100),
    eco:   Math.round(eco)
  };
  simState.score = simState.metrics.sust;
  simState.incomeRate = Math.round(income);
}

function updateUI() {
  const m = simState.metrics;
  const animate = (id, val, suffix = '%') => {
    const el = document.getElementById(id);
    if (!el) return;
    const cur = parseFloat(el.textContent) || 0;
    const diff = val - cur;
    const steps = 20;
    let i = 0;
    const t = setInterval(() => {
      i++;
      const v = cur + (diff * i / steps);
      el.textContent = (suffix === '%' ? Math.round(v) : v.toFixed(0)) + suffix;
      if (i >= steps) { el.textContent = Math.round(val) + suffix; clearInterval(t); }
    }, 25);
  };
  animate('mSustVal', m.sust); setBar('mSustBar', m.sust);
  updateChange('mSustChange', m.sust, 'sustentabilidade');
  animate('mWaterVal', m.water); setBar('mWaterBar', m.water);
  updateChange('mWaterChange', m.water, 'água economizada');
  animate('mCO2Val', m.co2); setBar('mCO2Bar', m.co2);
  updateChange('mCO2Change', m.co2, 'CO₂ reduzido');
  animate('mBioVal', m.bio); setBar('mBioBar', m.bio);
  updateChange('mBioChange', m.bio, 'biodiversidade');
  const ecoEl = document.getElementById('mEcoVal');
  if (ecoEl) ecoEl.textContent = 'R$' + m.eco.toLocaleString('pt-BR');
  setBar('mEcoBar', Math.min((m.eco / 2950) * 100, 100));
  const ecoChange = document.getElementById('mEcoChange');
  if (ecoChange) ecoChange.textContent = m.eco > 0 ? `+R$${simState.incomeRate.toLocaleString('pt-BR')}/mês` : '—';
  const scoreEl = document.getElementById('totalScore');
  if (scoreEl) {
    scoreEl.textContent = m.sust;
    const pulse = scoreEl.animate([
      { transform: 'scale(1.3)', color: '#22c55e' },
      { transform: 'scale(1)',   color: '' }
    ], { duration: 400, easing: 'ease-out' });
  }
  const cat = document.getElementById('scoreCategory');
  if (cat) cat.textContent = getCategory(m.sust);
  const badge = document.getElementById('scoreBadgeValue');
  if (badge) badge.textContent = m.sust;
  const fill = document.getElementById('simProgressFill');
  if (fill) fill.style.width = m.sust + '%';
  const budgetEl = document.getElementById('budgetVal');
  if (budgetEl) budgetEl.textContent = 'R$ ' + simState.budget.toLocaleString('pt-BR');
  updateSVG();
  updateFarmCards();
}

function setBar(id, pct) {
  const el = document.getElementById(id);
  if (el) {
    el.style.transition = 'width 0.6s ease';
    el.style.width = Math.max(pct, 0) + '%';
  }
}

function updateChange(id, val, label) {
  const el = document.getElementById(id);
  if (!el) return;
  if (val > 0) {
    el.textContent = `↑ ${val}% de ${label}`;
    el.style.color = '#22c55e';
  } else {
    el.textContent = 'Instale melhorias para aumentar!';
    el.style.color = 'var(--text-muted)';
  }
}

function getCategory(score) {
  if (score >= 90) return '🏆 Fazenda Perfeita!';
  if (score >= 75) return '🌟 Mestre Sustentável';
  if (score >= 50) return '🌿 Guardião Verde';
  if (score >= 25) return '🌱 Agricultor Consciente';
  return '🚜 Agricultor Iniciante';
}

function updateSVG() {
  const farmImage = document.getElementById('farmImage');
  if (!farmImage) return;

  let currentStage = 0;
  for (let i = 0; i < IMPROVEMENT_ORDER.length; i++) {
    if (simState.installed.has(IMPROVEMENT_ORDER[i])) {
      currentStage = i + 1;
    } else {
      break;
    }
  }

  const imageMap = [
    'Inicio.png',
    'Upgrade1.png',
    'Upgrade2.png',
    'Upgrade3.png',
    'Upgrade4.png',
    'Upgrade5.png',
    'Upgrade6.png',
    'Upgrade7.png',
    'Upgrade8.png'
  ];

  const imageName = imageMap[currentStage] || 'Inicio.png';
  farmImage.src = '../imagens/UpgradesSimulador/' + imageName;
}

function updateFarmCards() {
  const container = document.getElementById('quickUpgradeContent');
  if (!container) return;
  
  let nextItem = null;
  let nextId = null;
  for (const id of IMPROVEMENT_ORDER) {
    if (!simState.installed.has(id)) {
      nextItem = IMPROVEMENTS[id];
      nextId = id;
      break;
    }
  }

  if (!nextItem) {
    container.innerHTML = '<div style="text-align:center;color:var(--verde-vivo);font-weight:700;padding:1rem 0">Parabéns! Você completou todas as melhorias disponíveis.</div>';
    return;
  }

  const canAfford = simState.budget >= nextItem.cost;
  
  let statsHtml = '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.6rem">';
  if (nextItem.sust) statsHtml += `<span style="font-size:0.65rem;background:rgba(34,197,94,0.15);color:#22c55e;padding:0.15rem 0.5rem;border-radius:99px;font-weight:700">🌿+${nextItem.sust}</span>`;
  if (nextItem.water) statsHtml += `<span style="font-size:0.65rem;background:rgba(56,189,248,0.15);color:#38bdf8;padding:0.15rem 0.5rem;border-radius:99px;font-weight:700">💧+${nextItem.water}%</span>`;
  if (nextItem.co2) statsHtml += `<span style="font-size:0.65rem;background:rgba(74,222,128,0.15);color:#4ade80;padding:0.15rem 0.5rem;border-radius:99px;font-weight:700">🌍-${nextItem.co2}%</span>`;
  if (nextItem.bio) statsHtml += `<span style="font-size:0.65rem;background:rgba(250,204,21,0.15);color:#facc15;padding:0.15rem 0.5rem;border-radius:99px;font-weight:700">🦋+${nextItem.bio}</span>`;
  if (nextItem.eco) statsHtml += `<span style="font-size:0.65rem;background:rgba(251,191,36,0.15);color:#fbbf24;padding:0.15rem 0.5rem;border-radius:99px;font-weight:700">💰+R$${nextItem.eco}</span>`;
  statsHtml += '</div>';

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem">
      <span style="font-size:2rem">${nextItem.icon}</span>
      <div>
        <div style="font-size:0.95rem;font-weight:800;color:var(--text-primary)">${nextItem.name}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">Custo: R$${nextItem.cost.toLocaleString('pt-BR')}</div>
      </div>
    </div>
    ${statsHtml}
    <button class="install-btn" onclick="installImprovement('${nextId}')" ${!canAfford ? 'disabled' : ''} style="background:${canAfford ? 'var(--verde-vivo)' : 'transparent'};color:${canAfford ? '#fff' : 'var(--verde-vivo)'}">
      ${nextItem.icon} Instalar
    </button>
  `;
}

window.installImprovement = function(id) {
  if (simState.installed.has(id)) return;
  const d = IMPROVEMENTS[id];
  if (!d) return;
  if (simState.budget < d.cost) {
    showNotification('💸 Orçamento insuficiente! Aguarde a renda passiva acumular.', 'error');
    return;
  }
  simState.budget -= d.cost;
  simState.installed.add(id);
  recalcMetrics();
  updateUI();
  saveState();
  showNotification(`✅ ${d.icon} ${d.name} instalada com sucesso!`, 'success');
  if (simState.metrics.sust >= 100 || simState.installed.size === Object.keys(IMPROVEMENTS).length) {
    setTimeout(showVictory, 1000);
  }
};

window.resetSimulator = function() {
  if (!confirm('Reiniciar toda a fazenda? O progresso será perdido.')) return;
  simState.installed  = new Set();
  simState.budget     = 1500;
  simState.incomeRate = 100;
  simState.tick       = 0;
  simState.metrics    = { sust: 0, water: 0, co2: 0, bio: 0, eco: 0 };
  simState.score      = 0;
  localStorage.removeItem('ecofarm-sim');
  localStorage.removeItem('ecofarm-installed');
  localStorage.removeItem('ecofarm-cert-name');
  const victoryModal = document.getElementById('victoryModal');
  if (victoryModal) victoryModal.classList.add('hidden');
  const bars = ['mSustBar','mWaterBar','mCO2Bar','mBioBar','mEcoBar','simProgressFill'];
  bars.forEach(id => { const el = document.getElementById(id); if (el) el.style.width = '0%'; });
  const metrics = ['mSustVal','mWaterVal','mCO2Val','mBioVal'];
  metrics.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '0%'; });
  const ecoEl = document.getElementById('mEcoVal');
  if (ecoEl) ecoEl.textContent = 'R$0';
  const scoreEl = document.getElementById('totalScore');
  if (scoreEl) scoreEl.textContent = '0';
  const cat = document.getElementById('scoreCategory');
  if (cat) cat.textContent = getCategory(0);
  recalcMetrics();
  updateUI();
  saveState();
  showNotification('🔄 Fazenda reiniciada com sucesso!', 'info');
};

function showNotification(msg, type = 'success') {
  const notif = document.getElementById('installNotif');
  if (!notif) return;
  notif.textContent = msg;
  notif.className = 'install-notification show ' + type;
  clearTimeout(notif._timer);
  notif._timer = setTimeout(() => notif.classList.remove('show'), 3000);
}

function showVictory() {
  const modal = document.getElementById('victoryModal');
  if (modal) modal.classList.remove('hidden');
}

let incomeInterval = null;
function startIncomeTimer() {
  if (incomeInterval) clearInterval(incomeInterval);
  incomeInterval = setInterval(() => {
    simState.budget += simState.incomeRate;
    simState.tick++;
    saveState();
    const budgetEl = document.getElementById('budgetVal');
    if (budgetEl) {
      budgetEl.style.animation = 'none';
      void budgetEl.offsetWidth;
      budgetEl.style.animation = 'incomeFlash 0.4s ease';
    }
    if (simState.tick % 5 === 0) {
      const tip = document.getElementById('incomeTip');
      if (tip) tip.textContent = `+R$${simState.incomeRate.toLocaleString('pt-BR')} recebidos`;
    }
  }, 8000);
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  recalcMetrics();
  updateUI();
  startIncomeTimer();

  const style = document.createElement('style');
  style.textContent = `
    @keyframes incomeFlash {
      0%   { transform: scale(1.1); color: #22c55e; }
      100% { transform: scale(1);   color: inherit; }
    }
    .install-notification.error  { background: rgba(239,68,68,0.95); }
    .install-notification.info   { background: rgba(59,130,246,0.95); }
    .improvement-card.installed  { opacity: 0.65; border-color: var(--verde-border); }
    .improvement-card.installed .install-btn { background: rgba(34,197,94,0.15); color: var(--verde-destaque); cursor: default; }
    .improvement-card.installed .installed-badge { display: flex; }
  `;
  document.head.appendChild(style);
});
