package com.gsb.goodnews.mapper;

import com.gsb.goodnews.domain.User;
import com.gsb.goodnews.dto.UserDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper extends BaseMapper<UserDto, User> {

}
