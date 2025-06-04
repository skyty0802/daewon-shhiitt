body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    background-color: #f4f7f6;
    margin: 20px;
    color: #333;
}

.container {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 800px;
}

h1 {
    text-align: center;
    color: #0056b3;
    margin-bottom: 30px;
}

.section {
    background-color: #e9f0f7;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 25px;
    border: 1px solid #d1e2f3;
}

h2, h3 {
    color: #004085;
    margin-top: 0;
    margin-bottom: 15px;
    border-bottom: 2px solid #a7d0ed;
    padding-bottom: 5px;
}

.student-input-group, .save-input-group { /* Added .save-input-group */
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 15px;
    gap: 10px;
}

.student-input-group label, .save-input-group label { /* Added .save-input-group */
    flex-basis: 100px;
    font-weight: bold;
    color: #555;
}

.student-input-group input[type="text"], .save-input-group input[type="text"] { /* Added .save-input-group */
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 0;
}

.student-input-group button, .save-input-group button { /* Added .save-input-group */
    flex-shrink: 0;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    background-color: #28a745;
    color: white;
    transition: background-color 0.3s ease;
}

.student-input-group button:hover, .save-input-group button:hover { /* Added .save-input-group */
    background-color: #218838;
}

input[type="number"] {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

button {
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-right: 10px;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}

.small-btn {
    padding: 8px 12px;
    font-size: 14px;
}

#clearAllStudentsBtn {
    background-color: #dc3545;
    margin-top: 15px;
}
#clearAllStudentsBtn:hover {
    background-color: #c82333;
}

#shuffleBtn {
    background-color: #ffc107;
    color: #333;
}
#shuffleBtn:hover {
    background-color: #e0a800;
}

#studentList, #constraintList {
    list-style-type: none;
    padding: 0;
    margin-top: 15px;
    max-height: 250px;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    margin-bottom: 15px;
}

#studentList li, #constraintList li {
    background-color: #f9f9f9;
    padding: 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#studentList li:last-child, #constraintList li:last-child {
    border-bottom: none;
}

.delete-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 5px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.delete-btn:hover {
    background-color: #c82333;
}

/* Specific styles for preference students in the combined list */
#studentList li.front-row-pref {
    background-color: #e6f7ff;
}

#studentList li.back-row-pref {
    background-color: #fff0e6;
}

#studentList li.fixed-seat-pref {
    background-color: #e6ffe6;
    font-weight: bold;
    border: 1px dashed #28a745;
}

#constraintList li.buddy-pair-pref {
    background-color: #f0f0ff;
}

#constraintList li.enemy-pair-pref {
    background-color: #ffe6e6;
}


#deskMapContainer,
#resultDeskMapContainer,
#loadedSavedMap { /* Changed from #loadedHistoryMap */
    margin-top: 20px;
    display: grid;
    gap: 5px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    background-color: #f0f8ff;
}

.desk-cell {
    width: 80px;
    height: 80px;
    border: 2px solid #6c757d;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    word-break: keep-all;
    text-align: center;
    font-size: 0.9em;
    padding: 5px;
    box-sizing: border-box;
    cursor: pointer;
}

.desk-cell.unavailable {
    background-color: #f8d7da;
    border: 2px dashed #dc3545;
    color: #dc3545;
    font-weight: bolder;
    font-size: 1.5em;
}

.desk-cell.paired-group-start {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: #e0ffe0;
}

.desk-cell.paired-group-end {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: #e0ffe0;
}

#deskMapContainer.grid-layout,
#resultDeskMapContainer.grid-layout,
#loadedSavedMap.grid-layout { /* Changed from #loadedHistoryMap */
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
}

.instruction {
    text-align: center;
    color: #666;
    margin-top: 10px;
    font-size: 0.9em;
}

.checkbox-group {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.checkbox-group input[type="checkbox"] {
    transform: scale(1.3);
}
.checkbox-group label {
    font-size: 1.1em;
    color: #444;
}

.desk-map-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    padding: 30px 80px 0 80px;
}

.desk-map-wrapper .label {
    font-weight: bold;
    color: #555;
    position: absolute;
    padding: 5px 10px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 0.9em;
    z-index: 2;
}

.desk-map-wrapper .board-label {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
}

.desk-map-wrapper .aisle-label {
    left: 0;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    white-space: nowrap;
    transform-origin: center center;
}

.desk-map-wrapper .window-label {
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    white-space: nowrap;
    transform-origin: center center;
}

#resultDeskMapContainer, #loadedSavedMap { /* Changed from #loadedHistoryMap */
    margin: 0;
    position: relative;
    z-index: 1;
}

#savedArrangementSelect { /* Changed from #historySelect */
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-right: 10px;
    font-size: 16px;
}

@media (max-width: 600px) {
    .container {
        padding: 20px;
    }
    input[type="text"],
    input[type="number"],
    button {
        font-size: 14px;
        padding: 8px;
    }
    .student-input-group label, .save-input-group label { /* Added .save-input-group */
        flex-basis: 80px;
    }
    .student-input-group input[type="text"], .save-input-group input[type="text"] { /* Added .save-input-group */
        flex-basis: calc(100% - 100px);
    }
    .desk-cell {
        width: 60px;
        height: 60px;
        font-size: 0.8em;
    }
    .desk-map-wrapper {
        padding: 25px 60px 0 60px;
    }
    .desk-map-wrapper .label {
        font-size: 0.8em;
        padding: 3px 6px;
    }
    .desk-map-wrapper .board-label {
        top: 0;
    }
    .desk-map-wrapper .aisle-label {
        left: 0;
    }
    .desk-map-wrapper .window-label {
        right: 0;
    }
}
