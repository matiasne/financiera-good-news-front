package com.gsb.goodnews.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
public class Person implements Serializable {

    @Id
    @GeneratedValue(generator = "person_generator")
    @SequenceGenerator(name = "person_generator", initialValue = 100)
    private long id;
    @Builder.Default
    private String createdAt = TimeZoneUtils.now().toString();
    private String lastUpdated;
    @Column(insertable = false, updatable = false)
    private String dtype;
    private String name;
    private String email;
    private String phone;
    private String address;
    @Builder.Default
    private BigDecimal prevBalance = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal unconfirmedBalance = BigDecimal.ZERO;
    @JsonIgnore
    @OneToMany(targetEntity = Movement.class, mappedBy = "person", cascade = CascadeType.ALL)
    private List<Movement> movements;
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String notes;

    @PreUpdate
    private void prePersist() {
        lastUpdated = TimeZoneUtils.now().toString();
    }
}
