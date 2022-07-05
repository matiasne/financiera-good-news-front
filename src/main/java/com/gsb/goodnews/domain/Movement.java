package com.gsb.goodnews.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gsb.goodnews.domain.transaction.Transaction;
import com.gsb.goodnews.util.TimeZoneUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Movement implements Serializable {

    @Id
    @GeneratedValue(generator = "movement_generator")
    @SequenceGenerator(name = "movement_generator", initialValue = 100)
    protected long id;
    private String concept;
    @Builder.Default
    private String createdAt = TimeZoneUtils.now().toString();
    private String lastUpdated;
    private BigDecimal fee;
    private BigDecimal totalFee;
    private BigDecimal total;
    private BigDecimal prevBalance;
    private BigDecimal balance;
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String notes;
    @ManyToOne
    private Person person;
    @ManyToOne
    private Transaction transaction;
    @ManyToOne
    private ProviderAccount providerAccount;

    @PreUpdate
    private void prePersist() {
        lastUpdated = TimeZoneUtils.now().toString();
    }
}
