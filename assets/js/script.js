var gameCards = document.getElementById('gameCards');
var firstCardClicked = null;
var secondCardClicked = null;
var firstCardClasses = null;
var secondCardClasses = null;
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
    if (firstCardClasses === secondCardClasses){
      gameCards.addEventListener('click', handleClick);
      firstCardClicked = null;
      secondCardClicked = null;
    } else {
      setTimeout(function() {
        firstCardClicked.classList.remove('hidden');
        secondCardClicked.classList.remove('hidden');
        gameCards.addEventListener('click', handleClick);
        firstCardClicked = null;
        secondCardClicked = null;
      }, 1500)
    }
  }
}
