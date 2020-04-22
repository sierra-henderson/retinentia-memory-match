var gameCards = document.getElementById('gameCards');
var firstCardClicked = null;
var secondCardClicked = null;
var firstCardClasses = null;
var secondCardClasses = null;
var maxMatches = 9;
var matches = 0;
var modalOverlay = document.querySelector('.modal-overlay');
var attempts = 0;
var gamesPlayed = 0;
var gamesPlayedElement = document.getElementById('gamesPlayed');
var attemptsElement= document.getElementById('attempts');
var accuracyElement = document.getElementById('accuracy');
var modalButton = document.getElementById('modalButton');


gameCards.addEventListener('click', handleClick);

function handleClick(event) {
  if(event.target.className.indexOf("card-back") === -1) {
    return;
  }
  event.target.className += ' hidden';
  if (!firstCardClicked) {
    firstCardClicked = event.target;
    firstCardClasses = firstCardClicked.previousElementSibling.className;
  } else {
    secondCardClicked = event.target;
    secondCardClasses = secondCardClicked.previousElementSibling.className;
    gameCards.removeEventListener("click", handleClick);
    attempts++;

    if (firstCardClasses === secondCardClasses){
      matches++;
      displayStats();
      if (matches === maxMatches) {
        modalOverlay.classList.remove('hidden');
      }
      gameCards.addEventListener('click', handleClick);
      firstCardClicked = null;
      secondCardClicked = null;
    } else {
      setTimeout(function() {
        displayStats();
        firstCardClicked.classList.remove('hidden');
        secondCardClicked.classList.remove('hidden');
        gameCards.addEventListener('click', handleClick);
        firstCardClicked = null;
        secondCardClicked = null;
      }, 1500)
    }
  }
}

function displayStats() {
  gamesPlayedElement.textContent = gamesPlayed;
  attemptsElement.textContent = attempts;
  accuracyElement.textContent = calculateAccuracy(attempts, matches);
}

function calculateAccuracy(attempts, matches) {
  if (attempts === 0) {
    return 0 + "%";
  }
  return Math.trunc(matches / attempts * 100) + "%";
}

function resetGame() {
  attempts = 0;
  matches = 0;
  gamesPlayed++;
  displayStats();
  resetCards();
  modalOverlay.classList.add('hidden');
}

function resetCards() {
  var hiddenCards = document.querySelectorAll('.card-back');
  for (var i = 0; i < hiddenCards.length; i++) {
    hiddenCards[i].classList.remove('hidden');
  }
}

modalButton.addEventListener('click', resetGame);
