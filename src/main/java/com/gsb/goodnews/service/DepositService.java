package com.gsb.goodnews.service;

import com.gsb.goodnews.command.transaction.deposit.CreateDepositCommand;
import com.gsb.goodnews.command.transaction.deposit.UpdateDepositStatusCommand;
import com.gsb.goodnews.domain.transaction.Deposit;
import com.gsb.goodnews.dto.DepositDto;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.queryobject.DepositQueryObject;
import com.gsb.goodnews.queryobject.DepositSearchDto;
import com.gsb.goodnews.queryobject.TicketsQueryObject;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.repository.DepositRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DepositService {

    private final DepositRepository depositRepository;
    private final DepositQueryObject depositQueryObject;
    private final TicketsQueryObject ticketsQueryObject;
    private final CreateDepositCommand createDepositCommand;
    private final UpdateDepositStatusCommand updateDepositStatusCommand;

    public Deposit getById(long id) {
        return depositRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Provider not found with id " + id));
    }

    public Deposit getByInternalId(String internalId) {
        return depositRepository.findByInternalId(internalId)
                .orElseThrow(() -> new NotFoundException("Provider not found with id " + internalId));
    }

    public SearchResponseDto<DepositDto> search(DepositSearchDto dto) {
        return depositQueryObject.search(dto);
    }

    public SearchResponseDto<DepositDto> searchTickets(DepositSearchDto dto) {
        return ticketsQueryObject.search(dto);
    }

    @Transactional
    public Deposit create(DepositDto dto) {
        return createDepositCommand.create(dto);
    }

    @Transactional
    public Deposit update(long id, String status) {
        return updateDepositStatusCommand.update(id, status);
    }
}
