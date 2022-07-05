package com.gsb.goodnews.command.balance;

import com.gsb.goodnews.domain.Balance;
import com.gsb.goodnews.repository.BalanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class UpdateCompanyBalanceCommand {

    private final BalanceRepository balanceRepository;

    public void add(BigDecimal total, Balance.Type type) {
        Balance balance = balanceRepository.findByType(type.name()).orElse(null);

        if (balance == null) {
            balance = Balance.builder()
                    .total(BigDecimal.ZERO)
                    .type(type.name())
                    .build();
        }

        balance.setTotal(balance.getTotal().add(total));
        balanceRepository.save(balance);
    }

    public void subtract(BigDecimal total, Balance.Type type) {
        Balance balance = balanceRepository.findByType(type.name()).orElse(null);

        if (balance == null) {
            balance = Balance.builder()
                    .total(BigDecimal.ZERO)
                    .type(type.name())
                    .build();
        }

        balance.setTotal(balance.getTotal().subtract(total));
        balanceRepository.save(balance);
    }
}
