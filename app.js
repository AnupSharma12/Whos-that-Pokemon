const TOTAL_POKEMON = 151;
let pokemonList = [];
let targetPokemon = null;
let choices = [];
let isLocked = false; // Lock interactions during reveal state

const imageEl = document.getElementById('pokemon-image');
const loaderEl = document.getElementById('loader');
const resultMessage = document.getElementById('result-message');
const buttons = document.querySelectorAll('.choice-btn');

async function initGame() {
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
  
  // Set image to silhouette and hide it
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
    
    // Reveal Silhouette
    imageEl.className = 'pokemon-image revealed';
    
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedName === correctAnswer) {
      this.classList.add('correct');
      resultMessage.textContent = `Correct! It's ${correctAnswer.toUpperCase()}!`;
      resultMessage.style.color = '#00f0ad';
    } else {
      this.classList.add('incorrect');
      resultMessage.textContent = `Wrong! It's ${correctAnswer.toUpperCase()}!`;
      resultMessage.style.color = '#ff3c5a';
      
      buttons.forEach((btn, idx) => {
        if (choices[idx] === correctAnswer) {
          btn.classList.add('correct');
        }
      });
    }
    
    // Auto progress to next round after 2.5s
    setTimeout(startNewRound, 2500);
  });
});

initGame();
