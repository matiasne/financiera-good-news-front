package com.gsb.goodnews.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProviderAccountsDto {

    private long providerId;
    private List<ProviderAccountDto> accounts = new ArrayList<>();
}
