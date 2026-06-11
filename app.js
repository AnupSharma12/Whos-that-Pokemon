const TOTAL_POKEMON = 151;
let pokemonList = [];
let targetPokemon = null;
let choices = [];
let isLocked = false;
let hintUsed = false;
let soundEnabled = true;

// Score and Streak state
let score = 0;
let streak = 0;
let highScore = parseInt(localStorage.getItem('steps_high_score_au')) || 0;

const imageEl = document.getElementById('pokemon-image');
const loaderEl = document.getElementById('loader');
const resultMessage = document.getElementById('result-message');
const buttons = document.querySelectorAll('.choice-btn');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const highScoreEl = document.getElementById('high-score');

const statusMessage = document.getElementById('status-message');
const hintDisplay = document.getElementById('hint-display');
const hintText = document.getElementById('hint-text');
const hintBtn = document.getElementById('hint-btn');
const skipBtn = document.getElementById('skip-btn');
const soundBtn = document.getElementById('sound-btn');

// ==========================================
// Sound Synthesis Engine
// ==========================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playNotes(notes) {
  if (!soundEnabled) return;
  try {
    initAudio();
    const now = audioCtx.currentTime;
    notes.forEach(note => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = note.type || 'sine';
      osc.frequency.setValueAtTime(note.freq, now + (note.delay || 0));
      gain.gain.setValueAtTime(0.08, now + (note.delay || 0));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (note.delay || 0) + note.duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + (note.delay || 0));
      osc.stop(now + (note.delay || 0) + note.duration);
    });
  } catch(e) {
    console.warn(e);
  }
}

const AudioSFX = {
  click: () => playNotes([{ freq: 400, duration: 0.08, type: 'triangle' }]),
  win: () => playNotes([
    { freq: 523, duration: 0.08, delay: 0 },
    { freq: 659, duration: 0.08, delay: 0.08 },
    { freq: 784, duration: 0.18, delay: 0.16 }
  ]),
  lose: () => playNotes([
    { freq: 220, duration: 0.1, delay: 0, type: 'sawtooth' },
    { freq: 150, duration: 0.3, delay: 0.08, type: 'sawtooth' }
  ])
};

function updateScores() {
  scoreEl.textContent = String(score).padStart(2, '0');
  highScoreEl.textContent = String(highScore).padStart(2, '0');
  streakEl.textContent = `x${streak}`;
}

async function initGame() {
  updateScores();
  hintBtn.addEventListener('click', revealHint);
  skipBtn.addEventListener('click', skipRound);
  
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = `Sound: ${soundEnabled ? 'ON' : 'OFF'}`;
    if (soundEnabled) {
      initAudio();
      AudioSFX.click();
    }
  });
  
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`);
    const data = await response.json();
    pokemonList = data.results;
    
    startNewRound();
  } catch (error) {
    console.error(error);
    resultMessage.textContent = 'API Error.';
  }
}

async function startNewRound() {
  resultMessage.textContent = '';
  isLocked = false;
  hintUsed = false;
  
  imageEl.className = 'pokemon-image silhouette hidden';
  loaderEl.classList.remove('hidden');
  hintDisplay.classList.add('hidden');
  statusMessage.textContent = 'Make your guess!';
  hintBtn.disabled = true;
  skipBtn.disabled = true;
  
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.textContent = 'Loading...';
    btn.className = 'choice-btn';
  });

  const targetId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
  
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${targetId}`);
    targetPokemon = await response.json();
    
    const distractorNames = [];
    while (distractorNames.length < 3) {
      const randIndex = Math.floor(Math.random() * pokemonList.length);
      const possibleName = pokemonList[randIndex].name;
      if (possibleName !== targetPokemon.name && !distractorNames.includes(possibleName)) {
        distractorNames.push(possibleName);
      }
    }
    
    choices = [targetPokemon.name, ...distractorNames];
    choices.sort(() => Math.random() - 0.5);
    
    imageEl.src = targetPokemon.sprites.other['official-artwork'].front_default || targetPokemon.sprites.front_default;
    
    imageEl.onload = () => {
      loaderEl.classList.add('hidden');
      imageEl.classList.remove('hidden');
      hintBtn.disabled = false;
      skipBtn.disabled = false;
      
      buttons.forEach((btn, idx) => {
        btn.textContent = choices[idx];
        btn.disabled = false;
      });
    };
  } catch (error) {
    console.error(error);
  }
}

function revealHint() {
  if (isLocked || hintUsed || !targetPokemon) return;
  hintUsed = true;
  hintBtn.disabled = true;
  AudioSFX.click();
  
  const types = targetPokemon.types.map(t => t.type.name).join(', ');
  hintText.textContent = `Type: ${types}`;
  hintDisplay.classList.remove('hidden');
  statusMessage.textContent = 'Hint revealed!';
}

function skipRound() {
  if (isLocked || !targetPokemon) return;
  isLocked = true;
  AudioSFX.click();
  
  hintBtn.disabled = true;
  skipBtn.disabled = true;
  buttons.forEach(btn => btn.disabled = true);
  
  const correctAnswer = targetPokemon.name;
  imageEl.className = 'pokemon-image revealed';
  
  buttons.forEach((btn, idx) => {
    if (choices[idx] === correctAnswer) {
      btn.classList.add('correct');
    } else {
      btn.style.opacity = '0.4';
    }
  });
  
  streak = 0;
  score = 0;
  updateScores();
  
  resultMessage.textContent = `Skipped! It was ${correctAnswer.toUpperCase()}!`;
  resultMessage.style.color = '#ffcb05';
  
  setTimeout(startNewRound, 2500);
}

buttons.forEach((button, index) => {
  button.addEventListener('click', function() {
    if (isLocked) return;
    isLocked = true;
    
    hintBtn.disabled = true;
    skipBtn.disabled = true;
    
    const selectedName = choices[index];
    const correctAnswer = targetPokemon.name;
    
    imageEl.className = 'pokemon-image revealed';
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedName === correctAnswer) {
      this.classList.add('correct');
      resultMessage.textContent = `Correct! It's ${correctAnswer.toUpperCase()}!`;
      resultMessage.style.color = '#00f0ad';
      
      streak++;
      score += 10 * streak;
      
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('steps_high_score_au', highScore);
      }
      
      streakEl.classList.add('streak-active');
      setTimeout(() => streakEl.classList.remove('streak-active'), 400);
      
      AudioSFX.win();
    } else {
      this.classList.add('incorrect');
      resultMessage.textContent = `Wrong! It's ${correctAnswer.toUpperCase()}!`;
      resultMessage.style.color = '#ff3c5a';
      
      streak = 0;
      score = 0;
      
      buttons.forEach((btn, idx) => {
        if (choices[idx] === correctAnswer) {
          btn.classList.add('correct');
        } else if (idx !== index) {
          btn.style.opacity = '0.4';
        }
      });
      
      AudioSFX.lose();
    }
    
    updateScores();
    setTimeout(startNewRound, 2500);
  });
});

initGame();
