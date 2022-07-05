package com.gsb.goodnews.command.customerCommission;

import com.gsb.goodnews.command.customerCommission.validator.CustomerCommissionCreateValidator;
import com.gsb.goodnews.domain.CustomerCommission;
import com.gsb.goodnews.domain.QCustomerCommission;
import com.gsb.goodnews.dto.CustomerCommissionDto;
import com.gsb.goodnews.dto.CustomerCommissionsDto;
import com.gsb.goodnews.mapper.CustomerCommissionMapper;
import com.gsb.goodnews.queryobject.querydsl.JPAQueryFactory;
import com.gsb.goodnews.repository.CustomerCommissionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class UpdateCustomerCommissionCommand {

    private final CustomerCommissionCreateValidator customerCommissionCreateValidator;
    private final CustomerCommissionMapper customerCommissionMapper;
    private final CustomerCommissionRepository customerCommissionRepository;
    private final JPAQueryFactory jpaQueryFactory;

    public void update(CustomerCommissionsDto dto) {
        deactivateComissions(dto);
        activateComissions(dto);
    }

    private void activateComissions(CustomerCommissionsDto dto) {
        customerCommissionCreateValidator.validateCreate(dto);
        dto.getCommissions().forEach(customerCommissionDto -> {
            customerCommissionDto.setCustomerId(dto.getCustomerId());
            CustomerCommission customerCommission = customerCommissionMapper.map(customerCommissionDto);
            customerCommission.setId(customerCommissionDto.getId());
            customerCommissionRepository.save(customerCommission);
        });
    }

    private void deactivateComissions(CustomerCommissionsDto dto) {
        List<CustomerCommission> activeCommissions = getActiveComissions(dto.getCustomerId());
        List<Long> customerCommissionsDtoIds = dto.getCommissions().stream().map(CustomerCommissionDto::getId)
                .collect(Collectors.toList());
        List<CustomerCommission> customerCommissionsToDelete = activeCommissions.stream()
                .filter(providerAccount -> !customerCommissionsDtoIds.contains(providerAccount.getId()))
                .collect(Collectors.toList());

        for (var customerCommissionToDelete : customerCommissionsToDelete) {
            customerCommissionToDelete.setActive(false);
            customerCommissionRepository.save(customerCommissionToDelete);
        }
    }

    private List<CustomerCommission> getActiveComissions(long customerId) {
        QCustomerCommission q = QCustomerCommission.customerCommission;
        return jpaQueryFactory.get()
                .select(q)
                .from(q)
                .where(q.customer.id.eq(customerId)
                        .and(q.active.isTrue()))
                .fetch();
    }
}
