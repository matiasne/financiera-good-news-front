package com.gsb.goodnews.dto;

import com.gsb.goodnews.security.dto.AuthorizationRequestDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserDto extends AuthorizationRequestDto {

    private long id;
    private String createdAt;
    private String lastUpdated;
    private List<RoleDto> roles;
    private String name;
    private String surname;
    private String phone;
    private String email;
}
