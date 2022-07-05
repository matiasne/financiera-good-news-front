package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.queryobject.querydsl.SearchDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class PaymentSearchDto extends SearchDto {

    private long id;
    private long customerId;
    private String receiverDocument;
    private String receiverName;
    private BigDecimal total;
}
