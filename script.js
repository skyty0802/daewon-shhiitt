document.addEventListener('DOMContentLoaded', () => {
    const regularStudentNameInput = document.getElementById('regularStudentNameInput');
    const addRegularStudentBtn = document.getElementById('addRegularStudentBtn');
    const frontRowStudentNameInput = document.getElementById('frontRowStudentNameInput');
    const addFrontRowStudentBtn = document.getElementById('addFrontRowStudentBtn');
    const backRowStudentNameInput = document.getElementById('backRowStudentNameInput');
    const addBackRowStudentBtn = document.getElementById('addBackRowStudentBtn');

    const fixedSeatStudentNameInput = document.getElementById('fixedSeatStudentNameInput');
    const fixedSeatRowInput = document.getElementById('fixedSeatRow');
    const fixedSeatColInput = document.getElementById('fixedSeatCol');
    const addFixedSeatStudentBtn = document.getElementById('addFixedSeatStudentBtn');

    const buddy1Input = document.getElementById('buddy1Input');
    const buddy2Input = document.getElementById('buddy2Input');
    const addBuddyPairBtn = document.getElementById('addBuddyPairBtn');

    const enemy1Input = document.getElementById('enemy1Input');
    const enemy2Input = document.getElementById('enemy2Input');
    const addEnemyPairBtn = document.getElementById('addEnemyPairBtn');

    const studentList = document.getElementById('studentList');
    const constraintList = document.getElementById('constraintList');
    const clearAllStudentsBtn = document.getElementById('clearAllStudentsBtn');
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');
    const createDeskMapBtn = document.getElementById('createDeskMapBtn');
    const deskMapContainer = document.getElementById('deskMapContainer');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const resultDeskMapContainer = document.getElementById('resultDeskMapContainer');
    const enablePairingCheckbox = document.getElementById('enablePairing');
    const ensureDifferentArrangementCheckbox = document.getElementById('ensureDifferentArrangement'); // New checkbox

    const arrangementNameInput = document.getElementById('arrangementNameInput'); // New input
    const saveCurrentArrangementBtn = document.getElementById('saveCurrentArrangementBtn');
    const savedArrangementSelect = document.getElementById('savedArrangementSelect');
    const loadSavedArrangementBtn = document.getElementById('loadSavedArrangementBtn');
    const deleteSavedArrangementBtn = document.getElementById('deleteSavedArrangementBtn');
    const loadedSavedMap = document.getElementById('loadedSavedMap');

    // Each student will be an object: { name: 'Student Name', type: 'regular' | 'front' | 'back' | 'fixed', fixedSeat: { row, col }? }
    let allStudents = [];
    // Each constraint will be an object: { type: 'buddy' | 'enemy', students: ['name1', 'name2'] }
    let allConstraints = [];
    let currentRowCount = parseInt(rowsInput.value);
    let currentColCount = parseInt(colsInput.value);
    let unavailableSeats = []; // Indices of seats marked as 'X' (0-indexed)
    // savedArrangements will now use user-defined names as keys
    let savedArrangements = {}; // { 'Arrangement Name': { rows, cols, unavailableSeats, assignedStudents, enablePairing } }
    let lastAssignedStudents = []; // Store the last shuffled result for saving

    // Load data from local storage
    function loadData() {
        const storedAllStudents = localStorage.getItem('allStudents');
        if (storedAllStudents) {
            allStudents = JSON.parse(storedAllStudents);
            renderStudentList();
        }
        const storedAllConstraints = localStorage.getItem('allConstraints');
        if (storedAllConstraints) {
            allConstraints = JSON.parse(storedAllConstraints);
            renderConstraintList();
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
        const storedEnsureDifferent = localStorage.getItem('ensureDifferentArrangement');
        if (storedEnsureDifferent) {
            ensureDifferentArrangementCheckbox.checked = JSON.parse(storedEnsureDifferent);
        }
        const storedSavedArrangements = localStorage.getItem('savedArrangements');
        if (storedSavedArrangements) {
            savedArrangements = JSON.parse(storedSavedArrangements);
            populateSavedArrangementSelect();
        }
        // Initial desk map creation with current state
        createDeskMap(deskMapContainer, currentRowCount, currentColCount, [], true, enablePairingCheckbox.checked);
    }

    // Save data to local storage
    function saveData() {
        localStorage.setItem('allStudents', JSON.stringify(allStudents));
        localStorage.setItem('allConstraints', JSON.stringify(allConstraints));
        localStorage.setItem('rows', rowsInput.value);
        localStorage.setItem('cols', colsInput.value);
        localStorage.setItem('unavailableSeats', JSON.stringify(unavailableSeats));
        localStorage.setItem('enablePairing', JSON.stringify(enablePairingCheckbox.checked));
        localStorage.setItem('ensureDifferentArrangement', JSON.stringify(ensureDifferentArrangementCheckbox.checked));
        localStorage.setItem('savedArrangements', JSON.stringify(savedArrangements));
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
            } else if (studentObj.type === 'fixed') {
                li.classList.add('fixed-seat-pref');
                li.textContent += ` (고정: ${studentObj.fixedSeat.row}행, ${studentObj.fixedSeat.col}열)`;
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '삭제';
            deleteBtn.dataset.index = index; // Store index for deletion
            deleteBtn.dataset.list = 'student'; // Identify which list this button belongs to
            li.appendChild(deleteBtn);
            studentList.appendChild(li);
        });
        saveData();
    }

    // Render the constraint list
    function renderConstraintList() {
        constraintList.innerHTML = '';
        allConstraints.forEach((constraintObj, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;

            if (constraintObj.type === 'buddy') {
                li.classList.add('buddy-pair-pref');
                li.textContent = `친한 친구: ${constraintObj.students[0]}, ${constraintObj.students[1]}`;
            } else if (constraintObj.type === 'enemy') {
                li.classList.add('enemy-pair-pref');
                li.textContent = `안 친한 친구: ${constraintObj.students[0]}, ${constraintObj.students[1]}`;
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '삭제';
            deleteBtn.dataset.index = index;
            deleteBtn.dataset.list = 'constraint'; // Identify which list this button belongs to
            li.appendChild(deleteBtn);
            constraintList.appendChild(li);
        });
        saveData();
    }

    // Helper to check for duplicate student names
    function isStudentNameDuplicate(nameToCheck) {
        return allStudents.some(student => student.name === nameToCheck);
    }

    // Add students to the allStudents array
    function addStudents(inputElement, studentType, fixedSeat = null) {
        const inputVal = inputElement.value.trim();
        if (!inputVal) return;

        let newNames = [];
        const rangeMatch = inputVal.match(/^(\d+)~(\d+)$/);

        if (rangeMatch) {
            // If input is a range like "1~26"
            const start = parseInt(rangeMatch[1]);
            const end = parseInt(rangeMatch[2]);
            if (isNaN(start) || isNaN(end) || start > end) {
                alert('올바른 번호 범위 (예: 1~26)를 입력해주세요.');
                return;
            }
            for (let i = start; i <= end; i++) {
                newNames.push(String(i));
            }
        } else {
            // If input is comma-separated names
            newNames = inputVal.split(',').map(name => name.trim()).filter(name => name !== '');
        }
        
        let duplicates = [];
        let existingFixedSeatStudent = null;

        newNames.forEach(name => {
            if (!name) return;
            
            if (isStudentNameDuplicate(name)) {
                duplicates.push(name);
            } else if (studentType === 'fixed') {
                const existingStudentInSeat = allStudents.find(s => s.type === 'fixed' && s.fixedSeat.row === fixedSeat.row && s.fixedSeat.col === fixedSeat.col);
                if (existingStudentInSeat) {
                    existingFixedSeatStudent = existingStudentInSeat.name;
                } else {
                    allStudents.push({ name: name, type: studentType, fixedSeat: fixedSeat });
                }
            } else {
                allStudents.push({ name: name, type: studentType });
            }
        });

        if (duplicates.length > 0) {
            alert(`"${duplicates.join(', ')}"은(는) 이미 존재하는 학생 이름입니다. (다른 카테고리에 있을 수 있습니다)`);
        }
        if (existingFixedSeatStudent) {
            alert(`"${existingFixedSeatStudent}" 학생이 이미 ${fixedSeat.row}행 ${fixedSeat.col}열에 고정되어 있습니다.`);
        }
        inputElement.value = '';
        if (fixedSeatStudentNameInput) fixedSeatStudentNameInput.value = '';
        renderStudentList();
    }

    // Add constraints
    function addConstraint(type, name1, name2) {
        if (!name1 || !name2) {
            alert('두 학생 이름을 모두 입력해주세요.');
            return;
        }
        if (!isStudentNameDuplicate(name1) || !isStudentNameDuplicate(name2)) {
            alert('입력된 학생 중 한 명 이상이 학생 목록에 없습니다. 먼저 학생을 추가해주세요.');
            return;
        }
        if (name1 === name2) {
            alert('같은 학생을 두 번 입력할 수 없습니다.');
            return;
        }

        // Check for existing constraint of the same type and students (order doesn't matter)
        const exists = allConstraints.some(c => 
            c.type === type && 
            ((c.students[0] === name1 && c.students[1] === name2) || (c.students[0] === name2 && c.students[1] === name1))
        );
        if (exists) {
            alert(`${name1}, ${name2} 학생은 이미 해당 타입의 제약 조건에 추가되어 있습니다.`);
            return;
        }

        allConstraints.push({ type: type, students: [name1, name2] });
        renderConstraintList();
    }


    // Event listeners for adding students
    addRegularStudentBtn.addEventListener('click', () => addStudents(regularStudentNameInput, 'regular'));
    addFrontRowStudentBtn.addEventListener('click', () => addStudents(frontRowStudentNameInput, 'front'));
    addBackRowStudentBtn.addEventListener('click', () => addStudents(backRowStudentNameInput, 'back'));
    addFixedSeatStudentBtn.addEventListener('click', () => {
        const row = parseInt(fixedSeatRowInput.value);
        const col = parseInt(fixedSeatColInput.value);
        if (isNaN(row) || row < 1 || isNaN(col) || col < 1) {
            alert('고정 자리의 행과 열은 1 이상의 숫자로 입력해주세요.');
            return;
        }
        if (row > currentRowCount || col > currentColCount) {
             alert(`고정 자리는 현재 설정된 자리 배치도(${currentRowCount}행, ${currentColCount}열) 범위 내여야 합니다.`);
             return;
        }
        addStudents(fixedSeatStudentNameInput, 'fixed', { row, col });
    });
    addBuddyPairBtn.addEventListener('click', () => {
        addConstraint('buddy', buddy1Input.value.trim(), buddy2Input.value.trim());
        buddy1Input.value = '';
        buddy2Input.value = '';
    });
    addEnemyPairBtn.addEventListener('click', () => {
        addConstraint('enemy', enemy1Input.value.trim(), enemy2Input.value.trim());
        enemy1Input.value = '';
        enemy2Input.value = '';
    });


    // Enable Enter key to add students
    regularStudentNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addRegularStudentBtn.click(); });
    frontRowStudentNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addFrontRowStudentBtn.click(); });
    backRowStudentNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addBackRowStudentBtn.click(); });
    fixedSeatColInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addFixedSeatStudentBtn.click(); });
    buddy2Input.addEventListener('keypress', (e) => { if (e.key === 'Enter') addBuddyPairBtn.click(); });
    enemy2Input.addEventListener('keypress', (e) => { if (e.key === 'Enter') addEnemyPairBtn.click(); });


    // Delete student/constraint from the lists
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = parseInt(e.target.dataset.index);
            const listType = e.target.dataset.list;

            if (listType === 'student') {
                const deletedStudent = allStudents[index];
                if (deletedStudent.type === 'fixed') {
                    const seatIndex = getSeatIndex(deletedStudent.fixedSeat.row, deletedStudent.fixedSeat.col, currentColCount);
                    unavailableSeats = unavailableSeats.filter(item => item !== seatIndex);
                }
                allStudents.splice(index, 1);
                renderStudentList();
            } else if (listType === 'constraint') {
                allConstraints.splice(index, 1);
                renderConstraintList();
            }
        }
    });


    // Clear all students and constraints
    clearAllStudentsBtn.addEventListener('click', () => {
        if (confirm('모든 학생 및 제약 조건 목록을 초기화하시겠습니까?')) {
            allStudents = [];
            allConstraints = [];
            unavailableSeats = [];
            renderStudentList();
            renderConstraintList();
            createDeskMap(deskMapContainer, currentRowCount, currentColCount, [], true, enablePairingCheckbox.checked);
        }
    });

    // Create desk map (preview and editable mode)
    function createDeskMap(container, rows, cols, studentNames = [], editable = false, isPairingMode = false) {
        container.innerHTML = '';
        // Set grid properties using CSS custom properties for dynamic grid
        container.style.setProperty('--rows', rows);
        container.style.setProperty('--cols', cols);
        container.classList.add('grid-layout'); // Ensure this class is always present for grid display

        const totalCells = rows * cols;
        for (let i = 0; i < totalCells; i++) {
            const deskCell = document.createElement('div');
            deskCell.classList.add('desk-cell');
            deskCell.dataset.index = i;
            deskCell.textContent = studentNames[i] || '';

            if (editable) {
                if (unavailableSeats.includes(i)) {
                    deskCell.classList.add('unavailable');
                    deskCell.textContent = 'X';
                }
                deskCell.addEventListener('click', () => {
                    const fixedStudent = allStudents.find(s => s.type === 'fixed' && getSeatIndex(s.fixedSeat.row, s.fixedSeat.col, cols) === i);
                    if (fixedStudent) {
                        alert(`"${fixedStudent.name}" 학생이 고정된 자리이므로 변경할 수 없습니다.`);
                        return;
                    }
                    toggleUnavailableSeat(i, deskCell);
                });
            }
            container.appendChild(deskCell);
        }

        if (isPairingMode) {
            const deskCells = container.querySelectorAll('.desk-cell');
            deskCells.forEach((cell, i) => {
                const colIndex = i % cols;
                if (colIndex % 2 === 0 && colIndex < cols - 1) { // Check for even columns, not the last one
                    if (!unavailableSeats.includes(i) && !unavailableSeats.includes(i + 1)) { // Both cells must be available
                        cell.classList.add('paired-group-start');
                        if (deskCells[i + 1]) {
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
            cellElement.textContent = '';
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

        let invalidFixedSeats = [];
        allStudents.filter(s => s.type === 'fixed').forEach(s => {
            if (s.fixedSeat.row > currentRowCount || s.fixedSeat.col > currentColCount) {
                invalidFixedSeats.push(s.name);
            }
        });

        if (invalidFixedSeats.length > 0) {
            alert(`맵 크기가 변경되어 "${invalidFixedSeats.join(', ')}" 학생들의 고정 자리가 유효하지 않게 됩니다. 해당 학생들을 삭제하거나 맵 크기를 조정해주세요.`);
            return; 
        }

        const newUnavailableSeats = unavailableSeats.filter(index => {
            const row = Math.floor(index / currentColCount);
            const col = index % currentColCount;
            return row < newRows && col < newCols;
        });
        unavailableSeats = newUnavailableSeats;

        createDeskMap(deskMapContainer, currentRowCount, currentColCount, [], true, enablePairingCheckbox.checked);
        saveData();
    });

    // Update preview when pairing checkbox changes
    enablePairingCheckbox.addEventListener('change', () => {
        createDeskMap(deskMapContainer, currentRowCount, currentColCount, [], true, enablePairingCheckbox.checked);
        saveData();
    });

    // Save ensureDifferentArrangement checkbox state
    ensureDifferentArrangementCheckbox.addEventListener('change', () => {
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

    // Get the actual seat index from row and col (1-indexed to 0-indexed)
    function getSeatIndex(row, col, totalCols) {
        return (row - 1) * totalCols + (col - 1);
    }

    // Function to compare two arrangements for equality
    function areArrangementsEqual(arr1, arr2) {
        if (!arr1 || !arr2) return false;
        if (arr1.rows !== arr2.rows || arr1.cols !== arr2.cols || arr1.enablePairing !== arr2.enablePairing) return false;
        
        // Sort unavailableSeats for consistent comparison
        const sortedUnavailable1 = [...arr1.unavailableSeats].sort((a, b) => a - b);
        const sortedUnavailable2 = [...arr2.unavailableSeats].sort((a, b) => a - b);
        if (JSON.stringify(sortedUnavailable1) !== JSON.stringify(sortedUnavailable2)) return false;

        // Compare assignedStudents array directly
        return JSON.stringify(arr1.assignedStudents) === JSON.stringify(arr2.assignedStudents);
    }


    // Random seat assignment
    shuffleBtn.addEventListener('click', () => {
        const totalSeats = currentRowCount * currentColCount;
        let assignedStudents = new Array(totalSeats).fill('');
        let occupiedSeats = new Set();

        const availableSeats = [];
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

        // Keep trying to generate a different arrangement if the checkbox is checked
        let generatedArrangement = null;
        let attemptCount = 0;
        const maxAttempts = 100; // Prevent infinite loops

        do {
            attemptCount++;
            assignedStudents = new Array(totalSeats).fill('');
            occupiedSeats = new Set();
            
            // Re-shuffle available seats for each attempt
            let currentAvailableSeatsForAttempt = [...availableSeats]; // Use a copy to allow shuffling later

            // 1. Assign fixed seat students first
            let studentsToAssign = [...allStudents];
            let fixedStudents = studentsToAssign.filter(s => s.type === 'fixed');
            let unassignedFixedStudents = [];

            fixedStudents.forEach(fStudent => {
                const seatIndex = getSeatIndex(fStudent.fixedSeat.row, fStudent.fixedSeat.col, currentColCount);
                if (seatIndex >= 0 && seatIndex < totalSeats && !unavailableSeats.includes(seatIndex) && !occupiedSeats.has(seatIndex)) {
                    assignedStudents[seatIndex] = fStudent.name;
                    occupiedSeats.add(seatIndex);
                    studentsToAssign = studentsToAssign.filter(s => s.name !== fStudent.name);
                } else {
                    unassignedFixedStudents.push(fStudent.name);
                }
            });

            if (unassignedFixedStudents.length > 0 && attemptCount === 1) { // Only warn once
                alert(`다음 고정 자리 학생들을 배치할 수 없습니다: ${unassignedFixedStudents.join(', ')}. 자리가 없거나, 고정된 자리가 앉을 수 없는 자리로 표시되어 있습니다.`);
            }

            // Filter out occupied seats from availableSeats for subsequent assignments
            currentAvailableSeatsForAttempt = currentAvailableSeatsForAttempt.filter(seat => !occupiedSeats.has(seat));

            let frontRowHopefuls = shuffleArray(studentsToAssign.filter(s => s.type === 'front').map(s => s.name));
            let backRowHopefuls = shuffleArray(studentsToAssign.filter(s => s.type === 'back').map(s => s.name));
            let regularStudents = studentsToAssign.filter(s => s.type === 'regular').map(s => s.name); // Will be shuffled later

            // Get available seats by row for front/back preferences
            // Front seats: Iterate rows from top (0) to middle
            const frontRowsAvailableSeats = [];
            for (let r = 0; r < currentRowCount; r++) {
                let rowSeats = [];
                for (let c = 0; c < currentColCount; c++) {
                    const seatIndex = r * currentColCount + c;
                    if (currentAvailableSeatsForAttempt.includes(seatIndex)) {
                        rowSeats.push(seatIndex);
                    }
                }
                if (rowSeats.length > 0) {
                    frontRowsAvailableSeats.push(...shuffleArray(rowSeats)); // Shuffle within each row
                }
            }
            
            // Back seats: Iterate rows from bottom (currentRowCount-1) to middle
            const backRowsAvailableSeats = [];
            for (let r = currentRowCount - 1; r >= 0; r--) {
                let rowSeats = [];
                for (let c = 0; c < currentColCount; c++) {
                    const seatIndex = r * currentColCount + c;
                    if (currentAvailableSeatsForAttempt.includes(seatIndex)) {
                        rowSeats.push(seatIndex);
                    }
                }
                if (rowSeats.length > 0) {
                    backRowsAvailableSeats.push(...shuffleArray(rowSeats)); // Shuffle within each row
                }
            }

            // 2. Prioritize front-row hopefuls for front rows (random order per row)
            while (frontRowHopefuls.length > 0 && frontRowsAvailableSeats.length > 0) {
                const studentName = frontRowHopefuls.shift();
                const seat = frontRowsAvailableSeats.shift();
                if (!occupiedSeats.has(seat)) {
                    assignedStudents[seat] = studentName;
                    occupiedSeats.add(seat);
                } else {
                    regularStudents.push(studentName); // If seat was taken by fixed student
                }
            }
            regularStudents.push(...frontRowHopefuls); // Remaining front hopefuls become regular

            // 3. Prioritize back-row hopefuls for back rows (random order per row)
            while (backRowHopefuls.length > 0 && backRowsAvailableSeats.length > 0) {
                const studentName = backRowHopefuls.shift();
                const seat = backRowsAvailableSeats.shift();
                if (!occupiedSeats.has(seat)) {
                    assignedStudents[seat] = studentName;
                    occupiedSeats.add(seat);
                } else {
                    regularStudents.push(studentName); // If seat was taken by fixed student
                }
            }
            regularStudents.push(...backRowHopefuls); // Remaining back hopefuls become regular

            let remainingStudents = shuffleArray(regularStudents); // Shuffle all remaining regular students
            currentAvailableSeatsForAttempt = currentAvailableSeatsForAttempt.filter(seat => !occupiedSeats.has(seat));

            // Pairing mode logic (prioritize horizontal pairs)
            if (enablePairingCheckbox.checked) {
                if (remainingStudents.length % 2 !== 0 && remainingStudents.length > 0 && attemptCount === 1) {
                    console.warn('짝꿍 배치는 학생 수가 짝수일 때 효과적입니다. 현재 짝꿍으로 배치되지 못하는 학생이 있을 수 있습니다.');
                }

                let pairedStudentGroups = [];
                let unpairedStudents = [];
                const buddyConstraints = allConstraints.filter(c => c.type === 'buddy');
                const usedForPairing = new Set();

                buddyConstraints.forEach(constraint => {
                    const [s1, s2] = constraint.students;
                    if (!usedForPairing.has(s1) && !usedForPairing.has(s2) && 
                        remainingStudents.includes(s1) && remainingStudents.includes(s2)) {
                        pairedStudentGroups.push([s1, s2]);
                        usedForPairing.add(s1);
                        usedForPairing.add(s2);
                    }
                });

                remainingStudents = remainingStudents.filter(s => !usedForPairing.has(s));

                while (remainingStudents.length >= 2) {
                    pairedStudentGroups.push([remainingStudents.shift(), remainingStudents.shift()]);
                }
                if (remainingStudents.length === 1) {
                    unpairedStudents.push(remainingStudents.shift());
                }
                
                pairedStudentGroups = shuffleArray(pairedStudentGroups);
                unpairedStudents = shuffleArray(unpairedStudents);


                let tempRemainingStudents = [];
                for (const pair of pairedStudentGroups) {
                    if (pair.length === 2) {
                        let assigned = false;
                        let shuffledSeatsForPairing = shuffleArray([...currentAvailableSeatsForAttempt]); // Shuffle available seats for pairs

                        for (let i = 0; i < shuffledSeatsForPairing.length; i++) {
                            const seat1 = shuffledSeatsForPairing[i];
                            if (!occupiedSeats.has(seat1) && (seat1 % currentColCount) < (currentColCount - 1)) {
                                const seat2 = seat1 + 1;
                                if (!occupiedSeats.has(seat2) && !unavailableSeats.includes(seat2)) {
                                    const isEnemyPair = allConstraints.some(c => 
                                        c.type === 'enemy' && 
                                        ((c.students[0] === pair[0] && c.students[1] === pair[1]) || (c.students[0] === pair[1] && c.students[1] === pair[0]))
                                    );
                                    if (isEnemyPair) {
                                        continue;
                                    }

                                    assignedStudents[seat1] = pair[0];
                                    assignedStudents[seat2] = pair[1];
                                    occupiedSeats.add(seat1);
                                    occupiedSeats.add(seat2);
                                    assigned = true;
                                    currentAvailableSeatsForAttempt = currentAvailableSeatsForAttempt.filter(s => s !== seat1 && s !== seat2);
                                    break;
                                }
                            }
                        }
                        if (!assigned) {
                            tempRemainingStudents.push(pair[0], pair[1]);
                        }
                    } else {
                        tempRemainingStudents.push(pair[0]);
                    }
                }
                tempRemainingStudents.push(...unpairedStudents);
                remainingStudents = shuffleArray(tempRemainingStudents);
            }

            // 4. Assign remaining students to any available seats, considering enemy constraints
            currentAvailableSeatsForAttempt = currentAvailableSeatsForAttempt.filter(seat => !occupiedSeats.has(seat));
            
            // Shuffle again for randomness among remaining available seats
            currentAvailableSeatsForAttempt = shuffleArray(currentAvailableSeatsForAttempt);

            let currentUnassignedStudents = []; // Students that couldn't be placed in this attempt
            for (const student of remainingStudents) {
                let assigned = false;
                const shuffledAvailableSeatsForSingle = shuffleArray([...currentAvailableSeatsForAttempt]);

                for (let i = 0; i < shuffledAvailableSeatsForSingle.length; i++) {
                    const seat = shuffledAvailableSeatsForSingle[i];
                    if (!occupiedSeats.has(seat)) {
                        let canAssign = true;
                        const col = seat % currentColCount;
                        const row = Math.floor(seat / currentColCount);

                        const neighbors = [];
                        if (col > 0) neighbors.push(seat - 1); // left
                        if (col < currentColCount - 1) neighbors.push(seat + 1); // right
                        if (row > 0) neighbors.push(seat - currentColCount); // top
                        if (row < currentRowCount - 1) neighbors.push(seat + currentColCount); // bottom

                        for (const neighborSeat of neighbors) {
                            if (occupiedSeats.has(neighborSeat)) {
                                const neighborStudent = assignedStudents[neighborSeat];
                                const isEnemy = allConstraints.some(c => 
                                    c.type === 'enemy' && 
                                    ((c.students[0] === student && c.students[1] === neighborStudent) || (c.students[0] === neighborStudent && c.students[1] === student))
                                );
                                if (isEnemy) {
                                    canAssign = false;
                                    break;
                                }
                            }
                        }

                        if (canAssign) {
                            assignedStudents[seat] = student;
                            occupiedSeats.add(seat);
                            currentAvailableSeatsForAttempt = currentAvailableSeatsForAttempt.filter(s => s !== seat);
                            assigned = true;
                            break;
                        }
                    }
                }
                if (!assigned) {
                    currentUnassignedStudents.push(student);
                }
            }

            if (currentUnassignedStudents.length > 0 && attemptCount === 1) { // Only warn once
                alert(`다음 학생들을 배치하지 못했습니다 (자리 부족 또는 제약 조건 충돌): ${currentUnassignedStudents.join(', ')}`);
            }

            // If all students are assigned or max attempts reached, proceed
            if (currentUnassignedStudents.length === 0 || attemptCount >= maxAttempts) {
                generatedArrangement = {
                    rows: currentRowCount,
                    cols: currentColCount,
                    unavailableSeats: [...unavailableSeats],
                    assignedStudents: [...assignedStudents],
                    enablePairing: enablePairingCheckbox.checked
                };
            }

            // If 'ensureDifferentArrangement' is checked, check if the generated arrangement is a duplicate
            if (ensureDifferentArrangementCheckbox.checked && generatedArrangement) {
                const isDuplicateFound = Object.values(savedArrangements).some(saved => 
                    areArrangementsEqual(saved, generatedArrangement)
                );
                if (isDuplicateFound) {
                    generatedArrangement = null; // Mark as null to continue trying
                }
            }

        } while (ensureDifferentArrangementCheckbox.checked && generatedArrangement === null && attemptCount < maxAttempts);


        if (ensureDifferentArrangementCheckbox.checked && generatedArrangement === null) {
            alert('충분한 시도에도 불구하고 저장된 배치와 다른 새로운 배치를 생성할 수 없습니다. 제약 조건이나 학생 수가 너무 많을 수 있습니다.');
            return;
        }
        
        // If we reach here, generatedArrangement holds the final arrangement (either new or after max attempts)
        lastAssignedStudents = generatedArrangement.assignedStudents;
        createDeskMap(resultDeskMapContainer, currentRowCount, currentColCount, lastAssignedStudents, false, enablePairingCheckbox.checked);
    });

    // Saved Arrangement functions
    function populateSavedArrangementSelect() {
        savedArrangementSelect.innerHTML = '<option value="">저장된 배치 선택</option>';
        // Sort keys (arrangement names) alphabetically for consistent display
        Object.keys(savedArrangements).sort().forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            savedArrangementSelect.appendChild(option);
        });
    }

    saveCurrentArrangementBtn.addEventListener('click', () => {
        if (lastAssignedStudents.length === 0 || lastAssignedStudents.every(name => name === '')) {
            alert('저장할 자리 배치 결과가 없습니다. 먼저 "자리 랜덤 배치"를 실행해주세요.');
            return;
        }

        const arrangementName = arrangementNameInput.value.trim();
        if (!arrangementName) {
            alert('저장할 배치 이름을 입력해주세요.');
            return;
        }

        if (savedArrangements[arrangementName]) {
            if (!confirm(`"${arrangementName}" 이름으로 이미 저장된 배치가 있습니다. 덮어쓰시겠습니까?`)) {
                return;
            }
        }

        const currentArrangementData = {
            rows: currentRowCount,
            cols: currentColCount,
            unavailableSeats: [...unavailableSeats],
            assignedStudents: [...lastAssignedStudents],
            enablePairing: enablePairingCheckbox.checked
        };

        savedArrangements[arrangementName] = currentArrangementData;
        populateSavedArrangementSelect();
        saveData();
        alert(`"${arrangementName}" 이름으로 현재 자리 배치가 저장되었습니다!`);
        arrangementNameInput.value = ''; // Clear input after saving
    });

    loadSavedArrangementBtn.addEventListener('click', () => {
        const selectedName = savedArrangementSelect.value;
        if (selectedName && savedArrangements[selectedName]) {
            const arrangement = savedArrangements[selectedName];
            // Pass rows and cols to createDeskMap for correct grid rendering
            createDeskMap(loadedSavedMap, arrangement.rows, arrangement.cols, arrangement.assignedStudents, false, arrangement.enablePairing);
            
            // Optionally, update the main settings to match the loaded arrangement
            rowsInput.value = arrangement.rows;
            colsInput.value = arrangement.cols;
            currentRowCount = arrangement.rows;
            currentColCount = arrangement.cols;
            unavailableSeats = [...arrangement.unavailableSeats];
            enablePairingCheckbox.checked = arrangement.enablePairing;
            // Re-render the editable map to reflect loaded settings
            createDeskMap(deskMapContainer, currentRowCount, currentColCount, [], true, enablePairingCheckbox.checked);
            saveData(); // Save updated current settings
        } else {
            alert('불러올 배치를 선택해주세요.');
        }
    });

    deleteSavedArrangementBtn.addEventListener('click', () => {
        const selectedName = savedArrangementSelect.value;
        if (selectedName && savedArrangements[selectedName]) {
            if (confirm(`"${selectedName}" 배치를 삭제하시겠습니까?`)) {
                delete savedArrangements[selectedName];
                populateSavedArrangementSelect();
                loadedSavedMap.innerHTML = '';
                saveData();
            }
        } else {
            alert('삭제할 배치를 선택해주세요.');
        }
    });

    // Initial load
    loadData();
    createDeskMap(deskMapContainer, currentRowCount, currentColCount, [], true, enablePairingCheckbox.checked);
});
