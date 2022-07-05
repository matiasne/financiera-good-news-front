package com.gsb.goodnews.mapper;

import org.mapstruct.*;

/**
 * Base Mapper to map properties by name convention ignoring null values
 *
 * @param <DTO>    target entity
 * @param <Entity> source dto
 */
@MapperConfig(componentModel = "spring")
public interface BaseMapper<DTO, Entity> {

    /**
     * Map dto to entity
     *
     * @param dto source
     * @return entity
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lastUpdated", ignore = true)
    Entity map(DTO dto);

    /**
     * Map dto to entity
     *
     * @param dto    source
     * @param entity resulted from merge dto
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lastUpdated", ignore = true)
    void mapToEntity(DTO dto, @MappingTarget Entity entity);
}
