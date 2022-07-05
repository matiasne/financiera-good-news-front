package com.gsb.goodnews.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gsb.goodnews.domain.transaction.Deposit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Customer extends Person {

    @JsonIgnore
    @OneToMany(targetEntity = CustomerCommission.class, mappedBy = "customer")
    private List<CustomerCommission> customerCommissions;
    @JsonIgnore
    @OneToMany(targetEntity = Deposit.class, mappedBy = "customer")
    private List<Deposit> deposits;
    @JsonIgnore
    @OneToMany(targetEntity = PaymentIntention.class, mappedBy = "customer")
    private List<PaymentIntention> paymentIntentions;
}
