package com.gsb.goodnews.command.provider;

import com.gsb.goodnews.domain.Provider;
import com.gsb.goodnews.dto.person.ProviderDto;
import com.gsb.goodnews.mapper.ProviderMapper;
import com.gsb.goodnews.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class CreateProviderCommand {

    private final ProviderMapper providerMapper;
    private final ProviderValidator providerValidator;
    private final ProviderRepository providerRepository;

    public Provider create(ProviderDto dto) {
        providerValidator.validateCreate(dto);
        Provider provider = providerMapper.map(dto);
        provider.setPrevBalance(BigDecimal.ZERO);
        provider.setBalance(BigDecimal.ZERO);

        return providerRepository.save(provider);
    }
}
