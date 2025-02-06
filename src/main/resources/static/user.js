document.addEventListener("DOMContentLoaded", () => {
    loadCurrentUser();
});

// 🔹 Загружает данные о текущем пользователе
function loadCurrentUser() {
    fetch("/api/users/me")
        .then(response => response.json())
        .then(user => {
            document.getElementById("currentUserInfo").textContent = `Логин: ${user.login} | Роли: ${[...user.roles].join(", ")}`;

            // Заполняем таблицу данными пользователя
            const table = document.getElementById("userTable");
            table.innerHTML = `
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
