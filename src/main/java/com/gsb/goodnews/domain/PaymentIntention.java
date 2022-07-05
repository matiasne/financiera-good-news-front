package com.gsb.goodnews.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gsb.goodnews.domain.transaction.Payment;
import com.gsb.goodnews.util.TimeZoneUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentIntention implements Serializable {

    @Id
    @GeneratedValue(generator = "payment_intention_generator")
    @SequenceGenerator(name = "payment_intention_generator", initialValue = 100)
    private long id;
    @Builder.Default
    private String createdAt = TimeZoneUtils.now().toString();
    private String lastUpdated;
    @ManyToOne
    private Customer customer;
    private BigDecimal total;
    private String receiverDocument;
    private String receiverName;
    private boolean payed;
    @JsonIgnore
    @OneToMany(targetEntity = Payment.class, mappedBy = "paymentIntention")
    private List<Payment> payments;
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String notes;

    @PreUpdate
    private void prePersist() {
        lastUpdated = TimeZoneUtils.now().toString();
    }
}
