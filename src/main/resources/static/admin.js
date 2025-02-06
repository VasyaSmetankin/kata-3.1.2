document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
    loadCurrentUser();
    loadRoles();

    document.getElementById("saveUser").addEventListener("click", saveUser);
    document.getElementById("confirmDelete").addEventListener("click", deleteUser);
});

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
                        <button class="btn btn-warning btn-sm edit-btn" data-user-id="${user.id}">Редактировать</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-user-id="${user.id}">Удалить</button>
                    </td>
                `;
                table.appendChild(row);
            });

            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", () => editUser(button.dataset.userId));
            });

            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", () => openDeleteModal(button.dataset.userId));
            });
        })
        .catch(error => console.error("Ошибка загрузки пользователей:", error));
}

function editUser(userId) {
    fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById("userId").value = user.id;
            document.getElementById("userLogin").value = user.login;
            document.getElementById("userName").value = user.name;
            document.getElementById("userLastName").value = user.lastName;
            document.getElementById("userPassword").value = "";

            fetch("/api/users/roles")
                .then(response => response.json())
                .then(roles => {
                    const rolesSelect = document.getElementById("userRoles");
                    rolesSelect.innerHTML = "";

                    roles.forEach(role => {
                        const option = document.createElement("option");
                        option.value = role;
                        option.textContent = role;
                        if (user.roles.includes(role)) {
                            option.selected = true;
                        }
                        rolesSelect.appendChild(option);
                    });
                });

            document.getElementById("modalTitle").textContent = "Редактировать пользователя";
            new bootstrap.Modal(document.getElementById("userModal")).show();
        })
        .catch(error => console.error("Ошибка загрузки пользователя:", error));
}

function openDeleteModal(userId) {
    fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById("deleteUserId").value = user.id;
            document.getElementById("deleteUserLogin").value = user.login;
            document.getElementById("deleteUserName").value = user.name;
            document.getElementById("deleteUserLastName").value = user.lastName;
            document.getElementById("deleteUserRoles").value = [...user.roles].join(", ");

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

function loadCurrentUser() {
    fetch("/api/users")
        .then(response => response.json())
        .then(users => {
            const userInfo = document.getElementById("currentUserInfo");
            userInfo.textContent = "Администратор";
        })
        .catch(error => console.error("Ошибка загрузки текущего пользователя:", error));
}

function loadRoles() {
    fetch("/api/users/roles")
        .then(response => response.json())
        .then(roles => {
            const rolesSelect = document.getElementById("userRoles");
            rolesSelect.innerHTML = "";
            roles.forEach(role => {
                const option = document.createElement("option");
                option.value = role;
                option.textContent = role;
                rolesSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Ошибка загрузки ролей:", error));
}
