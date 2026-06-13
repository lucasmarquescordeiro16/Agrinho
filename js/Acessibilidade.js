
(function () {
  'use strict';

  if (!('speechSynthesis' in window)) return;

  
  const synth = window.speechSynthesis;
  let utterance  = null;
  let chunks     = [];
  let chunkIndex = 0;
  let isPaused   = false;
  let isReading  = false;
  let voices     = [];

  
  const PREF_RATE  = 'tts-rate';
  const PREF_VOICE = 'tts-voice';

  function getRate()  { return parseFloat(localStorage.getItem(PREF_RATE)  || '1'); }
  function getVoiceName() { return localStorage.getItem(PREF_VOICE) || ''; }

  
  const SKIP_SELECTORS = [
    'nav', 'footer', '.navbar', '.a11y-bar', '.loader-screen',
    '#a11yBar', '.hamburger', 'script', 'style', 'noscript',
    '[aria-hidden="true"]', '.hero-particles', '.hero-grid-bg',
    '.floating-left-controls', '#upgradeModal', '#victoryModal',
    '#installNotif', '.install-notification', '.upgrade-tabs',
    '.tts-panel'
  ].join(',');

  const READ_SELECTORS = 'h1, h2, h3, h4, h5, h6, p, li, blockquote, figcaption, td, th, caption, label';

  function extractChunks() {
    const nodes = document.querySelectorAll(READ_SELECTORS);
    const seen  = new Set();
    const result = [];

    nodes.forEach(node => {
      if (node.closest(SKIP_SELECTORS)) return;

      const text = (node.innerText || node.textContent || '').trim()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s\u00C0-\u024F.,!?;:\-–—()[\]"'«»]/g, '');

      if (!text || text.length < 3) return;
      if (seen.has(text)) return;
      seen.add(text);
      result.push(text);
    });

    return result;
  }

  
  let keepAliveTimer = null;
  function startKeepAlive() {
    stopKeepAlive();
    keepAliveTimer = setInterval(() => {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 10000);
  }
  function stopKeepAlive() {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }

  
  function speakChunk(index) {
    if (index >= chunks.length) { stop(); return; }
    chunkIndex = index;

    const u = new SpeechSynthesisUtterance(chunks[index]);
    u.lang  = document.documentElement.lang || 'pt-BR';
    u.rate  = getRate();

    const voiceName = getVoiceName();
    if (voiceName) {
      const match = voices.find(v => v.name === voiceName);
      if (match) u.voice = match;
    }

    u.onstart = () => { isReading = true; isPaused = false; updateUI('playing'); };
    u.onend   = () => { if (isReading) speakChunk(chunkIndex + 1); };
    u.onerror = (e) => { if (e.error !== 'interrupted' && e.error !== 'canceled') stop(); };

    utterance = u;
    synth.speak(u);
  }

  
  function play() {
    if (isReading && !isPaused) return;
    if (isPaused && synth.paused) {
      synth.resume();
      isPaused = false;
      updateUI('playing');
      return;
    }
    synth.cancel();
    stopKeepAlive();
    chunks     = extractChunks();
    chunkIndex = 0;
    if (chunks.length === 0) { updateUI('idle'); return; }
    isReading  = true;
    isPaused   = false;
    startKeepAlive();
    speakChunk(0);
  }

  function pause() {
    if (!isReading || isPaused) return;
    synth.pause();
    isPaused = true;
    updateUI('paused');
  }

  function stop() {
    synth.cancel();
    stopKeepAlive();
    isReading  = false;
    isPaused   = false;
    utterance  = null;
    chunks     = [];
    chunkIndex = 0;
    updateUI('idle');
  }

  
  function updateUI(state) {
    const btnPlay   = document.getElementById('ttsPlay');
    const btnPause  = document.getElementById('ttsPause');
    const btnStop   = document.getElementById('ttsStop');
    const indicator = document.getElementById('ttsStatus');
    const progress  = document.getElementById('ttsProgress');

    if (btnPlay)  btnPlay.classList.toggle('active', state === 'playing');
    if (btnPause) btnPause.classList.toggle('active', state === 'paused');

    if (indicator) {
      const labels = { idle: '—', playing: '▶ Lendo...', paused: '⏸ Pausado' };
      indicator.textContent = labels[state] || '—';
      indicator.dataset.state = state;
    }

    if (progress && chunks.length > 0) {
      const pct = Math.round((chunkIndex / chunks.length) * 100);
      progress.style.width = state === 'idle' ? '0%' : pct + '%';
    } else if (progress) {
      progress.style.width = '0%';
    }
  }

  
  function populateVoices() {
    voices = synth.getVoices().filter(v => v.lang.startsWith('pt') || v.lang.startsWith('en'));
    if (voices.length === 0) voices = synth.getVoices();

    const select = document.getElementById('ttsVoiceSelect');
    if (!select) return;

    select.innerHTML = '';
    const saved = getVoiceName();
    voices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = v.name + (v.lang ? ` (${v.lang})` : '');
      if (v.name === saved) opt.selected = true;
      select.appendChild(opt);
    });
  }

  
  function initRateSlider() {
    const slider = document.getElementById('ttsRateSlider');
    const label  = document.getElementById('ttsRateLabel');
    if (!slider) return;
    slider.value = getRate();
    if (label) label.textContent = getRate() + 'x';
    slider.addEventListener('input', () => {
      const val = parseFloat(slider.value);
      localStorage.setItem(PREF_RATE, val);
      if (label) label.textContent = val.toFixed(1) + 'x';
    });
  }

  
  function init() {
    const btnPlay  = document.getElementById('ttsPlay');
    const btnPause = document.getElementById('ttsPause');
    const btnStop  = document.getElementById('ttsStop');

    if (btnPlay)  btnPlay.addEventListener('click',  play);
    if (btnPause) btnPause.addEventListener('click', pause);
    if (btnStop)  btnStop.addEventListener('click',  stop);
    const voiceSelect = document.getElementById('ttsVoiceSelect');
    if (voiceSelect) {
      voiceSelect.addEventListener('change', () => {
        localStorage.setItem(PREF_VOICE, voiceSelect.value);
      });
    }
    initRateSlider();
    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }
    window.addEventListener('beforeunload', stop);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pause();
    });

    updateUI('idle');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
