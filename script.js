document.addEventListener('DOMContentLoaded', () => {
    const regularStudentNameInput = document.getElementById('regularStudentNameInput');
    const addRegularStudentBtn = document.getElementById('addRegularStudentBtn');
    const frontRowStudentNameInput = document.getElementById('frontRowStudentNameInput');
    const addFrontRowStudentBtn = document.getElementById('addFrontRowStudentBtn');
    const backRowStudentNameInput = document.getElementById('backRowStudentNameInput');
    const addBackRowStudentBtn = document.getElementById('addBackRowStudentBtn');
    const studentList = document.getElementById('studentList');
    const clearAllStudentsBtn = document.getElementById('clearAllStudentsBtn');
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');
    const createDeskMapBtn = document.getElementById('createDeskMapBtn');
    const deskMapContainer = document.getElementById('deskMapContainer');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const resultDeskMapContainer = document.getElementById('resultDeskMapContainer');
    const enablePairingCheckbox = document.getElementById('enablePairing');

    // Each student will be an object: { name: 'Student Name', type: 'regular' | 'front' | 'back' }
    let allStudents = [];
    let currentRowCount = parseInt(rowsInput.value);
    let currentColCount = parseInt(colsInput.value);
    let unavailableSeats = []; // Indices of seats marked as 'X' (0-indexed)

    // Load data from local storage
    function loadData() {
        const storedAllStudents = localStorage.getItem('allStudents');
        if (storedAllStudents) {
            allStudents = JSON.parse(storedAllStudents);
            renderStudentList();
        }
        const storedRows = localStorage.getItem('rows');
        const storedCols = localStorage.getItem('cols');
        if (storedRows && storedCols) {
            rowsInput.value = parseInt(storedRows);
            colsInput.value = parseInt(storedCols);
            currentRowCount = parseInt(storedRows);
            currentColCount = parseInt(storedCols);
        }
        const storedUnavailableSeats = localStorage.getItem('unavailableSeats');
        if (storedUnavailableSeats) {
            unavailableSeats = JSON.parse(storedUnavailableSeats);
        }
        const storedEnablePairing = localStorage.getItem('enablePairing');
        if (storedEnablePairing) {
            enablePairingCheckbox.checked = JSON.parse(storedEnablePairing);
        }
        // Initial desk map creation with current state
        createDeskMap(deskMapContainer, currentRowCount, currentColCount, [], true, enablePairingCheckbox.checked);
    }

    // Save data to local storage
    function saveData() {
        localStorage.setItem('allStudents', JSON.stringify(allStudents));
        localStorage.setItem('rows', rowsInput.value);
        localStorage.setItem('cols', colsInput.value);
        localStorage.setItem('unavailableSeats', JSON.stringify(unavailableSeats));
        localStorage.setItem('enablePairing', JSON.stringify(enablePairingCheckbox.checked));
    }

    // Render the combined student list
    function renderStudentList() {
        studentList.innerHTML = '';
        allStudents.forEach((studentObj, index) => {
            const li = document.createElement('li');
            li.textContent = studentObj.name;
            li.dataset.index = index; // Store index for deletion

            // Add class based on student type for styling
            if (studentObj.type === 'front') {
                li.classList.add('front-row-pref');
                li.textContent += ' (앞자리 희망)';
            } else if (studentObj.type === 'back') {
                li.classList.add('back-row-pref');
                li.textContent += ' (뒷자리 희망)';
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '삭제';
            deleteBtn.dataset.index = index; // Store index for deletion
            li.appendChild(deleteBtn);
            studentList.appendChild(li);
        });
        saveData();
    }

    // Add students to the allStudents array
    function addStudents(inputElement, studentType) {
        const inputNames = inputElement.value.trim();
        if (inputNames) {
            const newNames = inputNames.split(',').map(name => name.trim()).filter(name => name !== '');
            let duplicates = [];

            newNames.forEach(name => {
                if (!name) return;
                // Check for duplicate names across all student types
                if (allStudents.some(student => student.name === name)) {
                    duplicates.push(name);
                } else {
                    allStudents.push({ name: name, type: studentType });
                }
            });

            if (duplicates.length > 0) {
                alert(`"${duplicates.join(', ')}"은(는) 이미 존재하는 학생 이름입니다. (다른 카테고리에 있을 수 있습니다)`);
            }
            inputElement.value = '';
            renderStudentList();
        }
    }

    // Event listeners for adding students
    addRegularStudentBtn.addEventListener('click', () => addStudents(regularStudentNameInput, 'regular'));
    addFrontRowStudentBtn.addEventListener('click', () => addStudents(frontRowStudentNameInput, 'front'));
    addBackRowStudentBtn.addEventListener('click', () => addStudents(backRowStudentNameInput, 'back'));

    // Enable Enter key to add students
    regularStudentNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addRegularStudentBtn.click(); });
    frontRowStudentNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addFrontRowStudentBtn.click(); });
    backRowStudentNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addBackRowStudentBtn.click(); });

    // Delete student from the list
    studentList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = parseInt(e.target.dataset.index);
            allStudents.splice(index, 1);
            renderStudentList();
        }
    });

    // Clear all students
    clearAllStudentsBtn.addEventListener('click', () => {
        if (confirm('모든 학생 목록을 초기화하시겠습니까?')) {
            allStudents = [];
            renderStudentList();
        }
    });

    // Create desk map (preview and editable mode)
    function createDeskMap(container, rows, cols, studentNames = [], editable = false, isPairingMode = false) {
        container.innerHTML = '';
        container.classList.add('grid-layout');
        container.style.setProperty('--rows', rows);
        container.style.setProperty('--cols', cols);

        const totalCells = rows * cols;
        for (let i = 0; i < totalCells; i++) {
            const deskCell = document.createElement('div');
            deskCell.classList.add('desk-cell');
            deskCell.dataset.index = i; // Store cell index (0 to totalCells - 1)
            deskCell.textContent = studentNames[i] || ''; // Display student name or empty

            if (editable) {
                // Display 'X' for unavailable seats in editable mode
                if (unavailableSeats.includes(i)) {
                    deskCell.classList.add('unavailable');
                    deskCell.textContent = 'X';
                }
                // Toggle unavailable seat on click
                deskCell.addEventListener('click', () => {
                    toggleUnavailableSeat(i, deskCell);
                });
            }
            container.appendChild(deskCell);
        }

        // Apply pairing mode CSS classes after cells are created
        if (isPairingMode) {
            const deskCells = container.querySelectorAll('.desk-cell');
            deskCells.forEach((cell, i) => {
                const colIndex = i % cols;
                // If current cell is an even column and not the last column in the row
                if (colIndex % 2 === 0 && colIndex < cols - 1) {
                    // Check if both current cell and the next cell are available (not 'X')
                    if (!unavailableSeats.includes(i) && !unavailableSeats.includes(i + 1)) {
                        cell.classList.add('paired-group-start');
                        if (deskCells[i + 1]) { // Ensure the next cell exists
                            deskCells[i + 1].classList.add('paired-group-end');
                        }
                    }
                }
            });
        }
    }

    // Toggle unavailable seat
    function toggleUnavailableSeat(index, cellElement) {
        if (unavailableSeats.includes(index)) {
            unavailableSeats = unavailableSeats.filter(item => item !== index);
            cellElement.classList.remove('unavailable');
            cellElement.textContent = ''; // Clear 'X'
        } else {
            unavailableSeats.push(index);
            cellElement.classList.add('unavailable');
            cellElement.textContent = 'X';
        }
        saveData();
    }

    // Update preview when rows/cols change
    createDeskMapBtn.addEventListener('click', () => {
        const newRows = parseInt(rowsInput.value);
        const newCols = parseInt(colsInput.value);

        if (isNaN(newRows) || newRows < 1 || isNaN(newCols) || newCols < 1) {
            alert('행과 열은 1 이상의 숫자로 입력해주세요.');
            return;
        }
        currentRowCount = newRows;
        currentColCount = newCols;
        unavailableSeats = []; // Reset unavailable seats when map size changes
        createDeskMap(deskMapContainer, currentRowCount, currentColCount, [], true, enablePairingCheckbox.checked);
        saveData();
    });

    // Update preview when pairing checkbox changes
    enablePairingCheckbox.addEventListener('change', () => {
        createDeskMap(deskMapContainer, currentRowCount, currentColCount, [], true, enablePairingCheckbox.checked);
        saveData();
    });

    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Random seat assignment
    shuffleBtn.addEventListener('click', () => {
        const totalSeats = currentRowCount * currentColCount;
        let assignedStudents = new Array(totalSeats).fill(''); // Initialize all seats as empty
        let occupiedSeats = new Set(); // Keep track of occupied seat indices

        const availableSeats = []; // Indices of seats that are not marked 'X'
        for (let i = 0; i < totalSeats; i++) {
            if (!unavailableSeats.includes(i)) {
                availableSeats.push(i);
            }
        }
        const availableSeatsCount = availableSeats.length;

        if (allStudents.length === 0) {
            alert('학생을 먼저 추가해주세요.');
            return;
        }
        if (allStudents.length > availableSeatsCount) {
            alert(`학생 수(${allStudents.length}명)가 앉을 수 있는 자리 수(${availableSeatsCount}개)보다 많습니다. 학생을 줄이거나 앉지 않을 자리를 줄여주세요.`);
            return;
        }

        // Separate students by preference
        let frontRowHopefuls = shuffleArray(allStudents.filter(s => s.type === 'front').map(s => s.name));
        let backRowHopefuls = shuffleArray(allStudents.filter(s => s.type === 'back').map(s => s.name));
        let regularStudents = shuffleArray(allStudents.filter(s => s.type === 'regular').map(s => s.name));

        // Get available seat indices for each preference
        let frontSeats = availableSeats.filter(index => Math.floor(index / currentColCount) < Math.ceil(currentRowCount / 2)); // First half of rows
        let backSeats = availableSeats.filter(index => Math.floor(index / currentColCount) >= Math.floor(currentRowCount / 2)); // Second half of rows
        
        frontSeats = shuffleArray(frontSeats);
        backSeats = shuffleArray(backSeats);
        
        // Prioritize front-row hopefuls for front seats
        let assignedFrontHopefuls = 0;
        while (frontRowHopefuls.length > 0 && frontSeats.length > 0) {
            const studentName = frontRowHopefuls.shift();
            const seat = frontSeats.shift();
            assignedStudents[seat] = studentName;
            occupiedSeats.add(seat);
            assignedFrontHopefuls++;
        }
        // If front-row hopefuls remain and front seats are exhausted, they become regular
        regularStudents.push(...frontRowHopefuls);

        // Prioritize back-row hopefuls for back seats
        let assignedBackHopefuls = 0;
        while (backRowHopefuls.length > 0 && backSeats.length > 0) {
            const studentName = backRowHopefuls.shift();
            const seat = backSeats.shift();
            assignedStudents[seat] = studentName;
            occupiedSeats.add(seat);
            assignedBackHopefuls++;
        }
        // If back-row hopefuls remain and back seats are exhausted, they become regular
        regularStudents.push(...backRowHopefuls);

        // All remaining students (regular + unassigned hopefuls)
        let remainingStudents = shuffleArray(regularStudents);

        // Get all currently available seats (those not yet occupied)
        let currentAvailableSeats = shuffleArray(availableSeats.filter(seat => !occupiedSeats.has(seat)));

        // Pairing mode logic
        if (enablePairingCheckbox.checked) {
            if (remainingStudents.length % 2 !== 0 && remainingStudents.length > 0) {
                console.warn('짝꿍 배치는 학생 수가 짝수일 때 효과적입니다. 현재 짝꿍으로 배치되지 못하는 학생이 있을 수 있습니다.');
            }

            let pairedStudentGroups = [];
            while (remainingStudents.length >= 2) {
                pairedStudentGroups.push([remainingStudents.shift(), remainingStudents.shift()]);
            }
            if (remainingStudents.length === 1) {
                pairedStudentGroups.push([remainingStudents.shift()]);
            }
            pairedStudentGroups = shuffleArray(pairedStudentGroups);

            let tempRemainingStudents = [];
            for (const pair of pairedStudentGroups) {
                if (pair.length === 2) { // Try to assign pairs horizontally
                    let assigned = false;
                    for (let i = 0; i < currentAvailableSeats.length; i++) {
                        const seat1 = currentAvailableSeats[i];
                        // Check if seat1 is available and has an adjacent seat2 in the same row
                        if (!occupiedSeats.has(seat1) && (seat1 % currentColCount) < (currentColCount - 1)) {
                            const seat2 = seat1 + 1;
                            // Check if seat2 is also available and not an 'X' seat
                            if (!occupiedSeats.has(seat2) && !unavailableSeats.includes(seat2)) {
                                assignedStudents[seat1] = pair[0];
                                assignedStudents[seat2] = pair[1];
                                occupiedSeats.add(seat1);
                                occupiedSeats.add(seat2);
                                assigned = true;
                                // Remove assigned seats from currentAvailableSeats
                                currentAvailableSeats = currentAvailableSeats.filter(s => s !== seat1 && s !== seat2);
                                break;
                            }
                        }
                    }
                    if (!assigned) { // If horizontal pair couldn't be assigned, add back to remaining students
                        tempRemainingStudents.push(pair[0], pair[1]);
                    }
                } else { // Single student
                    tempRemainingStudents.push(pair[0]);
                }
            }
            remainingStudents = shuffleArray(tempRemainingStudents); // Students not paired horizontally
        }

        // Assign remaining students to any available seats
        currentAvailableSeats = shuffleArray(availableSeats.filter(seat => !occupiedSeats.has(seat)));
        let studentIdx = 0;
        while (studentIdx < remainingStudents.length && currentAvailableSeats.length > 0) {
            const seat = currentAvailableSeats.shift();
            assignedStudents[seat] = remainingStudents[studentIdx];
            occupiedSeats.add(seat);
            studentIdx++;
        }

        if (studentIdx < remainingStudents.length) {
            console.warn("모든 학생을 배치하지 못했습니다. (자리 부족)");
        }
        
        // Render the final result
        createDeskMap(resultDeskMapContainer, currentRowCount, currentColCount, assignedStudents, false, enablePairingCheckbox.checked);
    });

    // Load data on page load
    loadData();
});