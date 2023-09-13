// Süha Tanrıverdi, 2023.
/*
 in normal JavaScript, mistyping a variable name
  creates a new global variable. 
  In strict mode, this will throw an error, 
  making it impossible to accidentally create a global variable.
*/
"use strict";

const numberSet = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
const operandsSet = new Set(["+", "-", "×", "÷"]);
const mainDisplay = document.querySelector('#mainDisplay');
// The variable we will use to calculate the result
let A = undefined;
let digitList = ["0"];
let dotUsed = false;
let curOperand = "";
let secondTurn = false;

function reset() {
    digitList = ["0"];
    curOperand = "";
    dotUsed = false;
    secondTurn = false;
    A = 0;
    updateMainDisplay();
}

function isInitial() {
    return digitList.length === 1 && digitList[0] === "0";
}

function updateMainDisplay() {
    let string = digitList.join("");
    if (secondTurn) {
        let signIndex = getSignIndex();
        let firstPart = mainDisplay.innerText.substring(0, signIndex + 1) + " ";
        mainDisplay.innerText = firstPart + string;
    } else {
        mainDisplay.innerText = string;
    }
}

function getNumber() {
    return parseFloat(digitList.join(""));
}

function getSignIndex() {
    return mainDisplay.innerText.indexOf(curOperand);
}

function getDotIndex() {
    return mainDisplay.innerText.indexOf(".");
}

function firstStateHandler(keyName) {
    // [1 - 9] Only
    if (numberSet.has(keyName)) {
        if (isInitial()) {
            digitList[0] = keyName;
        } else {
            digitList.push(keyName);
        }
        updateMainDisplay();
    } else if (keyName === "dot" && !dotUsed) {
        dotUsed = digitList.push(".");
        updateMainDisplay();
    } else if (keyName === "0") {
        if (!isInitial()) {
            digitList.push(keyName);
            updateMainDisplay();
        }
    } else if (keyName === "ac") {
        reset();
    }
    // 4-Operand Pressed (+ - * /)
    else if (operandsSet.has(keyName)) {
        if (secondTurn) {
            if (isInitial()) {
                let signIndex = getSignIndex();
                let newSign = mainDisplay.innerText.replace(curOperand, keyName);
                mainDisplay.innerText = newSign;
                curOperand = keyName;
            } else {
                resultHandler();
                operandHandler(keyName);
            }
        }
        else {
            operandHandler(keyName);
        }
    }
    // Equal Key Pressed
    else if (keyName === "=" && A !== undefined && secondTurn && !isInitial()) {
        resultHandler();
    }
}

function operandHandler(keyName) {
    A = getNumber();
    curOperand = keyName;
    if (digitList[digitList.length - 1] === '.') {
        let untilDot = mainDisplay.innerText.substring(0, getDotIndex());
        if (untilDot === "0") {
            digitList.pop();
        } else {
            digitList.push("0");
        }
    }
    digitList.push(` ${keyName} `);
    updateMainDisplay();
    digitList = ["0"];
    secondTurn = true;
    dotUsed = false;
}

function resultHandler() {
    let result = 0;
    let B = getNumber();
    if (curOperand === '+') {
        result = A + B;
    } else if (curOperand === '-') {
        result = A - B;
    } else if (curOperand === '×') {
        result = A * B;
    } else if (curOperand === '÷') {
        result = A / B;
    }
    result = result.toFixed(2) * 1;
    mainDisplay.innerText = result;
    digitList = [...result.toString()];
    curOperand = "";
    let dotIndex = digitList.indexOf('.');
    dotUsed = (dotIndex > 0);
    secondTurn = false;
    A = result;
}

function keyHandler(event, keyNameFromKeyboard) {
    let keyName = keyNameFromKeyboard ? keyNameFromKeyboard : event.target.name;
    firstStateHandler(keyName);
}

// Add event listener to all buttons
const buttons = document.querySelectorAll('button');
for (let button of buttons) {
    button.addEventListener('click', (event) => {
        keyHandler(event, null);
    });
}

// Listen key strokes
document.body.addEventListener('keydown', (event) => {
    if (event.repeat) {
        return;
    }
    let keyCode = event.keyCode;
    if (keyCode === 103 || keyCode === 55) { keyHandler(event, event.key); }
    if (keyCode === 104 || keyCode === 56) { keyHandler(event, event.key); }
    if (keyCode === 105 || keyCode === 57) { keyHandler(event, event.key); }
    if (keyCode === 100 || keyCode === 52) { keyHandler(event, event.key); }
    if (keyCode === 101 || keyCode === 53) { keyHandler(event, event.key); }
    if (keyCode === 102 || keyCode === 54) { keyHandler(event, event.key); }
    if (keyCode === 97 || keyCode === 49) { keyHandler(event, event.key); }
    if (keyCode === 98 || keyCode === 50) { keyHandler(event, event.key); }
    if (keyCode === 99 || keyCode === 51) { keyHandler(event, event.key); }
    if (keyCode === 96 || keyCode === 48) { keyHandler(event, event.key); }
    if (keyCode === 108 || keyCode === 190) { keyHandler(event, "dot"); }
    if (keyCode === 111) { keyHandler(event, "÷"); }
    if (keyCode === 106) { keyHandler(event, "×"); }
    if (keyCode === 109) { keyHandler(event, "-"); }
    if (keyCode === 107) { keyHandler(event, "+"); }
    if (keyCode === 8 || keyCode === 46) { keyHandler(event, "ac"); }
    if (keyCode === 13) { event.preventDefault(); keyHandler(event, "="); }
});