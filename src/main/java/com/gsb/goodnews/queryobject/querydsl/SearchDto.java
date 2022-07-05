package com.gsb.goodnews.queryobject.querydsl;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class SearchDto {
    @Builder.Default
    private Integer page = 0;
    @Builder.Default
    private Integer size = 10;
    @Builder.Default
    private String sort = "id";
    @Builder.Default
    private String order = "desc";
    private String from;
    private String to;
}
