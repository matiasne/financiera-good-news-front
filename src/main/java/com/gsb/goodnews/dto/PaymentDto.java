package com.gsb.goodnews.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentDto {

    private long id;
    private String createdAt;
    private String lastUpdated;
    private long customerId;
    private String customerName;
    private Long paymentIntentionId;
    private BigDecimal total;
    private String notes;
}
