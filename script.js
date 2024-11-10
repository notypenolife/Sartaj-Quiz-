const foodItems = [
    "Apple", "Banana", "Carrot Sticks", "Doritos", "Eclairs", "Fruit Salad", 
    "Granola Bar", "Ham Sandwich", "Ice Cream", "Jellybeans", "Kiwi", "Lemonade", 
    "Muffin", "Noodles", "Orange", "Pineapple", "Quiche", "Raisin Box", "Smoothie", "Tacos"
];

let usedFoodItems = [];
let currentFoodItems = [];
let currentIndex = 0;

const quizElements = {
    question: document.getElementById("question"),
    option1: document.getElementById("option1"),
    option2: document.getElementById("option2"),
    next: document.getElementById("next"),
    progress: document.getElementById("progress"),
    retake: document.getElementById("retake"),
    result: document.getElementById("result"),
    resultBox: document.getElementById("resultbox"),
    quizSet: document.getElementById("quizset"),
    tracker: document.getElementById("tracker"),
    timer: document.getElementById("timer"),
    congrats: document.getElementById("congrats")
};

let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let timerInterval;

const congratsMessages = [
    "Awesome Choice!", "Tasty!", "Great Pick!", "Superb!", "Nice One!",
    "Well Done!", "Fantastic!", "Splendid!", "Top Notch!", "Way to Go!",
    "Excellent!", "Brilliant!", "Cool Choice!", "You Rock!", "Keep Going!",
    "On Point!", "Sweet!", "Marvelous!", "Spot On!", "Good Job!"
];

function initializeQuiz() {
    shuffleFoodItems();
    createTracker();
    loadQuestion();
    addEventListeners();
    startTimer();
    setupCongrats();
}

function shuffleFoodItems() {
    foodItems.sort(() => Math.random() - 0.5);
}

function createTracker() {
    for (let i = 0; i < 10; i++) {
        const trackerItem = document.createElement('div');
        trackerItem.className = 'num';
        trackerItem.textContent = i + 1;
        quizElements.tracker.appendChild(trackerItem);
    }
}

function loadQuestion() {
    if (currentIndex >= foodItems.length) {
        showResult();
        return;
    }
    
    currentFoodItems = [foodItems[currentIndex], foodItems[currentIndex + 1]];
    currentIndex += 2;
    quizElements.question.textContent = `Question ${currentQuestion + 1}:`;
    quizElements.option1.textContent = currentFoodItems[0];
    quizElements.option2.textContent = currentFoodItems[1];
    updateProgress();
    resetOptionStyles();
    updateTracker();
}

function updateProgress() {
    quizElements.progress.textContent = `Question ${currentQuestion + 1} of 10`;
}

function resetOptionStyles() {
    quizElements.option1.classList.remove('selected');
    quizElements.option2.classList.remove('selected');
    selectedOption = null;
}

function updateTracker() {
    const trackerItems = quizElements.tracker.getElementsByClassName('num');
    Array.from(trackerItems).forEach((item, index) => {
        if (index < currentQuestion) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
        item.classList.toggle('active', index === currentQuestion);
    });
}

function selectOption(optionElement, optionNumber) {
    resetOptionStyles();
    optionElement.classList.add('selected');
    selectedOption = optionNumber;
}

function nextQuestion() {
    if (selectedOption === null) {
        alert("Please select an option before proceeding.");
        return;
    }
    score++;
    usedFoodItems.push(currentFoodItems[selectedOption - 1]);
    animateTransition(() => {
        currentQuestion++;
        if (currentQuestion < 10) {
            loadQuestion();
        } else {
            showResult();
        }
    });
    showCongratsMessage();
}

function animateTransition(callback) {
    quizElements.quizSet.classList.add('swipe-left');
    setTimeout(() => {
        callback();
        quizElements.quizSet.classList.remove('swipe-left');
        quizElements.quizSet.classList.add('swipe-in');
        setTimeout(() => {
            quizElements.quizSet.classList.remove('swipe-in');
        }, 500);
    }, 500);
}

function showResult() {
    clearInterval(timerInterval);
    quizElements.quizSet.classList.add('hidden');
    quizElements.resultBox.classList.remove('hidden');
    quizElements.result.textContent = `You completed the quiz! You made ${score} choices.`;
}

function retakeQuiz() {
    currentQuestion = 0;
    score = 0;
    usedFoodItems = [];
    currentIndex = 0;
    shuffleFoodItems();
    quizElements.quizSet.classList.remove('hidden');
    quizElements.resultBox.classList.add('hidden');
    resetOptionStyles();
    loadQuestion();
    startTimer();
}

function addEventListeners() {
    quizElements.option1.addEventListener("click", () => selectOption(quizElements.option1, 1));
    quizElements.option2.addEventListener("click", () => selectOption(quizElements.option2, 2));
    quizElements.next.addEventListener("click", nextQuestion);
    quizElements.retake.addEventListener("click", retakeQuiz);
}

function startTimer() {
    let seconds = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        quizElements.timer.textContent = `Time: ${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function setupCongrats() {
    quizElements.congrats.id = 'congrats';
    quizElements.quizSet.appendChild(quizElements.congrats);
}

function showCongratsMessage() {
    const message = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
    quizElements.congrats.textContent = message;
    quizElements.congrats.style.opacity = 1;
    setTimeout(() => {
        quizElements.congrats.style.opacity = 0;
    }, 1000);
}

initializeQuiz();
