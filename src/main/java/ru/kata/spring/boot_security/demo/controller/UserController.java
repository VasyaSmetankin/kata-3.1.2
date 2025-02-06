package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.details.UserDetailsImpl;


@Controller
@RequestMapping("/user")
public class UserController {

    @GetMapping
    public String userPage(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        model.addAttribute("username", userDetails.getUsername());
        model.addAttribute("roles", userDetails.getAuthorities());

        if (userDetails instanceof UserDetailsImpl) {
            UserDetailsImpl user = (UserDetailsImpl) userDetails;
            model.addAttribute("name", user.getName());
            model.addAttribute("lastName", user.getLastName());
        } else {
            model.addAttribute("name", "Неизвестно");
            model.addAttribute("lastName", "Неизвестно");
        }

        return "user";
    }
}

