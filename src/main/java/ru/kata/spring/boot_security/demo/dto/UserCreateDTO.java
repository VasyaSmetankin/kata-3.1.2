package ru.kata.spring.boot_security.demo.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserCreateDTO {
    private String login;
    private String name;
    private String lastName;
    private String password;
    private Set<String> roles;  // 🔹 Теперь можно передавать роли при создании/редактировании
}
