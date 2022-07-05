package com.gsb.goodnews.domain.transaction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gsb.goodnews.domain.Movement;
import com.gsb.goodnews.domain.Person;
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
import java.util.List;

@Entity
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Transaction implements Serializable {

    @Id
    @GeneratedValue(generator = "transaction_generator")
    @SequenceGenerator(name = "transaction_generator", initialValue = 100)
    protected long id;
    @Builder.Default
    protected String createdAt = TimeZoneUtils.now().toString();
    protected String lastUpdated;
    @Column(insertable = false, updatable = false)
    protected String dtype;
    @ManyToOne
    protected Person person;
    protected BigDecimal total;
    protected String status;
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    protected String notes;
    @JsonIgnore
    @OneToMany(targetEntity = Movement.class, mappedBy = "transaction", cascade = CascadeType.ALL)
    protected List<Movement> movements;

    @PreUpdate
    protected void prePersist() {
        lastUpdated = TimeZoneUtils.now().toString();
    }
}
