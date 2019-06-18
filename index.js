'use strict';

let questionNumber;
let score = 0;

let currentState = {
  questions: {
    currQnumber: 0,
    currQuestion: STORE[0].question,
    currAnswers: STORE[0].answers,
    currCorrectAnswer: STORE[0].correctAnswer,
    currCorrect: 0
  },
  startBtnVisible: true,
  submitClicked: false,
  userAnswerCorrect: false,
  nextBtnClicked: false
};

function updateCurrentState(questionNumber) {
    const questions = currentState.questions;
    questions.currQnumber = questionNumber;
    questions.currQuestion = STORE[questionNumber].question;
    questions.currAnswers = STORE[questionNumber].answers;
    questions.currCorrectAnswer = STORE[questionNumber].correctAnswer;
  }

function handleStartBtnClicked() {
    $('#startbutton').on('click', function() {
      currentState.startBtnVisible = false;
      renderView();
    });
  }

  function startQuiz() {
    $('#startbutton').remove();
    $('#question-box').css('display', 'block');
    questionNumber = 0;
    $('.questionNumber').text(1);
    $('.score').text(0);
  }

  function renderView() {
    if (!currentState.startBtnVisible && questionNumber === undefined) {
      startQuiz();
      $('#question-box').html(generateQuestion());
    } else if (currentState.submitClicked) {
      displayQuestionResult(currentState.userAnswerCorrect);
    } else if (currentState.nextBtnClicked && questionNumber < STORE.length) {
      $('#question-box').html(generateQuestion());
    } else if (currentState.nextBtnClicked && questionNumber >= STORE.length) {
      Results();
    } else {
      $('.questionNumber').text(questionNumber + 1);
      $('.score').text(0);
      $('.progress-bar').css('width', '0');
      $('#question-box').html(generateQuestion());
    }
  }

  function generateQuestion() {
    let questions = currentState.questions;
    return `<div class="question-${questionNumber}">
      <h2 class="trivia-question">${questions.currQuestion}</h2>
      <form id="questionForm">
      <fieldset>
      <div class='answerBox'>
      <label class="answerOption">
      <input type="radio" value="${
    questions.currAnswers[0]
  }" name="answer" required >
      <span>${questions.currAnswers[0]}</span> 
      </label></div>
      <div class='answerBox'>
      <label class="answerOption">
      <input type="radio" value="${
    questions.currAnswers[1]
  }" name="answer" required >
      <span>${questions.currAnswers[1]}</span>
      </label></div>
      <div class='answerBox'>
      <label class="answerOption">
      <input type="radio" value="${
    questions.currAnswers[2]
  }" name="answer" required >
      <span>${questions.currAnswers[2]}</span>
      </label></div>
      <div class='answerBox'>
      <label class="answerOption">
      <input type="radio" value="${
    questions.currAnswers[3]
  }" name="answer" required >
      <span>${questions.currAnswers[3]}</span>
      </label></div>
      <button type="submit" class="submitButton">Submit</button>
      </fieldset>
      </form>
      </div>`;
    
  }
  
  function handleClickSubmitBtn() {
    $('#question-box').on('submit',function(event) {
      event.preventDefault();
      checkAnswer();
    });
  }
  
  function checkAnswer() {
    currentState.submitClicked = true;
    let selectedAnswer = $('input[type = "radio"]:checked').val();
    let width = questionNumber + 1;
    $('.progress-bar').css('width', `${width * 10}%`);
    if (selectedAnswer === currentState.questions.currCorrectAnswer) {
      currentState.questions.currCorrect++;
      currentState.userAnswerCorrect = true;
      $('.score').text(currentState.questions.currCorrect);
    }
    renderView();
    currentState.userAnswerCorrect = false;
    currentState.submitClicked = false;
  }
  
  function displayQuestionResult(result) {
    if (result) {
      $(`.question-${questionNumber}`).css('display', 'none');
      $('#question-box').html(`
    <p class="answerText"> Correct! </p> 
    <button type="submit" class="nextButton">Next</button>`);
    } else {
      $(`.question-${questionNumber}`).css('display', 'none');
      $('#question-box').html(`
    <p class="answerText"> Incorrect. The correct answer is ${
    currentState.questions.currCorrectAnswer
  } </p> 
    <button type="submit" class="nextButton">Next</button>`);
    }
  }
  
  function handleNextButton() {
    $('#question-box').on('click', '.nextButton', function(event) {
      event.preventDefault();
      questionNumber++;
      if (questionNumber < STORE.length) {
        updateCurrentState(questionNumber);
        currentState.nextBtnClicked = true;
        renderView();
        currentState.nextBtnClicked = false;
        $('.questionNumber').text(questionNumber + 1);
      } else {
        currentState.nextBtnClicked = true;
        renderView();
        currentState.nextBtnClicked = false;
      }
    });
  }
  
  function Results() {
    $('#question-box').html(`
    <h1>Your Stats!</h1>
    <hr>
    <h1>Questions Attempted: <span class="text-orange">${questionNumber}</span></h1>
    <h1>Correct Answers: <span class="text-orange">${
    currentState.questions.currCorrect
  }</span></h1>
    <h1>Percentage: <span class="text-orange">${currentState.questions
      .currCorrect * 20}%</span></h3>
    <h1>Missed: <span class="text-orange">${5 -
      currentState.questions.currCorrect}</span></h1>
    <div class="progress-bar></div>
    <p> You had ${
    currentState.questions.currCorrect
  } out of ${questionNumber} correct. </p> 
    <button id="resetButton" type="submit" class="resetQuizButton">Reset Quiz</button>`);
  }
  
  function handleQuiz() {
    handleStartBtnClicked();
    handleClickSubmitBtn();
    handleNextButton();
    restartQuiz();
  }
  
  function restartQuiz() {
    $('#question-box').on('click', '#resetButton', function(event) {
      questionNumber = 0;
      updateCurrentState(questionNumber);
      currentState.questions.currCorrect = 0;
      renderView();
    });
  }
  
  $(handleQuiz());