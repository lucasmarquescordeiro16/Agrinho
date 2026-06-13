const IMPROVEMENTS_CERT = {
  solar:      { sust: 15, water: 0,  co2: 20, bio: 5  },
  cistern:    { sust: 10, water: 30, co2: 5,  bio: 5  },
  compost:    { sust: 10, water: 5,  co2: 10, bio: 10 },
  reforest:   { sust: 15, water: 5,  co2: 15, bio: 20 },
  irrigation: { sust: 10, water: 40, co2: 5,  bio: 5  },
  pollinator: { sust: 10, water: 2,  co2: 5,  bio: 15 },
  biopest:    { sust: 15, water: 3,  co2: 10, bio: 20 },
  agroforest: { sust: 15, water: 15, co2: 30, bio: 20 }
};

function loadCertData() {
  const installedRaw = localStorage.getItem('ecofarm-installed');
  const installed = installedRaw ? JSON.parse(installedRaw) : [];
  let sust = 0, water = 0, co2 = 0, bio = 0;
  installed.forEach(id => {
    const d = IMPROVEMENTS_CERT[id];
    if (!d) return;
    sust  += d.sust;
    water += d.water;
    co2   += d.co2;
    bio   += d.bio;
  });
  sust  = Math.min(sust,  100);
  water = Math.min(water, 100);
  co2   = Math.min(co2,   100);
  bio   = Math.min(bio,   100);
  const score = Math.round((sust + water + co2 + bio) / 4);
  return { score, sust, water, co2, bio, installed };
}

function getCategory(score) {
  if (score >= 75) return { key:'lenda',    label:'🌟 Lenda EcoFarm',         class:'level-lenda' };
  if (score >= 50) return { key:'mestre',   label:'🌳 Mestre Sustentável',    class:'level-mestre' };
  if (score >= 25) return { key:'guardiao', label:'🌿 Guardião Verde',        class:'level-guardiao' };
  if (score >= 1)  return { key:'consciente',label:'🌱 Agricultor Consciente',class:'level-consciente' };
  return              { key:'iniciante', label:'🚜 Agricultor Iniciante',  class:'level-consciente' };
}

function generateCertificate() {
  const data = loadCertData();
  const cat  = getCategory(data.score);
  const nameInput = document.getElementById('certName');
  const savedName = localStorage.getItem('solovivo-cert-name') || localStorage.getItem('ecofarm-cert-name');
  const name = (nameInput && nameInput.value.trim()) || savedName || 'Participante SoloVivo';
  if (nameInput && !nameInput.value.trim() && savedName) nameInput.value = savedName;
  const recipientEl = document.getElementById('certRecipientName');
  if (recipientEl) recipientEl.textContent = name;
  const scoreEl = document.getElementById('certScoreNum');
  if (scoreEl) animateCertNum(scoreEl, data.score, '');
  const instEl = document.getElementById('certInstNum');
  if (instEl) instEl.textContent = data.installed.length + '/8';
  const co2El = document.getElementById('certCO2Num');
  if (co2El) animateCertNum(co2El, data.co2, '%');
  const catBadge = document.getElementById('certCategoryBadge');
  if (catBadge) {
    catBadge.textContent = cat.label;
    catBadge.className   = 'cert-category-badge ' + cat.class;
  }
  const dateEl = document.getElementById('certDate');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
  const levelBadge = document.getElementById('certLevelBadge');
  const levelSub   = document.getElementById('certLevelSub');
  if (levelBadge) {
    levelBadge.textContent = cat.label;
    levelBadge.className   = 'cert-level-badge ' + cat.class;
  }
  if (levelSub) {
    levelSub.textContent = data.score > 0
      ? `Você alcançou ${data.score} pontos com ${data.installed.length} melhoria(s) instalada(s).`
      : 'Vá ao simulador para instalar melhorias e aumentar seu score!';
  }
  ['consciente','guardiao','mestre','lenda'].forEach(k => {
    const card = document.getElementById('rank-' + k);
    if (card) card.classList.toggle('active-rank', k === cat.key);
  });
  const card = document.getElementById('certificateCard');
  if (card) {
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = 'certPop 0.6s cubic-bezier(0.34,1.56,0.64,1)';
  }
  localStorage.setItem('solovivo-cert-name', name);
  localStorage.setItem('ecofarm-cert-name', name);
  showToast('🏆 Certificado SoloVivo gerado com sucesso!');
}

function animateCertNum(el, target, suffix) {
  let current = 0;
  const steps = 40;
  const step  = target / steps;
  let count   = 0;
  const timer = setInterval(() => {
    current += step;
    count++;
    if (count >= steps) { current = target; clearInterval(timer); }
    el.textContent = Math.round(current) + suffix;
  }, 30);
}

async function downloadCertificate() {
  const card = document.getElementById('certificateCard');
  if (!card) return;
  showToast('📥 Preparando download...');
  if (typeof html2canvas === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    document.head.appendChild(script);
    script.onload = () => doDownload(card);
    return;
  }
  doDownload(card);
}

function doDownload(card) {
  if (typeof html2canvas === 'undefined') {
    showToast('💡 Clique com botão direito → "Salvar como imagem" no certificado!');
    return;
  }
  html2canvas(card, {
    backgroundColor: '#0a2e14',
    scale: 2,
    useCORS: true,
    allowTaint: true
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'SoloVivo-Certificado.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('✅ Certificado baixado!');
  }).catch(() => {
    showToast('💡 Use Ctrl+P → "Salvar como PDF" para salvar o certificado!');
  });
}

function shareCertificate() {
  const data = loadCertData();
  const cat  = getCategory(data.score);
  const name = localStorage.getItem('solovivo-cert-name') || 'Participante';
  const text = `🌿 Conquistei a categoria "${cat.label}" no SoloVivo! Score: ${data.score} pontos. #Agrinho #SoloVivo #Sustentabilidade`;
  if (navigator.share) {
    navigator.share({ title: 'SoloVivo — Certificado', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Texto copiado! Cole nas redes sociais.');
    }).catch(() => {
      showToast('Compartilhe: ' + text.substring(0, 60) + '...');
    });
  }
}

function showToast(msg) {
  let toast = document.getElementById('certToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'certToast';
    toast.style.cssText = `
      position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(100px);
      background:rgba(34,197,94,0.95);color:#fff;padding:0.8rem 1.5rem;
      border-radius:50px;font-weight:700;font-size:0.9rem;
      z-index:9999;transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
      white-space:nowrap;box-shadow:0 8px 30px rgba(34,197,94,0.4);
      font-family:'Outfit',sans-serif;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 3500);
}

const certStyle = document.createElement('style');
certStyle.textContent = `
@keyframes certPop {
  from { transform: scale(0.92); opacity: 0.5; }
  to   { transform: scale(1);    opacity: 1;   }
}`;
document.head.appendChild(certStyle);

document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('solovivo-cert-name') || localStorage.getItem('ecofarm-cert-name');
  const nameInput = document.getElementById('certName');
  if (savedName && nameInput) nameInput.value = savedName;
  generateCertificate();
  if (nameInput) {
    nameInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') generateCertificate();
    });
    nameInput.addEventListener('input', () => {
      clearTimeout(nameInput._debounce);
      nameInput._debounce = setTimeout(() => generateCertificate(), 800);
    });
  }
});
