document.getElementById('guess-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const userGuess = document.getElementById('guess-input').value.trim().toLowerCase();
  
  if (userGuess === 'pikachu') {
    alert('Correct! It is Pikachu!');
  } else {
    alert('Incorrect! Try again.');
  }
});
