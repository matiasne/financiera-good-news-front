package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.queryobject.querydsl.SearchDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProviderAccountSearchDto extends SearchDto {

    private long id;
    private boolean active = true;
    private long providerId;
    private String providerName;
    private String createdAt;
    private String lastUpdated;
    private String accountNumber;
    private String bank;
    private String type;
}
