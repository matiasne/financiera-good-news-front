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
public class CustomerCommission implements Serializable {

    @Id
    @GeneratedValue(generator = "customer_commission_generator")
    @SequenceGenerator(name = "customer_commission_generator", initialValue = 100)
    private long id;
    @Builder.Default
    private String createdAt = TimeZoneUtils.now().toString();
    private String lastUpdated;
    @Builder.Default
    private boolean active = true;
    @ManyToOne
    @JoinColumn(nullable = false)
    private Customer customer;
    @ManyToOne
    @JoinColumn(nullable = false)
    private ProviderAccount providerAccount;
    private BigDecimal fee;

    @PreUpdate
    private void prePersist() {
        lastUpdated = TimeZoneUtils.now().toString();
    }
}
