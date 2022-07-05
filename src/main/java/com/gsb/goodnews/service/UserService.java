package com.gsb.goodnews.service;

import com.gsb.goodnews.command.user.CreateUserCommand;
import com.gsb.goodnews.domain.User;
import com.gsb.goodnews.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final CreateUserCommand createUserCommand;

    @Transactional
    public User create(UserDto dto) {
        return createUserCommand.create(dto);
    }
}
