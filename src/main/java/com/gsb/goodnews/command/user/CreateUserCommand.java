package com.gsb.goodnews.command.user;

import com.gsb.goodnews.domain.User;
import com.gsb.goodnews.dto.UserDto;
import com.gsb.goodnews.mapper.UserMapper;
import com.gsb.goodnews.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CreateUserCommand {

    private final UserMapper userMapper;
    private final UserValidator userValidator;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;

    public User create(UserDto dto) {
        userValidator.validateCreate(dto);

        User user = userMapper.map(dto);
        if (user.getPassword() != null) {
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }
}
