document.addEventListener('DOMContentLoaded', () => {
  const wrapper  = document.getElementById('comparisonWrapper');
  const divider  = document.getElementById('compDivider');
  const leftSide = document.getElementById('leftSide');
  const rightSide = document.getElementById('rightSide');
  const slider   = document.getElementById('compare-slider');
  let isDragging = false;
  function setDividerPos(percent) {
    percent = Math.max(10, Math.min(90, percent));
    const dividerPercent = 100 - percent;
    if (divider) divider.style.left = dividerPercent + '%';
    if (rightSide) {
      rightSide.style.clipPath = `inset(0 0 0 ${dividerPercent}%)`;
    }
    if (slider) slider.value = percent;
  }
  if (slider) {
    slider.addEventListener('input', () => setDividerPos(parseInt(slider.value)));
  }
  if (divider && wrapper) {
    divider.addEventListener('mousedown', e => { isDragging = true; e.preventDefault(); });
    wrapper.addEventListener('mousedown', e => {
      if (e.target === wrapper || e.target.closest('.comparison-left') || e.target.closest('.comparison-right')) {
        isDragging = true;
      }
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const rect   = wrapper.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const pct    = (x / rect.width) * 100;
      setDividerPos(100 - pct);
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
    wrapper.addEventListener('touchmove', e => {
      const rect = wrapper.getBoundingClientRect();
      const x    = e.touches[0].clientX - rect.left;
      const pct  = (x / rect.width) * 100;
      setDividerPos(100 - pct);
      e.preventDefault();
    }, { passive: false });
  }
  let autoDir = -1;
  let autoPct = 50;
  let autoAnim = setInterval(() => {
    autoPct += autoDir * 0.5;
    if (autoPct <= 20) autoDir = 1;
    if (autoPct >= 80) autoDir = -1;
    setDividerPos(autoPct);
  }, 30);
  const stopAuto = () => clearInterval(autoAnim);
  if (wrapper) wrapper.addEventListener('mousedown', stopAuto);
  if (slider)  slider.addEventListener('input', stopAuto);
  if (wrapper) wrapper.addEventListener('touchstart', stopAuto);
  const compareData = [
    {
      category: '🌿 Sustentabilidade',
      bad:  '0% — Práticas predatórias',
      good: '100% — Fazenda ecológica modelo'
    },
    {
      category: '🌍 Emissão CO₂',
      bad:  '12 ton/ha/ano — Destruição do clima',
      good: '2,5 ton/ha/ano — Próximo à neutralidade'
    },
    {
      category: '💧 Uso de Água',
      bad:  '8.000 L/ha — Desperdício crítico',
      good: '3.200 L/ha — Uso eficiente e consciente'
    },
    {
      category: '🦋 Biodiversidade',
      bad:  '2-5 espécies/ha — Monocultura estéril',
      good: '40+ espécies/ha — Ecossistema restaurado'
    },
    {
      category: '💰 Custo Operacional',
      bad:  'R$12.000/mês — Alto e crescente',
      good: 'R$4.800/mês — Reduzido com energia solar'
    },
    {
      category: '🌱 Saúde do Solo',
      bad:  'Degradado — Perda de 30cm/ano',
      good: 'Fértil — Microbiota ativa e rica'
    },
    {
      category: '📈 Produtividade',
      bad:  '2,8 t/ha — Declínio constante',
      good: '4,5 t/ha — Crescimento sustentável'
    },
  ];
  const grid = document.getElementById('compareDataGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="compare-col-title col-bad">❌ Sem Sustentabilidade</div>
      <div class="col-vs">VS</div>
      <div class="compare-col-title col-good">✅ Com Sustentabilidade</div>
    `;
    compareData.forEach(row => {
      const badCell = document.createElement('div');
      badCell.className = 'compare-cell bad reveal';
      badCell.innerHTML = `<strong>${row.category}</strong><br><span style="font-size:0.78rem;opacity:0.85">${row.bad}</span>`;
      const vsCell = document.createElement('div');
      vsCell.className = 'compare-cell vs';
      vsCell.textContent = '→';
      const goodCell = document.createElement('div');
      goodCell.className = 'compare-cell good reveal';
      goodCell.innerHTML = `<strong>${row.category}</strong><br><span style="font-size:0.78rem;opacity:0.85">${row.good}</span>`;
      grid.appendChild(badCell);
      grid.appendChild(vsCell);
      grid.appendChild(goodCell);
    });
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  }
});
