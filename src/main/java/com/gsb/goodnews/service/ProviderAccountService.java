package com.gsb.goodnews.service;

import com.gsb.goodnews.command.providerAccount.UpdateProviderAccountsCommand;
import com.gsb.goodnews.domain.ProviderAccount;
import com.gsb.goodnews.dto.ProviderAccountDto;
import com.gsb.goodnews.dto.ProviderAccountsDto;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.queryobject.ProviderAccountQueryObject;
import com.gsb.goodnews.queryobject.ProviderAccountSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.repository.ProviderAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProviderAccountService {

    private final ProviderAccountRepository providerAccountRepository;
    private final ProviderAccountQueryObject providerAccountQueryObject;
    private final UpdateProviderAccountsCommand updateProviderAccountsCommand;

    public ProviderAccount get(long id) {
        return providerAccountRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Provider not found with id " + id));
    }

    public SearchResponseDto<ProviderAccountDto> search(ProviderAccountSearchDto dto) {
        return providerAccountQueryObject.search(dto);
    }

    @Transactional
    public void update(ProviderAccountsDto dto) {
        updateProviderAccountsCommand.update(dto);
    }
}
