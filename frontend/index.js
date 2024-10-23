import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentValue = '';
let storedValue = '';
let currentOperator = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.classList.contains('number') || button.classList.contains('decimal')) {
            currentValue += value;
            display.value = currentValue;
        } else if (button.classList.contains('operator')) {
            if (currentValue !== '') {
                if (storedValue !== '') {
                    calculate();
                } else {
                    storedValue = currentValue;
                }
                currentValue = '';
                currentOperator = value;
            }
        } else if (button.classList.contains('equals')) {
            if (currentValue !== '' && storedValue !== '') {
                calculate();
            }
        } else if (button.classList.contains('clear')) {
            clear();
        }
    });
});

async function calculate() {
    const x = parseFloat(storedValue);
    const y = parseFloat(currentValue);

    try {
        let result;
        switch (currentOperator) {
            case '+':
                result = await backend.add(x, y);
                break;
            case '-':
                result = await backend.subtract(x, y);
                break;
            case '*':
                result = await backend.multiply(x, y);
                break;
            case '/':
                const divisionResult = await backend.divide(x, y);
                if (divisionResult === null) {
                    throw new Error('Division by zero');
                }
                result = divisionResult;
                break;
        }

        display.value = result;
        storedValue = result.toString();
        currentValue = '';
        currentOperator = '';
    } catch (error) {
        display.value = 'Error';
        clear();
    }
}

function clear() {
    currentValue = '';
    storedValue = '';
    currentOperator = '';
    display.value = '';
}
