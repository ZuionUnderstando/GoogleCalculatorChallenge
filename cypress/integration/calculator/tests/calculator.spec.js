/// <reference types="cypress" />

import Calculator from "../pages/calculator.js";

let searchBar, calculator;
const calculatorLocator = 'div[jscontroller="GCPuBe"]';
const numberSectionTable = 'table.ElumCf div';

before(() => {
  // cy.visit('https://www.google.com/search?q=calculator&btnK=Buscar+con+Google&source=hp&ei=-lgxYbCeMae84-EP58C86AQ&iflsig=ALs-wAMAAAAAYTFnCjByfSCpFNEYDIHzTQZHGQUVdW6Q')
  
  cy.visit('https://www.google.com/')
  searchBar = cy.get('input[name=q]')
  searchBar.should("be.visible");
  searchBar.type('calculator');
  searchBar.should("contain.value", "calculator");
  searchBar.type('{enter}');
  // There's a big timeout in case google asks for CAPTCHA, you can manually do it (100 seconds)
  calculator = cy.get(`${calculatorLocator}`, { timeout: 100000 });
})

describe('Google Calculator', () => {
  beforeEach(() => {
    // Calculator.clearEverything();
    Calculator.clearAll();
  })

  it('numbers are present', () => {
    cy.get(`${calculatorLocator}`, { timeout: 100000 }).as('calculator');
    cy.get(`${calculatorLocator} ${numberSectionTable} div`).as('buttons');
    cy.get('@buttons').contains('0');
    cy.get('@buttons').contains('1');
    cy.get('@buttons').contains('2');
    cy.get('@buttons').contains('3');
    cy.get('@buttons').contains('4');
    cy.get('@buttons').contains('5');
    cy.get('@buttons').contains('6');
    cy.get('@buttons').contains('7');
    cy.get('@buttons').contains('8');
    cy.get('@buttons').contains('9');
  })

  it('function buttons are present', () => {
    Calculator.clickDot();
    Calculator.clickEquals();
    Calculator.clickPlus();
    Calculator.clickMinus();
    Calculator.clickTimes();
    Calculator.clickDividedBy();
    Calculator.clearEntry();
    Calculator.clearEverything();
    Calculator.clearAll();
  })
  
  it('can press all numbers', () => {
    Calculator.pressNumber(1);
    Calculator.pressNumber(2);
    Calculator.pressNumber(3);
    Calculator.pressNumber(4);
    Calculator.pressNumber(5);
    Calculator.pressNumber(6);
    Calculator.pressNumber(7);
    Calculator.pressNumber(8);
    Calculator.pressNumber(9);
    Calculator.pressNumber(0);
    
    Calculator.assertResult(1234567890);
    Calculator.clearEverything();
  })
  
  it('can add 2 numbers', () => {
    let a = 150, b = 361;
    // Input the first number
    Calculator.inputValue(a);

    // Click the plus button
    Calculator.clickPlus();

    // Input the second number
    Calculator.inputValue(b);

    // Click the equals button
    Calculator.clickEquals();

    // Assert the operation is displayed in the history section for the calculator
    Calculator.assertOperation();
    // Assert the result is the expected one
    Calculator.assertResult(a + b);
  })
  
  it('can multiply 2 numbers', () => {
    let a = 150, b = 361;
    // Input the first number
    Calculator.inputValue(a);

    // Click the multiply button
    Calculator.clickTimes();

    // Input the second number
    Calculator.inputValue(b);

    // Click the equals button
    Calculator.clickEquals();

    // Assert the operation is displayed in the history section for the calculator
    Calculator.assertOperation();
    // Assert the result is the expected one
    Calculator.assertResult(a * b);
  })
  
  it('can divide 2 numbers', () => {
    let a = 35, b = 5;
    // Input the first number
    Calculator.inputValue(a);

    // Click the divide by button
    Calculator.clickDividedBy();

    // Input the second number
    Calculator.inputValue(b);

    // Click the equals button
    Calculator.clickEquals();

    // Assert the operation is displayed in the history section for the calculator
    Calculator.assertOperation();
    // Assert the result is the expected one
    Calculator.assertResult(a / b);
  })
  
  it('can subtract 2 numbers', () => {
    let a = 35, b = 5;
    // Input the first number
    Calculator.inputValue(a);

    // Click the minus button
    Calculator.clickMinus();

    // Input the second number
    Calculator.inputValue(b);

    // Click the equals button
    Calculator.clickEquals();

    // Assert the operation is displayed in the history section for the calculator
    Calculator.assertOperation();
    // Assert the result is the expected one
    Calculator.assertResult(a - b);
  })

  it('can do a complex operation', () => {
    // Operation will be 5 * 5 - 12 / 3 + 21.9
    Calculator.inputValue(5);
    Calculator.clickTimes();
    Calculator.inputValue(5);
    Calculator.clickMinus();
    Calculator.inputValue(12);
    Calculator.clickDividedBy();
    Calculator.inputValue(3);
    Calculator.clickPlus();
    Calculator.inputValue(21.9);

    // Click the equals button
    Calculator.clickEquals();

    // Assert the operation is displayed in the history section for the calculator
    Calculator.assertOperation();
    // Assert the result is the expected one
    Calculator.assertResult(5 * 5 - 12 / 3 + 21.9);
  })

  it('can work with a previous answer', () => {
    // Do a simple operation
    Calculator.inputValue(5);
    Calculator.clickTimes();
    Calculator.inputValue(5);

    // Click the equals button
    Calculator.clickEquals();

    // Do another operation
    Calculator.clickPlus();
    Calculator.inputValue(15)

    // Click the equals button
    Calculator.clickEquals();

    // Assert the operation is displayed in the history section for the calculator
    Calculator.assertOperation('25 + 15 =');
    // Assert the result is the expected one
    Calculator.assertResult(5 * 5 + 15);
  })

  it('can do multiple operations', () => {
    let firstNumber = 100, secondNumber = 25, thirdNumber = 15;
    // Do a simple operation
    Calculator.inputValue(firstNumber);
    Calculator.clickDividedBy();
    Calculator.inputValue(secondNumber);

    // Click the equals button
    Calculator.clickEquals();

    // Assert the operation is displayed in the history section for the calculator
    Calculator.assertOperation(`${firstNumber} ÷ ${secondNumber} =`);
    // Assert the result is the expected one
    Calculator.assertResult(100/25);

    // Do another operation
    Calculator.clickPlus();
    Calculator.assertOperation(`Ans = ${firstNumber/secondNumber}`);
    Calculator.assertResult(`${firstNumber/secondNumber} + `);
    Calculator.inputValue(15)

    // Click the equals button
    Calculator.clickEquals();

    // Assert the operation is displayed in the history section for the calculator
    Calculator.assertOperation(`${firstNumber/secondNumber} + ${thirdNumber} =`);
    // Assert the result is the expected one
    Calculator.assertResult((firstNumber/secondNumber) + thirdNumber);

    // Do another operation
    Calculator.clickPlus();
    Calculator.inputValue(120);
    Calculator.clearEntry();
    Calculator.clickPlus();

    // Assert the operation is displayed in the history section for the calculator
    Calculator.assertOperation(`Ans = ${(firstNumber/secondNumber) + thirdNumber}`);
    // Assert the result is the expected one
    Calculator.assertResult(`${(firstNumber/secondNumber + thirdNumber)} + 12 + `);

    Calculator.clickMinus();
    Calculator.inputValue(1);
    Calculator.assertResult(`${(firstNumber/secondNumber + thirdNumber)} + 12 - 1`);
    Calculator.clickEquals();
    Calculator.assertOperation(`19 + 12 - 1 =`);
    Calculator.assertResult(`30`);

    Calculator.clickTimes();
    Calculator.clickDot();
    Calculator.pressNumber(5);
    Calculator.clickEquals();
    Calculator.assertOperation(`30 × .5 =`);
    Calculator.assertResult(`15`);

    Calculator.inputValue(Math.floor(Math.random() * 2500));

    Calculator.clearEverything();
    Calculator.assertResult(0);
    let randomNumber1 = Math.floor(Math.random() * 100),
      randomNumber2 = Math.floor(Math.random() * 100);
    Calculator.inputValue(randomNumber1);
    Calculator.clickTimes();
    Calculator.inputValue(randomNumber2);
    Calculator.clickEquals();
    Calculator.assertOperation(`${randomNumber1} × ${randomNumber2} =`);
    Calculator.assertResult(randomNumber1 * randomNumber2);
  })
})