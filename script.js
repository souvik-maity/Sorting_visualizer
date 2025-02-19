let array = [];
    let sorting = false;
    let paused = false;
    let delay = 100; 
    let arraySize = 10; 

    function generateArray() {
      const arrayContainer = document.getElementById('array-container');
      arrayContainer.innerHTML = '';
      array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 10);
      array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 2}px`;
        bar.style.width = `${600 / arraySize - 4}px`;
        arrayContainer.appendChild(bar);
      });
    }

    function startSorting() {
      if (sorting) return;
      sorting = true;
      paused = false;
      document.getElementById('pause-resume-btn').innerText = 'Pause';
      const selectedAlgorithm = document.getElementById('algorithm-selector').value;
      switch (selectedAlgorithm) {
        case 'bubble': bubbleSort(); break;
        case 'selection': selectionSort(); break;
        case 'insertion': insertionSort(); break;
        case 'merge': mergeSort(); break;
        case 'quick': quickSort(); break;
      }
    }

    function togglePauseResume() {
      paused = !paused;
      document.getElementById('pause-resume-btn').innerText = paused ? 'Resume' : 'Pause';
    }

    async function bubbleSort() {
      const bars = document.getElementsByClassName('bar');
      for (let i = 0; i < bars.length - 1; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
          if (paused) await waitForResume();
          bars[j].style.backgroundColor = "#e74c3c";
          bars[j + 1].style.backgroundColor = "#e74c3c";
          if (parseInt(bars[j].style.height) > parseInt(bars[j + 1].style.height)) {
            await swapBars(bars[j], bars[j + 1]);
          }
          bars[j].style.backgroundColor = "#3498db";
          bars[j + 1].style.backgroundColor = "#3498db";
        }
      }
      sorting = false;
    }
    async function selectionSort() {
        const bars = document.getElementsByClassName('bar');
        for (let i = 0; i < bars.length; i++) {
          let minIndex = i;
          bars[i].style.backgroundColor = "#e74c3c";
          for (let j = i + 1; j < bars.length; j++) {
            if (paused) await waitForResume();
            bars[j].style.backgroundColor = "#f1c40f";
            if (parseInt(bars[j].style.height) < parseInt(bars[minIndex].style.height)) {
              minIndex = j;
            }
            bars[j].style.backgroundColor = "#3498db";
          }
          await swapBars(bars[i], bars[minIndex]);
          bars[i].style.backgroundColor = "#3498db";
        }
        sorting = false;
      }
  
      async function insertionSort() {
        const bars = document.getElementsByClassName('bar');
        for (let i = 1; i < bars.length; i++) {
          let j = i;
          while (j > 0 && parseInt(bars[j].style.height) < parseInt(bars[j - 1].style.height)) {
            if (paused) await waitForResume();
            bars[j].style.backgroundColor = "#e74c3c";
            bars[j - 1].style.backgroundColor = "#e74c3c";
            await swapBars(bars[j], bars[j - 1]);
            bars[j].style.backgroundColor = "#3498db";
            bars[j - 1].style.backgroundColor = "#3498db";
            j--;
          }
        }
        sorting = false;
      }
  
      async function mergeSort() {
        await mergeSortHelper(0, array.length - 1);
        sorting = false;
      }
  
      async function mergeSortHelper(start, end) {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        await mergeSortHelper(start, mid);
        await mergeSortHelper(mid + 1, end);
        await merge(start, mid, end);
      }
  
      async function merge(start, mid, end) {
        const bars = document.getElementsByClassName('bar');
        let temp = [];
        let i = start, j = mid + 1;
  
        while (i <= mid && j <= end) {
          if (parseInt(bars[i].style.height) <= parseInt(bars[j].style.height)) {
            temp.push(parseInt(bars[i].style.height));
            i++;
          } else {
            temp.push(parseInt(bars[j].style.height));
            j++;
          }
        }
        while (i <= mid) {
          temp.push(parseInt(bars[i].style.height));
          i++;
        }
        while (j <= end) {
          temp.push(parseInt(bars[j].style.height));
          j++;
        }
  
        for (let k = start; k <= end; k++) {
          bars[k].style.height = `${temp[k - start]}px`;
          bars[k].style.backgroundColor = "#e74c3c";
          await new Promise(resolve => setTimeout(resolve, delay));
          bars[k].style.backgroundColor = "#3498db";
        }
      }
      async function quickSort() {
        await quickSortHelper(0, array.length - 1);
        sorting = false;
      }
  
      async function quickSortHelper(start, end) {
        if (start >= end) return;
        const pivotIndex = await partition(start, end);
        await quickSortHelper(start, pivotIndex - 1);
        await quickSortHelper(pivotIndex + 1, end);
      }
  
      async function partition(start, end) {
        const bars = document.getElementsByClassName('bar');
        const pivotValue = parseInt(bars[end].style.height);
        bars[end].style.backgroundColor = "#e74c3c";
        let i = start - 1;
        for (let j = start; j < end; j++) {
          if (parseInt(bars[j].style.height) < pivotValue) {
            i++;
            await swapBars(bars[i], bars[j]);
          }
        }
        await swapBars(bars[i + 1], bars[end]);
        bars[end].style.backgroundColor = "#3498db";
        return i + 1;
      }
    async function swapBars(bar1, bar2) {
        return new Promise(resolve => {
          const tempHeight = bar1.style.height;
          bar1.style.height = bar2.style.height;
          bar2.style.height = tempHeight;
          setTimeout(() => resolve(), delay);
        });
      }
  
      async function waitForResume() {
        while (paused) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
  
      function updateSpeed() {
        delay = parseInt(document.getElementById('speed-slider').value);
        document.getElementById('speed-value').innerText = delay;
      }
  
      function updateArraySize() {
        arraySize = parseInt(document.getElementById('size-slider').value);
        document.getElementById('size-value').innerText = arraySize;
        generateArray();
      }
  
      function displayComplexity() {
        const algorithm = document.getElementById('algorithm-selector').value;
        const complexityMap = {
          bubble: { worst: 'O(n²)', average: 'O(n²)', best: 'O(n)', space: 'O(1)' },
          selection: { worst: 'O(n²)', average: 'O(n²)', best: 'O(n²)', space: 'O(1)' },
          insertion: { worst: 'O(n²)', average: 'O(n²)', best: 'O(n)', space: 'O(1)' },
          merge: { worst: 'O(n log n)', average: 'O(n log n)', best: 'O(n log n)', space: 'O(n)' },
          quick: { worst: 'O(n²)', average: 'O(n log n)', best: 'O(n log n)', space: 'O(log n)' },
        };
        const { worst, average, best, space } = complexityMap[algorithm];
        document.getElementById('complexity-container').innerHTML = `
          <div class="complexity-item"><strong>Worst Case:</strong> ${worst}</div>
          <div class="complexity-item"><strong>Average Case:</strong> ${average}</div>
          <div class="complexity-item"><strong>Best Case:</strong> ${best}</div>
          <div class="complexity-item"><strong>Space Complexity:</strong> ${space}</div>
        `;
      }
  
      generateArray();