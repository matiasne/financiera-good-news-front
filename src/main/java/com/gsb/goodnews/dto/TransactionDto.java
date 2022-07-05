package com.gsb.goodnews.dto;

import com.gsb.goodnews.util.TimeZoneUtils;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionDto {

    protected long id;
    protected String dtype;
    protected String createdAt = TimeZoneUtils.now().toString();
    protected String lastUpdated;
    protected BigDecimal total;
    protected BigDecimal customerFee;
    protected BigDecimal providerAccountFee;
    protected String notes;
    protected String personName;
}
