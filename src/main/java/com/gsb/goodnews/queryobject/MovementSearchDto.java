package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.queryobject.querydsl.SearchDto;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MovementSearchDto extends SearchDto {

    private long id;
    private String concept;
    private long personId;
    private String personName;
    private String personDtype;
    private long providerAccountId;
    private String status;
    @Builder.Default
    private List<String> dtypes = new ArrayList<>();
}
