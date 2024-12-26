const API_URL = "https://randomuser.me/api/?results=30";
let users = [];
let currentPage = 1;
const recordsPerPage = 10;

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    document.getElementById("refreshButton").addEventListener("click", fetchData);
    document.getElementById("searchBar").addEventListener("input", filterUsers);
    document.getElementById("viewEnvButton").addEventListener("click", () => {
        window.location.href = "env.html";
    });
});

function fetchData() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            users = data.results.map(user => ({
                name: `${user.name.first} ${user.name.last}`,
                email: user.email,
                country: user.location.country
            }));
            currentPage = 1;
            renderTable();
        });
}

function renderTable() {
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const paginatedUsers = users.slice(start, end);

    const tableBody = document.getElementById("userTable");
    tableBody.innerHTML = "";

    paginatedUsers.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.country}</td>
        `;
        tableBody.appendChild(row);
    });

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(users.length / recordsPerPage);
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", () => {
            currentPage = i;
            renderTable();
        });
        if (i === currentPage) button.style.backgroundColor = "#007BFF";
        paginationDiv.appendChild(button);
    }
}

function filterUsers() {
    const searchValue = document.getElementById("searchBar").value.toLowerCase();
    users = users.filter(user => user.country.toLowerCase().includes(searchValue));
    currentPage = 1;
    renderTable();
}
