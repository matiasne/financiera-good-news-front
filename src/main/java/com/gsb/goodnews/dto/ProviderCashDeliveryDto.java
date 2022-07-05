package com.gsb.goodnews.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProviderCashDeliveryDto extends TransactionDto {

    private long providerId;
    private String providerName;
}
