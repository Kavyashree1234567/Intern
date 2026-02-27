const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const buttonsEl = document.getElementById("buttons");
const historyListEl = document.getElementById("historyList");
const historyTabsEl = document.querySelector(".history-tabs");

let firstNumber = null;
let operator = null;
let secondNumber = null;
let justCalculated = false;

function getCurrentValue() {
  return operator === null ? firstNumber : secondNumber;
}

function setCurrentValue(value) {
  if (operator === null) {
    firstNumber = value;
  } else {
    secondNumber = value;
  }
}

function formatNumber(numberValue) {
  if (!Number.isFinite(numberValue)) return "Error";
  return String(Number(numberValue.toFixed(12)));
}

function updateDisplay() {
  if (firstNumber === null) {
    resultEl.textContent = "0";
    expressionEl.textContent = "";
    return;
  }

  if (operator === null) {
    resultEl.textContent = firstNumber;
    expressionEl.textContent = "";
    return;
  }

  resultEl.textContent = secondNumber ?? firstNumber;
  expressionEl.textContent =
    `${firstNumber} ${operator} ${secondNumber ?? ""}`.trim();
}

function inputNumber(numberText) {
  if (justCalculated && operator === null) {
    firstNumber = null;
    justCalculated = false;
  }

  const current = getCurrentValue();
  if (current === "0") {
    setCurrentValue(numberText);
  } else {
    setCurrentValue(current === null ? numberText : current + numberText);
  }
  updateDisplay();
}

function inputDot() {
  if (justCalculated && operator === null) {
    firstNumber = null;
    justCalculated = false;
  }

  const current = getCurrentValue();
  if (current === null) {
    setCurrentValue("0.");
  } else if (!current.includes(".")) {
    setCurrentValue(current + ".");
  }
  updateDisplay();
}

function setOperator(nextOperator) {
  if (firstNumber === null) return;
  if (operator !== null && secondNumber !== null) {
    calculate();
  }
  operator = nextOperator;
  justCalculated = false;
  updateDisplay();
}

function clearAll() {
  firstNumber = null;
  operator = null;
  secondNumber = null;
  justCalculated = false;
  updateDisplay();
}

function clearEntry() {
  if (operator === null) {
    firstNumber = null;
  } else {
    secondNumber = null;
  }
  updateDisplay();
}

function deleteLast() {
  const current = getCurrentValue();
  if (current === null) return;

  const updated = current.slice(0, -1);
  setCurrentValue(updated || null);
  updateDisplay();
}

function toggleSign() {
  const current = getCurrentValue();
  if (current === null) return;
  setCurrentValue(formatNumber(Number(current) * -1));
  updateDisplay();
}

function percent() {
  const current = getCurrentValue();
  if (current === null) return;
  setCurrentValue(formatNumber(Number(current) / 100));
  updateDisplay();
}

function applyUnary(type) {
  const current = getCurrentValue();
  if (current === null) return;

  const value = Number(current);
  let output;
  let unaryText;

  if (type === "reciprocal") {
    if (value === 0) return showError();
    output = 1 / value;
    unaryText = `1/(${current})`;
  }
  if (type === "square") {
    output = value * value;
    unaryText = `sqr(${current})`;
  }
  if (type === "sqrt") {
    if (value < 0) return showError();
    output = Math.sqrt(value);
    unaryText = `sqrt(${current})`;
  }

  const formatted = formatNumber(output);
  setCurrentValue(formatted);
  expressionEl.textContent = unaryText;
  resultEl.textContent = formatted;
}

function showError() {
  resultEl.textContent = "Cannot divide by zero";
  expressionEl.textContent = "";
  firstNumber = null;
  operator = null;
  secondNumber = null;
  justCalculated = false;
}

function addHistory(expressionText, resultText) {
  const empty = historyListEl.querySelector(".empty-history");
  if (empty) empty.remove();

  const item = document.createElement("div");
  item.className = "history-item";
  item.innerHTML = `
    <div class="history-expression">${expressionText} =</div>
    <div class="history-result">${resultText}</div>
  `;
  historyListEl.prepend(item);
}

function calculate() {
  if (firstNumber === null || operator === null || secondNumber === null)
    return;

  const a = Number(firstNumber);
  const b = Number(secondNumber);
  let resultValue;

  if (operator === "+") resultValue = a + b;
  if (operator === "-") resultValue = a - b;
  if (operator === "*") resultValue = a * b;
  if (operator === "/") {
    if (b === 0) return showError();
    resultValue = a / b;
  }

  const formatted = formatNumber(resultValue);
  addHistory(`${firstNumber} ${operator} ${secondNumber}`, formatted);

  firstNumber = formatted;
  operator = null;
  secondNumber = null;
  justCalculated = true;
  updateDisplay();
}

buttonsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === "number") inputNumber(value);
  if (action === "dot") inputDot();
  if (action === "operator") setOperator(value);
  if (action === "equals") calculate();
  if (action === "clear") clearAll();
  if (action === "clear-entry") clearEntry();
  if (action === "delete") deleteLast();
  if (action === "percent") percent();
  if (action === "sign") toggleSign();
  if (action === "reciprocal" || action === "square" || action === "sqrt") {
    applyUnary(action);
  }
});

if (historyTabsEl) {
  historyTabsEl.addEventListener("click", (event) => {
    const clickedTab = event.target.closest(".tab");
    if (!clickedTab) return;

    historyTabsEl.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    clickedTab.classList.add("active");
  });
}

updateDisplay();
