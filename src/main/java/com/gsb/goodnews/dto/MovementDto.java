package com.gsb.goodnews.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MovementDto {

    private long id;
    private String concept;
    private String createdAt;
    private String lastUpdated;
    private BigDecimal total;
    private BigDecimal fee;
    private BigDecimal totalFee;
    private BigDecimal prevBalance;
    private BigDecimal balance;
    private String notes;
    private long personId;
    private String personName;
    private String personDtype;
    private String personEmail;
    private String personUnconfirmedBalance;
    private String providerAccountName;
    private String providerAccountNumber;
    private long transactionId;
    private String transactionDtype;
    private String transactionStatus;
}
