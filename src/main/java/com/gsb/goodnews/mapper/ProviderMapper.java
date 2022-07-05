package com.gsb.goodnews.mapper;

import com.gsb.goodnews.domain.Provider;
import com.gsb.goodnews.dto.person.ProviderDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProviderMapper extends BaseMapper<ProviderDto, Provider> {

}
