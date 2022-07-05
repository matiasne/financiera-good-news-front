package com.gsb.goodnews.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class DepositDto extends TransactionDto {

    private String internalId;
    private String status;
    private String file;
    private String notes;
    private long customerId;
    private String customerName;
    private long providerAccountId;
    private String providerAccountNumber;
    private long providerId;
    private String providerName;
    private String cuit;
}

