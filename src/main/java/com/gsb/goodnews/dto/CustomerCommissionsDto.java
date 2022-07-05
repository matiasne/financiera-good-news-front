package com.gsb.goodnews.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CustomerCommissionsDto {

    private long customerId;
    private List<CustomerCommissionDto> commissions = new ArrayList<>();
}
