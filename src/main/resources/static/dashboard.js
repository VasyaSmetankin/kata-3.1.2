document.addEventListener("DOMContentLoaded", () => {
    loadCurrentUser();
    document.getElementById("userPanelLink").addEventListener("click", showUserPanel);
    document.getElementById("adminPanelLink").addEventListener("click", showAdminPanel);
    document.getElementById("saveNewUser").addEventListener("click", saveNewUser);
    document.getElementById("saveUser").addEventListener("click", saveUser);
    document.getElementById("confirmDelete").addEventListener("click", deleteUser);
    document.getElementById("usersTab").addEventListener("click", showUsersTablePanel);
    document.getElementById("newUserTab").addEventListener("click", showNewUserPanel);
});

function showUsersTablePanel() {
    document.getElementById("usersTablePanel").classList.remove("hidden");
    document.getElementById("newUserPanel").classList.add("hidden");
    document.getElementById("usersTab").classList.add("active");
    document.getElementById("newUserTab").classList.remove("active");
}

function showNewUserPanel() {
    document.getElementById("newUserPanel").classList.remove("hidden");
    document.getElementById("usersTablePanel").classList.add("hidden");
    document.getElementById("newUserTab").classList.add("active");
    document.getElementById("usersTab").classList.remove("active");
    loadRoles([], 'userRoles');
}

function loadCurrentUser() {
    fetch("/api/users/me")
        .then(response => response.json())
        .then(user => {
            document.getElementById("navbarUserInfo").textContent = `${user.login} with roles: ${[...user.roles].join(", ")}`;
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
                    <td><button class="btn btn-info btn-sm text-white" onclick="editUser(${user.id})">edit</button></td>
                    <td><button class="btn btn-danger btn-sm" onclick="openDeleteModal(${user.id})">delete</button></td>
                `;
                table.appendChild(row);
            });
        })
        .catch(error => console.error("Ошибка загрузки пользователей:", error));
}

window.editUser = function(id) {
    fetch(`/api/users/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById("userId").value = user.id;
            document.getElementById("editUserLogin").value = user.login;
            document.getElementById("editUserName").value = user.name;
            document.getElementById("editUserLastName").value = user.lastName;
            document.getElementById("editUserPassword").value = "";
            loadRoles(user.roles, 'editUserRoles');
            document.getElementById("modalTitle").textContent = "Edit User";
            new bootstrap.Modal(document.getElementById("userModal")).show();
        })
        .catch(error => console.error("Ошибка загрузки пользователя:", error));
};

window.openDeleteModal = function(id) {
    fetch(`/api/users/${id}`)
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
};

function loadRoles(selectedRoles = [], selectId = 'userRoles') {
    fetch("/api/users/roles")
        .then(response => response.json())
        .then(roles => {
            const rolesSelect = document.getElementById(selectId);
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

function validateForm(fields) {
    let valid = true;
    fields.forEach(id => {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            valid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    return valid;
}

window.saveNewUser = function() {
    const fields = ['userLogin', 'userName', 'userLastName'];
    if (!validateForm(fields)) return;

    const user = {
        login: document.getElementById("userLogin").value,
        name: document.getElementById("userName").value,
        lastName: document.getElementById("userLastName").value,
        password: document.getElementById("userPassword").value,
        roles: Array.from(document.getElementById("userRoles").selectedOptions).map(option => option.value)
    };

    fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
        .then(() => {
            loadUsers();
            document.getElementById("newUserForm").reset();
            showUsersTablePanel();
        })
        .catch(error => console.error("Ошибка создания пользователя:", error));
};

window.saveUser = function() {
    const fields = ['editUserLogin', 'editUserName', 'editUserLastName'];
    if (!validateForm(fields)) return;

    const id = document.getElementById("userId").value;
    const user = {
        login: document.getElementById("editUserLogin").value,
        name: document.getElementById("editUserName").value,
        lastName: document.getElementById("editUserLastName").value,
        password: document.getElementById("editUserPassword").value,
        roles: Array.from(document.getElementById("editUserRoles").selectedOptions).map(option => option.value)
    };

    fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
        .then(() => {
            loadUsers();
            bootstrap.Modal.getInstance(document.getElementById("userModal")).hide();
        })
        .catch(error => console.error("Ошибка сохранения пользователя:", error));
};

window.deleteUser = function() {
    const id = document.getElementById("deleteUserId").value;
    fetch(`/api/users/${id}`, { method: "DELETE" })
        .then(() => {
            loadUsers();
            bootstrap.Modal.getInstance(document.getElementById("deleteUserModal")).hide();
        })
        .catch(error => console.error("Ошибка удаления пользователя:", error));
};
