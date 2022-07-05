package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.queryobject.querydsl.SearchDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PaymentIntentionSearchDto extends SearchDto {

    private long id;
    private long customerId;
    private Boolean payed;
    private String receiverDocument;
    private String receiverName;
}

