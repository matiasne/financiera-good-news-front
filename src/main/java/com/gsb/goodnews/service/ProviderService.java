package com.gsb.goodnews.service;

import com.gsb.goodnews.command.provider.CreateProviderCommand;
import com.gsb.goodnews.command.provider.UpdateProviderCommand;
import com.gsb.goodnews.domain.Provider;
import com.gsb.goodnews.dto.person.ProviderDto;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.queryobject.ProviderQueryObject;
import com.gsb.goodnews.queryobject.ProviderSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final ProviderQueryObject providerQueryObject;
    private final CreateProviderCommand createProviderCommand;
    private final UpdateProviderCommand updateProviderCommand;

    public Provider get(long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Provider not found with id " + id));
    }

    public SearchResponseDto<ProviderDto> search(ProviderSearchDto dto) {
        return providerQueryObject.search(dto);
    }

    @Transactional
    public Provider create(ProviderDto dto) {
        return createProviderCommand.create(dto);
    }

    @Transactional
    public Provider update(ProviderDto dto, long id) {
        return updateProviderCommand.update(dto, id);
    }
}
