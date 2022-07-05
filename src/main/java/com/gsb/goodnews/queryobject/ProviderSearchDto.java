package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.queryobject.querydsl.SearchDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProviderSearchDto extends SearchDto {

    private long id;
    private String name;
    private String email;
    private String fee;
}
