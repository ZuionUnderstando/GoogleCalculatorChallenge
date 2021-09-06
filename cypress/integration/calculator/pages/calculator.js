const buttonAreaLocator = 'div[jscontroller="GCPuBe"] table.ElumCf div';
const resultAreaLocator = 'div[jsname="a1lrmb"]';
const operationDisplayLocator = `${resultAreaLocator} span[jsname="ubtiRe"]`;
const resultDisplayLocator = `${resultAreaLocator} span[jsname="VssY5c"]`;
const clearEntryLocator = `${buttonAreaLocator}.PaQdxb.UpZIS div[jsname="H7sWPd"]`
const clearAllLocator = `${buttonAreaLocator}.PaQdxb.UpZIS div[jsname="SLn8gc"]`

let operations = '';
let resetOperations = false;
const dot = '.',
    equals = '=',
    plus = '+',
    minus = '−',
    times = '×',
    dividedBy = '÷';

let operands = [''];
let currentIndexOfOperands = 0, previousResult = 0;
// let expectedResult = '';

// let firstOperand = '';
// let secondOperand = '';
// let operationToDo = '';

export default {
  pressNumber(value) {
    operands[currentIndexOfOperands] += '' + value;
    // firstOperand += value;
    pressButtonByText(value);
  },

  inputValue(value) {
    operands[currentIndexOfOperands] += '' + value;
    let textValue = '' + value;
    // firstOperand += textValue;
    for (let i = 0; i < textValue.length; i++) {
      pressButtonByText(textValue[i]);
    }
  },

  clickDot() {
    operands[currentIndexOfOperands] += '.';
    operations+='.';
    pressButtonByText(dot);
  },

  clickPlus() {
    doFunctionOnOperands('+');
    operations+=' ';
    pressButtonByText(plus);
    operations+=' ';
  },

  clickTimes() {
    doFunctionOnOperands('*');
    operations+=' ';
    pressButtonByText(times);
    operations+=' ';
  },

  clickDividedBy() {
    doFunctionOnOperands('/');
    operations+=' ';
    pressButtonByText(dividedBy);
    operations+=' ';
  },

  clickMinus() {
    doFunctionOnOperands('-');
    operations+=' ';
    pressButtonByText(minus);
    operations+=' ';
  },

  clickEquals() {
    processOperations();
    operations+=' ';
    pressButtonByText(equals);
    resetOperations = true;
  },

  clearEntry() {
    clearEntry();
    cy.get('body').find(clearEntryLocator).then(clearAllButton => {
      clearAllButton.trigger('click');
      operations = operations.substring(0, operations.length - 1)
    });
  },

  clearEverything() {
    cy.get(clearEntryLocator).trigger('mousedown');
    cy.wait(2000);
    cy.get(clearEntryLocator).trigger('mouseup');
    operations = '';
  },

  clearAll() {
    cy.get('body').find(clearAllLocator).then(clearAllButton => {
      clearAllButton.trigger('click');
    });
  },

  assertOperation() {
    cy.get(operationDisplayLocator).should('have.text', operations);
  },

  assertOperation(expectedOperation) {
    if(expectedOperation) {
      cy.get(operationDisplayLocator).should('have.text', expectedOperation);
      return;
    }
    cy.get(operationDisplayLocator).should('have.text', operations);
  },

  assertResult() {
    // cy.get(resultDisplayLocator).should('have.text', expectedResult);
  },

  assertResult(expectedResult) {
    cy.get(resultDisplayLocator).should('have.text', expectedResult);
  }
}

function pressButtonByText(text) {
  if(resetOperations) {
    operations = '';
    // processOperations();
    resetOperations = false;
  }
  if(text == minus) {
    operations += '-';
  } else {
    operations += text;
  }
  cy.get(`${buttonAreaLocator} div:contains(${text})`).click();
}

function doFunctionOnOperands(operation) {
  // If there's no number inputed validations
  if(operands[currentIndexOfOperands] == '') {
    // If the operation is not a minus (negative number)
    if(operation != '-') {
      // If the operation is preceded by another operation, the operation will be overwritten instead
      if(currentIndexOfOperands > 2) {
        // If the previous operand is not a negative expresion the operation will be added, else it will be discarded
        if(operands[currentIndexOfOperands - 1] != '-') operands[currentIndexOfOperands - 1] = '' + operation;
        return;
      }
      // If the current number is not displayed yet, it will be set to 0
      operands[currentIndexOfOperands] = '0';
    } else {
      // If it's the first number, it will be marked as negative
      if(operands.length < 3) {
        operands[currentIndexOfOperands] = '-';
        currentIndexOfOperands++;
        // Will begin a new number
        operands.push('');
        return;
      }
      // If the operation is a minus and there are no numbers added yet, it will let the calculous know that a negative number will be inputed
      // If there's a negative number inputed already, it will skip
      if(operands.length > 1 && operands[currentIndexOfOperands - 1] == '-') {
        return;
      }
    }
  }

  // Will add the new operand
  operands.push(operation);
  currentIndexOfOperands++;
  // Will begin a new number
  operands.push('');
  currentIndexOfOperands++;
}

function processOperations() {
  // If there's less than 3 operands (not a complete operation), the result will be 0 and the operands and index will stay as they are
  if(operands.length < 3) {
    if(operands[0] == '-') {
      operands[0] = '-' + operands[0];
    }
    // Transform the current number to integer, if there's no number, return 0
    previousResult = operands[0] = '' ? 0 : +operands[0];
    operands = [''];
    return;
  }
  
}

function clearEntry() {

}