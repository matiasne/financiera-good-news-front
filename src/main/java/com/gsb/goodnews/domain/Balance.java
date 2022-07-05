package com.gsb.goodnews.domain;

import com.gsb.goodnews.util.TimeZoneUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Balance implements Serializable {

    public enum Type {
        PRINCIPAL,
        CUSTOMER,
        PROVIDER
    }

    @Id
    @GeneratedValue(generator = "cash_box_generator")
    @SequenceGenerator(name = "cash_box_generator", initialValue = 100)
    private long id;
    private String lastUpdated;
    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;
    private String type;

    @PreUpdate
    private void prePersist() {
        lastUpdated = TimeZoneUtils.now().toString();
    }
}
