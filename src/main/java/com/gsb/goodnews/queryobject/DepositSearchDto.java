package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.queryobject.querydsl.SearchDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class DepositSearchDto extends SearchDto {

    private long id;
    private String internalId;
    private long providerId;
    private long customerId;
    private long providerAccountId;
    private List<String> status = new ArrayList<>();
    private BigDecimal total;
}
