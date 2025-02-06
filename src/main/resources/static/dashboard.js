document.addEventListener("DOMContentLoaded", () => {
    loadCurrentUser();
    document.getElementById("userPanelLink").addEventListener("click", showUserPanel);
    document.getElementById("adminPanelLink").addEventListener("click", showAdminPanel);
    document.getElementById("saveUser").addEventListener("click", saveUser);
    document.getElementById("confirmDelete").addEventListener("click", deleteUser);
});

function loadCurrentUser() {
    fetch("/api/users/me")
        .then(response => response.json())
        .then(user => {
            document.getElementById("currentUserInfo").textContent = `Логин: ${user.login} | Роли: ${[...user.roles].join(", ")}`;

            if (user.roles.includes("ROLE_ADMIN")) {
                document.getElementById("adminPanelLink").classList.remove("hidden");
            } else {
                document.getElementById("adminPanelLink").remove();
            }

            document.getElementById("userTable").innerHTML = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.login}</td>
                    <td>${user.name}</td>
                    <td>${user.lastName}</td>
                    <td>${[...user.roles].join(", ")}</td>
                </tr>
            `;
        })
        .catch(error => console.error("Ошибка загрузки пользователя:", error));
}

function showUserPanel() {
    document.getElementById("userPanel").classList.remove("hidden");
    document.getElementById("adminPanel").classList.add("hidden");
}

function showAdminPanel() {
    document.getElementById("adminPanel").classList.remove("hidden");
    document.getElementById("userPanel").classList.add("hidden");
    loadUsers();
}

function loadUsers() {
    fetch("/api/users")
        .then(response => response.json())
        .then(users => {
            const table = document.getElementById("usersTable");
            table.innerHTML = "";
            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.login}</td>
                    <td>${user.name}</td>
                    <td>${user.lastName}</td>
                    <td>${[...user.roles].join(", ")}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Редактировать</button>
                        <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${user.id})">Удалить</button>
                    </td>
                `;
                table.appendChild(row);
            });
        })
        .catch(error => console.error("Ошибка загрузки пользователей:", error));
}

function openUserForm() {
    document.getElementById("userId").value = "";
    document.getElementById("userLogin").value = "";
    document.getElementById("userName").value = "";
    document.getElementById("userLastName").value = "";
    document.getElementById("userPassword").value = "";
    document.getElementById("modalTitle").textContent = "Добавить пользователя";

    loadRoles();
    new bootstrap.Modal(document.getElementById("userModal")).show();
}

function editUser(id) {
    fetch(`/api/users/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById("userId").value = user.id;
            document.getElementById("userLogin").value = user.login;
            document.getElementById("userName").value = user.name;
            document.getElementById("userLastName").value = user.lastName;
            document.getElementById("userPassword").value = "";

            loadRoles(user.roles);
            document.getElementById("modalTitle").textContent = "Редактировать пользователя";
            new bootstrap.Modal(document.getElementById("userModal")).show();
        })
        .catch(error => console.error("Ошибка загрузки пользователя:", error));
}

function loadRoles(selectedRoles = []) {
    fetch("/api/users/roles")
        .then(response => response.json())
        .then(roles => {
            const rolesSelect = document.getElementById("userRoles");
            rolesSelect.innerHTML = "";

            roles.forEach(role => {
                const option = document.createElement("option");
                option.value = role;
                option.textContent = role;
                if (selectedRoles.includes(role)) {
                    option.selected = true;
                }
                rolesSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Ошибка загрузки ролей:", error));
}

function saveUser() {
    const id = document.getElementById("userId").value;
    const user = {
        login: document.getElementById("userLogin").value,
        name: document.getElementById("userName").value,
        lastName: document.getElementById("userLastName").value,
        password: document.getElementById("userPassword").value,
        roles: Array.from(document.getElementById("userRoles").selectedOptions).map(option => option.value)
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/users/${id}` : "/api/users";

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
        .then(() => {
            loadUsers();
            bootstrap.Modal.getInstance(document.getElementById("userModal")).hide();
        })
        .catch(error => console.error("Ошибка сохранения пользователя:", error));
}

function openDeleteModal(id) {
    fetch(`/api/users/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById("deleteUserId").value = user.id;
            document.getElementById("deleteUserLogin").textContent = user.login;
            new bootstrap.Modal(document.getElementById("deleteUserModal")).show();
        })
        .catch(error => console.error("Ошибка загрузки пользователя:", error));
}

function deleteUser() {
    const id = document.getElementById("deleteUserId").value;
    fetch(`/api/users/${id}`, { method: "DELETE" })
        .then(() => {
            loadUsers();
            bootstrap.Modal.getInstance(document.getElementById("deleteUserModal")).hide();
        })
        .catch(error => console.error("Ошибка удаления пользователя:", error));
}
