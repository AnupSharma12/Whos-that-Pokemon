// Streaks JS Setup
const TOTAL_POKEMON = 151;
let pokemonList = [];
let targetPokemon = null;
let choices = [];
let isLocked = false;

// Score and Streak state
let score = 0;
let streak = 0;
let highScore = parseInt(localStorage.getItem('steps_high_score_s')) || 0;

const imageEl = document.getElementById('pokemon-image');
const loaderEl = document.getElementById('loader');
const resultMessage = document.getElementById('result-message');
const buttons = document.querySelectorAll('.choice-btn');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const highScoreEl = document.getElementById('high-score');

function updateScores() {
  scoreEl.textContent = String(score).padStart(2, '0');
  highScoreEl.textContent = String(highScore).padStart(2, '0');
  streakEl.textContent = `x${streak}`;
}

async function initGame() {
  updateScores();
  
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
  
  imageEl.className = 'pokemon-image silhouette hidden';
  loaderEl.classList.remove('hidden');
  
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
      
      buttons.forEach((btn, idx) => {
        btn.textContent = choices[idx];
        btn.disabled = false;
      });
    };
  } catch (error) {
    console.error(error);
  }
}

buttons.forEach((button, index) => {
  button.addEventListener('click', function() {
    if (isLocked) return;
    isLocked = true;
    
    const selectedName = choices[index];
    const correctAnswer = targetPokemon.name;
    
    imageEl.className = 'pokemon-image revealed';
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedName === correctAnswer) {
      this.classList.add('correct');
      resultMessage.textContent = `Correct! It's ${correctAnswer.toUpperCase()}!`;
      resultMessage.style.color = '#00f0ad';
      
      // Streak Multiplier math
      streak++;
      score += 10 * streak;
      
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('steps_high_score_s', highScore);
      }
      
      // Trigger CSS pop animation on streak
      streakEl.classList.add('streak-active');
      setTimeout(() => streakEl.classList.remove('streak-active'), 400);
    } else {
      this.classList.add('incorrect');
      resultMessage.textContent = `Wrong! It's ${correctAnswer.toUpperCase()}!`;
      resultMessage.style.color = '#ff3c5a';
      
      // Reset streak and score
      streak = 0;
      score = 0;
      
      buttons.forEach((btn, idx) => {
        if (choices[idx] === correctAnswer) {
          btn.classList.add('correct');
        }
      });
    }
    
    updateScores();
    setTimeout(startNewRound, 2500);
  });
});

initGame();
