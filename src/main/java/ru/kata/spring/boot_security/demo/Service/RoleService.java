package ru.kata.spring.boot_security.demo.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.Entity.Role;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    // Получаем список всех доступных ролей
    public Set<String> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());
    }

    // Получаем Set<Role> из Set<String> (для обновления пользователя)
    public Set<Role> getRolesByNames(Set<String> roleNames) {
        return roleNames.stream()
                .map(roleName -> roleRepository.findByRoleName(roleName).orElseThrow(
                        () -> new RuntimeException("Роль не найдена: " + roleName)))
                .collect(Collectors.toSet());
    }
}
