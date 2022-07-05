package com.gsb.goodnews.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gsb.goodnews.domain.transaction.Deposit;
import com.gsb.goodnews.util.TimeZoneUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProviderAccount implements Serializable {

    @Id
    @GeneratedValue(generator = "provider_account_generator")
    @SequenceGenerator(name = "provider_account_generator", initialValue = 100)
    private long id;
    @Builder.Default
    private String createdAt = TimeZoneUtils.now().toString();
    private String lastUpdated;
    @Builder.Default
    private boolean active = true;
    @ManyToOne
    @JoinColumn(nullable = false)
    public Provider provider;
    private String name;
    private String accountNumber;
    private String bank;
    private String type;
    private String cbu;
    private BigDecimal fee;
    private BigDecimal quota;
    @JsonIgnore
    @OneToMany(targetEntity = CustomerCommission.class, mappedBy = "providerAccount")
    private List<CustomerCommission> customerCommissions;
    @JsonIgnore
    @OneToMany(targetEntity = Deposit.class, mappedBy = "providerAccount")
    private List<Deposit> deposits;
    @JsonIgnore
    @OneToMany(targetEntity = Movement.class, mappedBy = "providerAccount")
    protected List<Movement> movements;

    @PreUpdate
    private void prePersist() {
        lastUpdated = TimeZoneUtils.now().toString();
    }
}
