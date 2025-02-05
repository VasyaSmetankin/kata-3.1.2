package ru.kata.spring.boot_security.demo.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import ru.kata.spring.boot_security.demo.Service.UserDetailsServiceImpl;

@Configuration
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final UserDetailsServiceImpl userService;
    private final SuccessUserHandler successUserHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")  // ✅ Разрешить обоим
                        .requestMatchers("/", "/login", "/process_login", "/styles.css").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(login -> login
                        .loginPage("/login")
                        .loginProcessingUrl("/process_login") // Указываем обработчик логина
                        .defaultSuccessUrl("/user", true) // Перенаправление после успешного логина
                        .failureUrl("/login?error") // Если ошибка
                        .permitAll()
                        .successHandler(successUserHandler)
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // URL выхода
                        .logoutSuccessUrl("/login?logout") // Перенаправление после выхода
                        .invalidateHttpSession(true) // Инвалидируем сессию
                        .deleteCookies("JSESSIONID") // Удаляем куки
                )
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable());
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return new SuccessUserHandler();
    }
}
