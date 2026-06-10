const CORRECT_ANSWER = 'Pikachu';
const buttons = document.querySelectorAll('.choice-btn');
const resultMessage = document.getElementById('result-message');

buttons.forEach(button => {
  button.addEventListener('click', function() {
    const selectedText = this.textContent;
    
    // Disable all buttons to freeze choice selection
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedText === CORRECT_ANSWER) {
      this.classList.add('correct');
      resultMessage.textContent = 'Correct! It is Pikachu!';
      resultMessage.style.color = '#28a745';
    } else {
      this.classList.add('incorrect');
      resultMessage.textContent = 'Wrong! It is Pikachu!';
      resultMessage.style.color = '#dc3545';
      
      // Also highlight correct answer button
      buttons.forEach(btn => {
        if (btn.textContent === CORRECT_ANSWER) {
          btn.classList.add('correct');
        }
      });
    }
  });
});
