package ru.kata.spring.boot_security.demo.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.dto.UserDTO;
import ru.kata.spring.boot_security.demo.dto.UserCreateDTO;
import ru.kata.spring.boot_security.demo.Entity.User;
import ru.kata.spring.boot_security.demo.Service.RoleService;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    private final RoleService roleService;

    public UserMapper(RoleService roleService) {
        this.roleService = roleService;
    }

    public UserDTO toDto(User user) {
        return new UserDTO(
                user.getId(),
                user.getLogin(),
                user.getName(),
                user.getLastName(),
                user.getRoles().stream().map(role -> role.getRoleName()).collect(Collectors.toSet())
        );
    }

    public User toEntity(UserCreateDTO userDto) {
        User user = new User();
        user.setLogin(userDto.getLogin());
        user.setName(userDto.getName());
        user.setLastName(userDto.getLastName());
        user.setPassword(userDto.getPassword());
        user.setRoles(roleService.getRolesByNames(userDto.getRoles()));
        return user;
    }
}
