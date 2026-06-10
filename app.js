const TOTAL_POKEMON = 151;
let pokemonList = [];
let targetPokemon = null;
let choices = [];

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
  
  // Show loader, hide image, disable choice buttons
  loaderEl.classList.remove('hidden');
  imageEl.classList.add('hidden');
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
    
    // Set source. Show image and hide loader only when loaded
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
