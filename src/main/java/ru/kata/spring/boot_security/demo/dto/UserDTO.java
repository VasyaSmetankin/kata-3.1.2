package ru.kata.spring.boot_security.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Set;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String login;
    private String name;
    private String lastName;
    private Set<String> roles;  // 🔹 Теперь это Set<String>, а не Set<Role>
}
