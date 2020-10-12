const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour *24;

//set date input minimum with DOday's date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

//Populate countdown and complete UI
function updateDOM() {
    coutdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue -now;
        
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
        const timeArray = [days, hours, minutes, seconds];
    
        //Hide input element
        inputContainer.hidden = true;

        //if countdown ended show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(coutdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {//Show countdown in progres
            //render countdown title and time elements into countdown DOM elements
            countdownElTitle.textContent = `${countdownTitle}`;
            for( i = 0; i < timeElements.length; i++) {
                timeElements[i].textContent = timeArray[i];
                completeEl.hidden = true;
                countdownEl.hidden = false;
            }
        }
    }, second);
}

//Take values from form inputs
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    //save data in object
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    console.log(savedCountdown);
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    //Check for valide date
    if(countdownDate === '') {
        alert('Please select a Date for countdown');
    } else {
        //get timestapm of chosen date from input and update countdown UI
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

//Reset all values
function reset() {
    // Hide countdown and show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    //stop coutdown
    clearInterval(coutdownActive);
    //reset title and date value
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restoreSavedCountdown() {
    //gte countdown data from local storage
    if(localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

//Event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

//on load check local storage
restoreSavedCountdown();