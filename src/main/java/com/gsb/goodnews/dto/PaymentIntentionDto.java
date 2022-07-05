package com.gsb.goodnews.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentIntentionDto {

    private long id;
    private String createdAt;
    private String lastUpdated;
    private long customerId;
    private String customerName;
    private BigDecimal total;
    private boolean payed;
    private String receiverDocument;
    private String receiverName;
    private String notes;
}
