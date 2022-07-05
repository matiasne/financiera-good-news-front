package com.gsb.goodnews.dto;

import com.gsb.goodnews.util.TimeZoneUtils;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CustomerCommissionDto {

    private long id;
    private String createdAt = TimeZoneUtils.now().toString();
    private String lastUpdated;
    private long customerId;
    private String customerName;
    private long providerAccountId;
    private String providerAccountName;
    private ProviderAccountDto providerAccountDto;
    private BigDecimal fee;
}
