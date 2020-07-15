var gameCards = document.getElementById('gameCards');
var firstCardClicked = null;
var secondCardClicked = null;
var firstCardClasses = null;
var secondCardClasses = null;
var maxMatches = 9;
var matches = 0;
var container = document.querySelector('.container')
var modalOverlay = document.querySelector('.modal-overlay');
var modalContent = document.querySelector('.modal-content h2');
var attempts = 0;
var gamesPlayed = 0;
var gamesPlayedElement = document.getElementById('gamesPlayed');
var attemptsElement= document.getElementById('attempts');
var accuracyElement = document.getElementById('accuracy');
var normalButton = document.getElementById('normal');
var expertButton = document.getElementById('expert');
var modalParagraph = document.getElementById('modalParagraph')
var timeLeft = document.getElementById('timeLeft')
var classNames = ['cauldron', 'cauldron', 'crystal', 'crystal', 'flowers', 'flowers', 'lavender', 'lavender', 'mushroom', 'mushroom', 'potion', 'potion', 'runes', 'runes', 'salt', 'salt', 'skull', 'skull']
var num;
var id = setInterval(countdown, 100);
var moodMusic = document.getElementById('moodMusic');
var matchAudio = document.getElementById('match');
var noMatchAudio = document.getElementById('noMatch')
var loseAudio = document.getElementById('lose');
var flipAudio = document.getElementById('flip');
var soundIcon = document.getElementById('soundIcon');
var mainModal = document.getElementById('mainModal');
var soundControls = document.getElementById('soundControls');
var backToGame = document.getElementById('backToGame');
var backgoundMusic = document.getElementById('backgroundMusic')
var soundEffects = document.getElementById('soundEffects')
var backgoundMusicSwitch = document.getElementById('backgroundMusicSwitch')
var soundEffectsSwitch = document.getElementById('soundEffectsSwitch')

normalButton.addEventListener('click', function() {
  if (container.className.includes('hidden')) {
    num = 600;
    init();
  } else {
    resetGame(600);
  }
});

expertButton.addEventListener('click', function () {
  if (container.className.includes('hidden')) {
    num = 400;
    init();
  } else {
    resetGame(400);
  }
});

soundIcon.addEventListener('click', soundModal);

backToGame.addEventListener('click', resumeTimer);

backgoundMusic.addEventListener('click', toggleBackgroundMusic);

soundEffects.addEventListener('click', toggleSoundEffects)

function init() {
  matchAudio.muted = true;
  noMatchAudio.muted = true;
  loseAudio.muted = true;
  flipAudio.muted = true;
  shuffleClassNames();
  createCards();
  timeLeft.textContent = (num / 10).toFixed(1) + "s";
  container.classList.remove('hidden');
  modalOverlay.classList.add('hidden');
  gameCards.addEventListener('click', handleClick);
}

function handleClick(event) {
  if(event.target.className.indexOf("card-back") === -1) {
    return;
  }
  matchAudio.pause();
  matchAudio.currentTime = 0;
  flipAudio.play();
  event.target.className += ' hidden';
  if (!firstCardClicked) {
    firstCardClicked = event.target;
    firstCardClasses = firstCardClicked.nextElementSibling.className;
  } else {
    secondCardClicked = event.target;
    secondCardClasses = secondCardClicked.nextElementSibling.className;
    gameCards.removeEventListener("click", handleClick);
    attempts++;
    if (firstCardClasses === secondCardClasses){
      if (firstCardClasses.includes('cauldron') && secondCardClasses.includes('cauldron') && matches < 8) {
        firstCardClicked = null;
        secondCardClicked = null;
        loseGame();
      } else {
        matchAudio.play();
        matches++;
        displayStats();
        if (matches === maxMatches) {
          if (soundEffectsSwitch.textContent === 'Off' && backgoundMusicSwitch.textContent === 'On') {
            matchAudio.muted = false;
            matchAudio.play();
          }
          clearInterval(id);
          modalOverlay.classList.remove('hidden');
          modalContent.textContent = "Congratulations! You've found all of the ingredients";
          modalParagraph.textContent = "Want to try to grab more?";
          setTimeout(function() {
            moodMusic.pause()
            moodMusic.currentTime = 0;
          }, 1000);
        }
        gameCards.addEventListener('click', handleClick);
        firstCardClicked = null;
        secondCardClicked = null;
      }
    } else {
      noMatchAudio.play();
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

function resetGame(time) {
  attempts = 0;
  matches = 0;
  gamesPlayed++;
  moodMusic.muted = false;
  if (backgoundMusicSwitch.textContent === 'On') {
    moodMusic.play();
  }
  if (soundEffectsSwitch.textContent === 'On') {
    matchAudio.muted = false;
    loseAudio.muted = false;
    flipAudio.muted = false;
  }
  soundIcon.className = 'fas fa-volume-up'
  displayStats();
  resetCards();
  modalOverlay.classList.add('hidden');
  shuffleClassNames();
  createCards();
  num = time;
  id = setInterval(countdown, 100);
  gameCards.addEventListener('click', handleClick);
}

function resetCards() {
  var hiddenCards = document.querySelectorAll('.card-back');
  for (var i = 0; i < hiddenCards.length; i++) {
    hiddenCards[i].classList.remove('hidden');
  }
}


function shuffleClassNames() {
  for (var i = 0; i < classNames.length; i++) {
    var random = Math.floor(Math.random() * classNames.length);
    var placeholder = classNames[i];
    classNames[i] = classNames[random];
    classNames[random] = placeholder;
  }
}

function createCards() {
  gameCards.innerHTML = '';
  for (var i = 0; i < classNames.length; i++) {
    var cardContainer = document.createElement('div');
    cardContainer.className = 'card col-2';
    var frontCard = document.createElement('div');
    frontCard.className = 'card-front ' + classNames[i];
    var backCard = document.createElement('div');
    backCard.className = 'card-back';
    cardContainer.append(backCard);
    cardContainer.append(frontCard);
    gameCards.append(cardContainer);
  }
}

function countdown() {
  if (num !== 'undefined') {
    if (num === 0) {
      loseGame();
    } else {
      timeLeft.textContent = (num / 10).toFixed(1) + "s";
      num--;
    }
  }
}

function loseGame() {
  moodMusic.pause();
  moodMusic.currentTime = 0;
  loseAudio.play();
  clearInterval(id);
  timeLeft.textContent = (num / 10).toFixed(1) + "s";
  modalOverlay.classList.remove('hidden');
  modalContent.textContent = 'She found you!'
  modalParagraph.textContent = 'Want to try again?';
}

function soundModal() {
  mainModal.classList.add('hidden');
  modalOverlay.classList.remove('hidden');
  soundControls.classList.remove('hidden');
  clearInterval(id);
}

function toggleBackgroundMusic() {
  if (backgoundMusicSwitch.textContent === "Off") {
    moodMusic.muted = false;
    moodMusic.play();
    backgoundMusicSwitch.textContent = 'On';
    loseAudio.muted = false;
  } else {
    loseAudio.muted = true;
    moodMusic.pause();
    moodMusic.currentTime = 0;
    backgoundMusicSwitch.textContent = 'Off';
  }
}

function toggleSoundEffects() {
  if (soundEffectsSwitch.textContent === "Off") {
    matchAudio.muted = false;
    loseAudio.muted = false;
    flipAudio.muted = false;
    soundEffectsSwitch.textContent = 'On';
  } else {
    matchAudio.muted = true;
    loseAudio.muted = true;
    flipAudio.muted = true;
    soundEffectsSwitch.textContent = 'Off';
  }
}

function resumeTimer() {
  id = setInterval(countdown, 100);
  modalOverlay.classList.add('hidden');
  soundControls.classList.add('hidden');
  mainModal.classList.remove('hidden');
}
