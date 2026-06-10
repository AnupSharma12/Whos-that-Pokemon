const TOTAL_POKEMON = 151; // Target Generation 1
let pokemonList = [];
let targetPokemon = null;
let choices = [];

const imageEl = document.getElementById('pokemon-image');
const resultMessage = document.getElementById('result-message');
const buttons = document.querySelectorAll('.choice-btn');

async function initGame() {
  try {
    // 1. Fetch names for selection
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`);
    const data = await response.json();
    pokemonList = data.results;
    
    // 2. Start round
    startNewRound();
  } catch (error) {
    console.error('API Error:', error);
    resultMessage.textContent = 'API load error. Refresh page.';
  }
}

async function startNewRound() {
  resultMessage.textContent = '';
  
  // Pick random target
  const targetId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
  
  try {
    // Fetch target details
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${targetId}`);
    targetPokemon = await response.json();
    
    // Pick 3 distractors
    const distractorNames = [];
    while (distractorNames.length < 3) {
      const randIndex = Math.floor(Math.random() * pokemonList.length);
      const possibleName = pokemonList[randIndex].name;
      if (possibleName !== targetPokemon.name && !distractorNames.includes(possibleName)) {
        distractorNames.push(possibleName);
      }
    }
    
    // Shuffle choices
    choices = [targetPokemon.name, ...distractorNames];
    choices.sort(() => Math.random() - 0.5);
    
    // Render
    buttons.forEach((btn, idx) => {
      btn.textContent = choices[idx];
      btn.className = 'choice-btn';
      btn.disabled = false;
    });
    
    imageEl.src = targetPokemon.sprites.other['official-artwork'].front_default || targetPokemon.sprites.front_default;
    imageEl.classList.remove('hidden');
  } catch (error) {
    console.error('Error starting round:', error);
  }
}

buttons.forEach((button, index) => {
  button.addEventListener('click', function() {
    const selectedName = choices[index];
    const correctAnswer = targetPokemon.name;
    
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedName === correctAnswer) {
      this.classList.add('correct');
      resultMessage.textContent = `Correct! It is ${correctAnswer.toUpperCase()}!`;
      resultMessage.style.color = '#28a745';
    } else {
      this.classList.add('incorrect');
      resultMessage.textContent = `Incorrect! It is ${correctAnswer.toUpperCase()}!`;
      resultMessage.style.color = '#dc3545';
      
      buttons.forEach((btn, idx) => {
        if (choices[idx] === correctAnswer) {
          btn.classList.add('correct');
        }
      });
    }
  });
});

initGame();
