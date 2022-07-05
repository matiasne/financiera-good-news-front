package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.queryobject.querydsl.SearchDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class TransactionSearchDto extends SearchDto {

    private long id;
    private String dtype;
    private BigDecimal total;
}
