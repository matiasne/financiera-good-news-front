package com.gsb.goodnews.dto.person;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PersonDto {

    private long id;
    private String createdAt;
    private String lastUpdated;
    private String name;
    private String email;
    private String phone;
    private String address;
    private BigDecimal balance;
    private String notes;
}
