package com.gsb.goodnews.command.transaction.providerCashDelivery;

import com.gsb.goodnews.command.balance.UpdateCompanyBalanceCommand;
import com.gsb.goodnews.command.movement.CreateMovementCommand;
import com.gsb.goodnews.domain.Balance;
import com.gsb.goodnews.domain.Provider;
import com.gsb.goodnews.domain.transaction.ProviderCashDelivery;
import com.gsb.goodnews.dto.ProviderCashDeliveryDto;
import com.gsb.goodnews.mapper.ProviderCashDeliveryMapper;
import com.gsb.goodnews.repository.ProviderCashDeliveryRepository;
import com.gsb.goodnews.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class CreateProviderCashDeliveryCommand {

    private final ProviderCashDeliveryMapper providerCashDeliveryMapper;
    private final ProviderCashDeliveryValidator providerCashDeliveryValidator;
    private final ProviderCashDeliveryRepository providerCashDeliveryRepository;
    private final UpdateCompanyBalanceCommand updateCompanyBalanceCommand;
    private final CreateMovementCommand createMovementCommand;
    private final ProviderRepository providerRepository;

    public ProviderCashDelivery create(ProviderCashDeliveryDto dto) {
        providerCashDeliveryValidator.validateCreate(dto);
        ProviderCashDelivery providerCashDelivery = providerCashDeliveryMapper.map(dto);
        providerCashDelivery = providerCashDeliveryRepository.save(providerCashDelivery);

        updateCompanyBalanceCommand.add(dto.getTotal(), Balance.Type.PRINCIPAL);
        updateCompanyBalanceCommand.subtract(dto.getTotal(), Balance.Type.PROVIDER);

        Provider provider = updateProviderBalance(dto);

        createMovementCommand.create(
                provider,
                providerCashDelivery,
                null,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                "Pago de Proveedor",
                dto.getNotes());

        return providerCashDelivery;
    }

    private Provider updateProviderBalance(ProviderCashDeliveryDto dto) {
        Provider provider = providerRepository.getById(dto.getProviderId());
        provider.setPrevBalance(provider.getBalance());
        provider.setBalance(provider.getBalance().subtract(dto.getTotal()));
        providerRepository.save(provider);
        return provider;
    }
}
