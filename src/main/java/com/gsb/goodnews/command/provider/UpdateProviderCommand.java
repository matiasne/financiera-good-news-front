package com.gsb.goodnews.command.provider;

import com.gsb.goodnews.domain.Provider;
import com.gsb.goodnews.dto.person.ProviderDto;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.mapper.ProviderMapper;
import com.gsb.goodnews.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UpdateProviderCommand {

    private final ProviderRepository providerRepository;
    private final ProviderValidator providerValidator;
    private final ProviderMapper providerMapper;

    public Provider update(ProviderDto providerDto, long id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Provider not found with id " + id));

        providerValidator.validateUpdate(providerDto, provider);
        providerMapper.mapToEntity(providerDto, provider);

        return providerRepository.save(provider);
    }
}

