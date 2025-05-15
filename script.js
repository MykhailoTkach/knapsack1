const weights = [3, 9, 3, 6, 2];
const values = [2, 10, 14, 8, 7];
const maxWeight = 30;
const n = weights.length;

let dp = [];
let currentRow = 1;
let i = 1, w = 0;
let interval = null;

function initKnapsack() {
  stopPlay();

  dp = Array.from({ length: n + 1 }, () => Array(maxWeight + 1).fill(0));
  currentRow = 1;
  i = 1;
  w = 0;

  document.getElementById('result').innerText = '';
  document.getElementById('explanation').innerText = '';
  renderEmptyGrid();
}

function renderEmptyGrid() {
  const container = document.createElement('div');
  container.className = 'dp-grid';
  container.style.gridTemplateColumns = `repeat(${maxWeight + 2}, auto)`;

  container.appendChild(createCell('i \\ w', 'header'));

  for (let w = 0; w <= maxWeight; w++) {
    container.appendChild(createCell(w, 'header'));
  }

  for (let i = 0; i <= n; i++) {
    container.appendChild(createCell(i, 'header'));
    for (let w = 0; w <= maxWeight; w++) {
      const cell = createCell('0', 'cell');
      cell.id = `cell-${i}-${w}`;
      container.appendChild(cell);
    }
  }

  const tableContainer = document.getElementById('dp-table-container');
  tableContainer.innerHTML = '';
  tableContainer.appendChild(container);
}

function createCell(content, type) {
  const div = document.createElement('div');
  div.textContent = content;
  div.className = type;
  return div;
}

function nextRow() {
  clearHighlights();
  if (currentRow > n) {
    findSelectedItems();
    return;
  }

  const explanations = [];

  for (let w = 0; w <= maxWeight; w++) {
    let val, explain = '';
    const itemWeight = weights[currentRow - 1];
    const itemValue = values[currentRow - 1];

    if (itemWeight > w) {
      val = dp[currentRow - 1][w];
      explain = `W = ${w}: предмет не вміщається (вага = ${itemWeight}) → залишаємо ${val}`;
    } else {
      const withoutItem = dp[currentRow - 1][w];
      const withItem = dp[currentRow - 1][w - itemWeight] + itemValue;
      val = Math.max(withoutItem, withItem);
      explain = `W = ${w}: max(без = ${withoutItem}, з = ${withItem}) → ${val}`;
    }

    dp[currentRow][w] = val;
    const cell = document.getElementById(`cell-${currentRow}-${w}`);
    if (cell) {
      cell.textContent = val;
      cell.classList.add('updated');
      setTimeout(() => cell.classList.remove('updated'), 300);
    }

    explanations.push(explain);
  }

  document.getElementById('explanation').innerText =
    `Рядок ${currentRow} (Предмет ${currentRow - 1}, вага = ${weights[currentRow - 1]}, цінність = ${values[currentRow - 1]}):\n` +
    explanations.join('\n');

  currentRow++;
}

function nextStep() {
  if (i > n) {
    stopPlay();
    findSelectedItems();
    return;
  }

  clearHighlights();

  const itemWeight = weights[i - 1];
  const itemValue = values[i - 1];
  let val, explain = '';

  if (itemWeight > w) {
    val = dp[i - 1][w];
    explain = `i=${i}, w=${w}: вага ${itemWeight} > ${w} → не беремо ➜ ${val}`;
    highlight(i - 1, w, 'source');
  } else {
    const without = dp[i - 1][w];
    const withVal = dp[i - 1][w - itemWeight] + itemValue;
    val = Math.max(without, withVal);
    explain = `i=${i}, w=${w}: max(без=${without}, з=${withVal}) → ${val}`;
    highlight(i - 1, w, 'source');
    highlight(i - 1, w - itemWeight, 'source');
  }

  dp[i][w] = val;
  const cell = document.getElementById(`cell-${i}-${w}`);
  if (cell) {
    cell.textContent = val;
    cell.classList.add('updated');
    setTimeout(() => cell.classList.remove('updated'), 300);
  }

  document.getElementById('explanation').innerText = explain;

  w++;
  if (w > maxWeight) {
    i++;
    w = 0;
  }
}

function autoPlay() {
  if (!interval) {
    interval = setInterval(() => {
      nextStep();
    }, 300);
  }
}

function stopPlay() {
  clearInterval(interval);
  interval = null;
}

function findSelectedItems() {
  let w = maxWeight;
  const chosenItems = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      chosenItems.push(i - 1);
      const cell = document.getElementById(`cell-${i}-${w}`);
      if (cell) cell.classList.add('selected');
      w -= weights[i - 1];
    }
  }

  chosenItems.reverse();
  document.getElementById('result').innerText =
    `Максимальна цінність: ${dp[n][maxWeight]}\n` +
    `Вибрані предмети (індекси): ${chosenItems.join(', ')}`;
  document.getElementById('explanation').innerText = 'Побудову завершено ✔';
}

function highlight(i, w, cls) {
  const cell = document.getElementById(`cell-${i}-${w}`);
  if (cell) cell.classList.add(cls);
}

function clearHighlights() {
  document.querySelectorAll('.source').forEach(c => c.classList.remove('source'));
}
