package ru.kata.spring.boot_security.demo.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.Entity.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> user.getRoles().size());
        return users;
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.getRoles().size();
        return user;
    }

    @Transactional
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id).orElseThrow();
        user.setLogin(updatedUser.getLogin());
        user.setName(updatedUser.getName());
        user.setLastName(updatedUser.getLastName());

        if (!updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        user.setRoles(roleService.getRolesByNames(updatedUser.getRoles().stream()
                .map(role -> role.getRoleName()).collect(Collectors.toSet())));

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
