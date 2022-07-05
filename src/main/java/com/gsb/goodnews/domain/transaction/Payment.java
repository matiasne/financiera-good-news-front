package com.gsb.goodnews.domain.transaction;

import com.gsb.goodnews.domain.Customer;
import com.gsb.goodnews.domain.PaymentIntention;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Payment extends Transaction {

    @ManyToOne
    private Customer customer;
    @ManyToOne
    @JoinColumn
    private PaymentIntention paymentIntention;
}
