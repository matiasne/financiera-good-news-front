package com.gsb.goodnews.command.providerAccount;


import com.gsb.goodnews.command.providerAccount.validator.ProviderAccountCreateValidator;
import com.gsb.goodnews.domain.ProviderAccount;
import com.gsb.goodnews.domain.QProviderAccount;
import com.gsb.goodnews.dto.ProviderAccountDto;
import com.gsb.goodnews.dto.ProviderAccountsDto;
import com.gsb.goodnews.mapper.ProviderAccountMapper;
import com.gsb.goodnews.queryobject.querydsl.JPAQueryFactory;
import com.gsb.goodnews.repository.ProviderAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UpdateProviderAccountsCommand {

    private final JPAQueryFactory jpaQueryFactory;
    private final ProviderAccountMapper providerAccountMapper;
    private final ProviderAccountCreateValidator providerAccountCreateValidator;
    private final ProviderAccountRepository providerAccountRepository;

    public void update(ProviderAccountsDto dto) {
        deactivateAccounts(dto);
        activateAccounts(dto);
    }

    private void activateAccounts(ProviderAccountsDto dto) {
        providerAccountCreateValidator.validateCreate(dto);
        dto.getAccounts().forEach(providerAccountDto -> {
            providerAccountDto.setProviderId(dto.getProviderId());
            ProviderAccount providerAccount = providerAccountMapper.map(providerAccountDto);
            providerAccount.setId(providerAccountDto.getId());
            providerAccount.setActive(true);
            providerAccountRepository.save(providerAccount);
        });
    }

    private void deactivateAccounts(ProviderAccountsDto dto) {
        List<ProviderAccount> providerAccounts = getActiveAccounts(dto.getProviderId());
        List<Long> providerAccountsDtoIds = dto.getAccounts().stream().map(ProviderAccountDto::getId)
                .collect(Collectors.toList());
        List<ProviderAccount> providerAccountsToDelete = providerAccounts.stream()
                .filter(providerAccount -> !providerAccountsDtoIds.contains(providerAccount.getId()))
                .collect(Collectors.toList());

        for (var providerAccountToDelete : providerAccountsToDelete) {
            providerAccountToDelete.setActive(false);
            providerAccountRepository.save(providerAccountToDelete);
        }
    }

    private List<ProviderAccount> getActiveAccounts(long providerId) {
        QProviderAccount q = QProviderAccount.providerAccount;
        return jpaQueryFactory.get()
                .select(q)
                .from(q)
                .where(q.provider.id.eq(providerId)
                        .and(q.active.isTrue()))
                .fetch();
    }
}
