package com.gsb.goodnews.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProviderAccountDto {

    private long id;
    private boolean active;
    private String name;
    private long providerId;
    private String providerName;
    private String createdAt;
    private String lastUpdated;
    private String accountNumber;
    private String bank;
    private String type;
    private String cbu;
    private BigDecimal fee;
    private BigDecimal quota;
}
