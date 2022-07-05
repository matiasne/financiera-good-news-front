package com.gsb.goodnews.domain.transaction;

import com.gsb.goodnews.domain.Customer;
import com.gsb.goodnews.domain.ProviderAccount;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Type;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;

@Entity
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Deposit extends Transaction {

    private BigDecimal customerFee;

    private String internalId;
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String file;
    private boolean computable;
    @ManyToOne
    private Customer customer;
    private BigDecimal providerAccountFee;
    @ManyToOne
    private ProviderAccount providerAccount;
    private String cuit;

    public enum Status {
        INGRESADO,
        CONFIRMADO,
        CUIT_INCORRECTO,
        PENDIENTE_DE_ACREDITACION,
        RECHAZADO,
        ERROR_DE_CARGA
    }
}
