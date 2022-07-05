package com.gsb.goodnews.service;

import com.gsb.goodnews.command.transaction.providerCashDelivery.CreateProviderCashDeliveryCommand;
import com.gsb.goodnews.domain.transaction.ProviderCashDelivery;
import com.gsb.goodnews.dto.ProviderCashDeliveryDto;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.queryobject.ProviderCashDeliveryQueryObject;
import com.gsb.goodnews.queryobject.ProviderCashDeliverySearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.repository.ProviderCashDeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProviderCashDeliveryService {

    private final ProviderCashDeliveryRepository providerCashDeliveryRepository;
    private final ProviderCashDeliveryQueryObject providerCashDeliveryQueryObject;
    private final CreateProviderCashDeliveryCommand createProviderCashDeliveryCommand;

    public ProviderCashDelivery get(long id) {
        return providerCashDeliveryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Provider not found with id " + id));
    }

    public SearchResponseDto<ProviderCashDeliveryDto> search(ProviderCashDeliverySearchDto dto) {
        return providerCashDeliveryQueryObject.search(dto);
    }

    @Transactional
    public ProviderCashDelivery create(ProviderCashDeliveryDto dto) {
        return createProviderCashDeliveryCommand.create(dto);
    }
}
