/***************Table Sorting Function *******************************/
//sort direction for each column (0 = unsorted, 1 = asc, 2 = desc)
let sortDirections = {}; 
let originalOrder = []; 

// Save the original order of the table rows
document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById("studentTable");
    const tbody = table.tBodies[0];
    originalOrder = Array.from(tbody.rows);
});

function sortTable(columnIndex, dataType) {
    const table = document.getElementById("studentTable");
    const tbody = table.tBodies[0];
    const rowsArray = Array.from(tbody.rows);

    // Initialize or increment the sort direction for the column
    if (!sortDirections[columnIndex]) {
        sortDirections[columnIndex] = 1; 
    } else if (sortDirections[columnIndex] === 1) {
        sortDirections[columnIndex] = 2; 
    } else {
        sortDirections[columnIndex] = 0; 
    }

    if (sortDirections[columnIndex] === 0) {
        clearSortClasses(); 
        originalOrder.forEach(row => tbody.appendChild(row)); 
        return;
    }

    rowsArray.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].innerText.toLowerCase();
        const cellB = rowB.cells[columnIndex].innerText.toLowerCase();

        let comparison = 0;

        if (dataType === 'int') {
            comparison = parseInt(cellA) - parseInt(cellB);
        } else if (dataType === 'float') {
            comparison = parseFloat(cellA) - parseFloat(cellB);
        } else {
            comparison = cellA.localeCompare(cellB);
        }
        return sortDirections[columnIndex] === 1 ? comparison : -comparison;
    });

    rowsArray.forEach(row => tbody.appendChild(row));

    clearSortClasses();
    const th = table.querySelectorAll("th")[columnIndex];
    if (sortDirections[columnIndex] === 1) {
        th.classList.add("sorted-asc");
    } else if (sortDirections[columnIndex] === 2) {
        th.classList.add("sorted-desc");
    }
}

// Clear sorting classes and icons from all headers
function clearSortClasses() {
    const thElements = document.querySelectorAll("th");
    thElements.forEach(th => {
        th.classList.remove("sorted-asc", "sorted-desc");
    });
}

/***************************************Pagination***************************/
const rowsPerPage = 5;
let currentPage = 1;

// Initialize pagination on page load
document.addEventListener('DOMContentLoaded', () => {
    paginateTable();
});

// Function to handle pagination
function paginateTable() {
    const table = document.getElementById("studentTable");
    const tbody = table.tBodies[0];
    const rows = tbody.rows;
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    

    displayRowsForPage(currentPage, rows);
    generatePaginationControls(totalPages);
}

function displayRowsForPage(page, rows) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    Array.from(rows).forEach((row, index) => {
        row.style.display = (index >= start && index < end) ? "" : "none";
    });
}

// Function to generate pagination controls
function generatePaginationControls(totalPages) {
    const paginationControls = document.getElementById("pagination-controls");
    paginationControls.innerHTML = ""; 

    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => changePage(currentPage - 1);
    paginationControls.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? "active" : "";
        pageButton.onclick = () => changePage(i);
        paginationControls.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => changePage(currentPage + 1);
    paginationControls.appendChild(nextButton);
}

// Function to change the page
function changePage(page) {
    currentPage = page;
    paginateTable();
}
