const weights = [3, 9, 3, 6, 2];
const values = [2, 10, 14, 8, 7];
const maxWeight = 30;
const n = weights.length;

let dp = [];
let currentRow = 1;

function initKnapsack() {
  dp = Array.from({ length: n + 1 }, () => Array(maxWeight + 1).fill(0));
  currentRow = 1;
  document.getElementById('result').innerText = '';
  document.getElementById('explanation').innerText = '';
  renderEmptyTable();
}

function renderEmptyTable() {
  const table = document.createElement('table');
  const header = document.createElement('tr');
  header.innerHTML = `<th>i \\ w</th>` +
    Array.from({ length: maxWeight + 1 }, (_, i) => `<th>${i}</th>`).join('');
  table.appendChild(header);

  for (let i = 0; i <= n; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `<th>${i}</th>` +
      Array.from({ length: maxWeight + 1 }, (_, w) =>
        `<td id="cell-${i}-${w}">0</td>`).join('');
    table.appendChild(row);
  }

  document.getElementById('dp-table-container').innerHTML = '';
  document.getElementById('dp-table-container').appendChild(table);
}

function nextRow() {
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
      explain = `W = ${w}: Предмет не вміщається (вага = ${itemWeight}) → залишаємо ${val}`;
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
      setTimeout(() => cell.classList.remove('updated'), 100);
    }

    explanations.push(explain);
  }

  document.getElementById('explanation').innerText =
    `Рядок ${currentRow} (Предмет ${currentRow - 1}, вага = ${weights[currentRow - 1]}, цінність = ${values[currentRow - 1]}):\n` +
    explanations.join('\n');

  currentRow++;
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
