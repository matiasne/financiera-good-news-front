package com.gsb.goodnews.mapper;

import com.gsb.goodnews.domain.ProviderAccount;
import com.gsb.goodnews.dto.ProviderAccountDto;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapper.class)
public interface ProviderAccountMapper extends BaseMapper<ProviderAccountDto, ProviderAccount> {

    @InheritConfiguration(name = "map")
    @Mapping(source = "providerId", target = "provider.id")
    ProviderAccount map(ProviderAccountDto dto);
}
