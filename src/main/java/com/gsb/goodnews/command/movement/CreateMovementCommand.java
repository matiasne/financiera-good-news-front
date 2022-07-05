package com.gsb.goodnews.command.movement;

import com.gsb.goodnews.domain.Movement;
import com.gsb.goodnews.domain.Person;
import com.gsb.goodnews.domain.ProviderAccount;
import com.gsb.goodnews.domain.transaction.Transaction;
import com.gsb.goodnews.repository.MovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class CreateMovementCommand {

    private final MovementRepository movementRepository;

    public Movement create(Person person, Transaction transaction, ProviderAccount providerAccount, BigDecimal fee, BigDecimal totalFee, String concept, String notes) {
        Movement movement = Movement.builder()
                .person(person)
                .prevBalance(person.getPrevBalance())
                .balance(person.getBalance())
                .transaction(transaction)
                .fee(fee)
                .totalFee(totalFee)
                .providerAccount(providerAccount)
                .total(transaction.getTotal())
                .concept(concept)
                .notes(notes)
                .build();

        return movementRepository.save(movement);
    }
}
