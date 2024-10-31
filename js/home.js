const audio = document.getElementById("musicData");
const fail = document.getElementById("musicDataMatch");
const match = document.getElementById("musicDataFailed");
const musicBtn = document.getElementById("soundIcon");
const openDialogButton = document.getElementById('openDialogButton');
const progressBar = document.getElementById('progressBar');
const scoreTxt = document.getElementById('totalScore');
const resetBtn = document.getElementById('resetBtn');



let turn = 0;
let prev = null;
let matchFound = 0;
let prevTarget = null;
let score = 0;


var maxMistakes = 5;
let currentMistakes = 0;



function closeDialog() {
    const dialogBox = document.getElementById('dialogBox');
    dialogBox.style.bottom = '-400px'; // Slide down out of view
    setTimeout(() => {
        dialogBox.style.display = 'none';
    }, 500);
}

document.getElementById('playButton').addEventListener('click', function() {
    const selectedLevel = document.querySelector('input[name="level"]:checked').value;
    const selectedCardType = document.querySelector('input[name="cardType"]:checked').value;
    
    console.log(`Selected Level: ${selectedLevel}`);
    console.log(`Selected Card Type: ${selectedCardType}`);
    if (selectedLevel==="easy" && selectedCardType==="numbers") {
        closeDialog()
        generateGrid(2,generateRandomElements(2));
        
    }else if (selectedLevel==="medium" && selectedCardType==="numbers") {
        closeDialog()
        generateGrid(4,generateRandomElements(8));
    }else if (selectedLevel==="hard" && selectedCardType==="numbers") {
        closeDialog()
        generateGrid(6,generateRandomElements(18));
    }else if (selectedLevel==="easy" && selectedCardType==="emoji") {
        closeDialog()
        generateGrid(2,randomEmoji(2));
        
    }else if (selectedLevel==="medium" && selectedCardType==="emoji") {
        closeDialog()
        generateGrid(4,randomEmoji(8));
    }else if (selectedLevel==="hard" && selectedCardType==="emoji") {
        closeDialog()
        generateGrid(6,randomEmoji(18));
    }
    
    
});

resetBtn.style.display = "none";
const progressBarContainer = document.getElementById('container');
openDialogButton.style.display = "inline-block";
if(localStorage.getItem("score")==null){
    localStorage.setItem("score",0)
}
scoreTxt.textContent = "SCORE: "+localStorage.getItem("score");


if (!audio.paused) {
    audio.pause()
    console.log("playing");
    
}else{
    audio.play()
}


function checkMusic() {
    if (!audio.paused) {
        audio.pause()
        musicBtn.style.color = "red";
        
    }else{
        audio.play()
        musicBtn.style.color = "white";
    }
}





function updateProgressBar(allowedMistakes, mistakesLeft) {
    const percentage = (mistakesLeft / allowedMistakes) * 100;
    progressBar.style.width = percentage + '%';
    progressBar.textContent = "LIFE❤️: "+mistakesLeft;
    if (percentage > 70) {
    progressBar.style.backgroundColor = 'green';
    } else if (percentage > 35) {
    progressBar.style.backgroundColor = 'yellow';
    progressBar.style.color = 'black';
    } else {
    progressBar.style.backgroundColor = 'red';
    }
}
function makeMistake() {
    if (currentMistakes < maxMistakes) {
    currentMistakes++;
    const mistakesLeft = maxMistakes - currentMistakes;
    // document.getElementById('mistakesLeft').textContent = mistakesLeft;
    updateProgressBar(maxMistakes, mistakesLeft);
    if (mistakesLeft === 0) {
        
        score = Math.floor((matchFound*5)/(maxMistakes-mistakesLeft));
        
        localStorage.setItem("score",parseInt(localStorage.getItem("score"))+score)
        Swal.fire({
            title: 'GAME OVER!',
            text: 'Score: '+score,
            icon: 'error',
            confirmButtonText: 'Reset Game'
          }).then((result) => {
            if(result.isConfirmed){
                window.location.reload();
            }
          }).catch((err) => {
            
          });
    }
    }
}


function generateGrid(size,arrData) {
    if (!audio.paused) {
        audio.pause()
        console.log("playing");
        
    }
    const gridSize = parseInt(size);
    if (gridSize%2!==0 || gridSize<=0 || gridSize>6) {
        alert("Please enter valid grid size ..even,>0 and <=6")
    }else{
    let randomArraySize = (gridSize*gridSize)/2;
    maxMistakes = randomArraySize;
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    let randomData = arrData;
    for (let i = 0; i < gridSize * gridSize; i++) {
      const flipContainer = document.createElement('div');
      flipContainer.classList.add('flip-container');
      const flipCard = document.createElement('div');
      flipCard.classList.add('flip-card');
      const front = document.createElement('div');
      front.classList.add('front');
      front.textContent = ``; 
      const back = document.createElement('div');
      back.classList.add('back');
      back.textContent = `${randomData[i]}`; 
      flipCard.appendChild(front);
      flipCard.appendChild(back);
      flipContainer.appendChild(flipCard);
      flipCard.addEventListener('click', function(e) {
        console.log(flipCard);
        
        flipCard.classList.toggle('flipped');
        if(turn==0){
            back.style.backgroundColor = 'rgb(17, 183, 78)';
        back.style.color = 'white';
        console.log(back.textContent);
        
        prev = back.textContent
        prevTarget = flipCard;
        flipCard.style.pointerEvents = 'none';
        turn++;
        }else if(turn==1){
            if (prev==back.textContent) {
                back.style.backgroundColor = 'rgb(17, 183, 78)';
                back.style.color = 'white';
                match.play()
                matchFound++;
                flipCard.style.pointerEvents = 'none';
                prevTarget.style.pointerEvents = 'none';
                turn=0;
                prev = null
                prevTarget = null;
                if(matchFound==randomArraySize){
                    if(currentMistakes==0){
                        score = (maxMistakes*5)/(currentMistakes+1);
                    }else{
                        score = (maxMistakes*5)/(currentMistakes);
                    }
                    
                    localStorage.setItem("score",parseInt(localStorage.getItem("score"))+Math.floor(score))
                    Swal.fire({
                        title: 'HURAAY! YOU HAVE SHARP MEMORY',
                        text: 'Score: '+score,
                        icon: 'success',
                        confirmButtonText: 'Reset Game'
                    }).then((result) => {
                        if(result.isConfirmed){
                            window.location.reload();
                        }
                    }).catch((err) => {
                        
                    });
                }
            }else{


                
        back.style.backgroundColor = 'rgb(252, 141, 141)';
                back.style.color = 'white';
                setTimeout(function () {
                    prevTarget.classList.toggle('flipped');
                    flipCard.classList.toggle('flipped');
                    prevTarget.style.pointerEvents = 'all';
                    fail.play()
                turn=0;
                prev = null
                makeMistake()

                },300)
                
            }
        }
        
        console.log("found"+matchFound);
      });
      gridContainer.appendChild(flipContainer);
// document.getElementById('mistakesLeft').textContent = maxMistakes;


updateProgressBar(maxMistakes, maxMistakes);
progressBarContainer.style.display = 'block';
openDialogButton.style.display = "none";
resetBtn.style.display = "inline-block";
    }
    }
    
  }


function reset() {
    window.location.reload()
}

function generateUniqueEmojis(size) {
    const emojis = [
        '😀', '😂', '😅', '😇', '😍', '😎', '😜', '😢', '😡', '🤔',
        '👍', '👋', '🎉', '🎈', '🌟', '🔥', '💧', '🍀', '🌈', '🌍',
        '🐶', '🐱', '🐻', '🐼', '🐨', '🦁', '🐯', '🦊', '🐸', '🐵',
        '🍎', '🍌', '🍉', '🍇', '🍓', '🍍', '🥥', '🍑', '🍒', '🥭',
        '🌶️', '🥕', '🥬', '🌽', '🍅', '🥔', '🍠', '🍳', '🍔', '🍕'
    ];
    const shuffledEmojis = emojis.sort(() => 0.5 - Math.random());
    
    return shuffledEmojis.slice(0, size);
}


function randomEmoji(size) {
    const data = generateUniqueEmojis(size)
    let newArr = [...data,...data]

    for (let i = newArr.length-1; i >0; i--) {
        const j = Math.floor(Math.random()*(i+1));

        [newArr[i],newArr[j]] = [newArr[j],newArr[i]]
        
    }

    return newArr;
}


document.getElementById('openDialogButton').addEventListener('click', function() {
    const dialogBox = document.getElementById('dialogBox');
    dialogBox.style.display = 'block';
    setTimeout(() => {
        dialogBox.style.bottom = '50%';
    }, 10);
});

document.getElementById('closeBtn').addEventListener('click', function() {
    const dialogBox = document.getElementById('dialogBox');
    dialogBox.style.bottom = '-400px'; // Slide down out of view
    setTimeout(() => {
        dialogBox.style.display = 'none';
    }, 500);
});





  function generateRandomElements(limit) {
    const min = 1;
    const max = 99;

    const uniqueSet = new Set();

    while (uniqueSet.size < limit) {
        let randomElement = Math.floor(Math.random()*(max-min+1))+min;

        uniqueSet.add(randomElement);
    }

    let arr = Array.from(uniqueSet);
    let newArr = [...arr,...arr]

    for (let i = newArr.length-1; i >0; i--) {
        const j = Math.floor(Math.random()*(i+1));

        [newArr[i],newArr[j]] = [newArr[j],newArr[i]]
        
    }
    return newArr;
    
    
}