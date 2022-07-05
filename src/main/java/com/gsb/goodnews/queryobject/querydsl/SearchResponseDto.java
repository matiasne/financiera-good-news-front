package com.gsb.goodnews.queryobject.querydsl;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SearchResponseDto<T> {
    private long total;
    private List<T> data;
}
