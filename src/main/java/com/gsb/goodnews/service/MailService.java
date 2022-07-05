package com.gsb.goodnews.service;

import com.gsb.goodnews.domain.transaction.Deposit;
import com.gsb.goodnews.dto.MovementDto;
import com.gsb.goodnews.queryobject.MovementQueryObject;
import com.gsb.goodnews.queryobject.MovementSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.simplejavamail.SimpleJavaMailClient;
import com.gsb.goodnews.util.ReaderUtils;
import com.gsb.goodnews.util.TimeZoneUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MailService {

    private final SimpleJavaMailClient simpleJavaMailClient;
    private final MovementQueryObject movementQueryObject;
    private final Environment env;

    @Value("classpath:templates/daily-email-financiera.html")
    private Resource financieraTemplate;

    @Value("classpath:templates/daily-email-provider.html")
    private Resource providerTempalte;

    @Value("classpath:templates/daily-email-customer.html")
    private Resource customerTemplate;

    public void sendMails() {
        SearchResponseDto<MovementDto> result = movementQueryObject.search(
                MovementSearchDto.builder()
                        .from(TimeZoneUtils.now().withTimeAtStartOfDay().toString())
                        .to(TimeZoneUtils.now().toString())
                        .build());

        Set<Long> personsIds = result.getData().stream()
                .filter(movementDto -> !StringUtils.isBlank(movementDto.getPersonEmail()))
                .map(MovementDto::getPersonId).collect(Collectors.toSet());

        for (Long personId : personsIds) {
            List<MovementDto> movements = result.getData().stream()
                    .filter(movementDto -> movementDto.getPersonId() == personId).collect(Collectors.toList());

            if (!movements.isEmpty()
                    && "CUSTOMER".equalsIgnoreCase(movements.get(0).getPersonDtype())) {
                sendMailToCustomer(movements);
            } else {
                sendMailToProvider(movements);
            }
        }

        sendMailToFinanciera(result.getData());
    }

    private void sendMailToProvider(List<MovementDto> movements) {
        if (movements.isEmpty()) {
            return;
        }

        StringBuilder table = new StringBuilder();
        for (MovementDto movementDto : movements) {

            if ("DEPOSIT".equalsIgnoreCase(movementDto.getTransactionDtype())
                    && Deposit.Status.INGRESADO.name().equalsIgnoreCase(movementDto.getTransactionStatus())) {
                continue;
            }

            table
                    .append("<tr style=\"font-size:14px;line-height:22px;font-family:'Open Sans', sans-serif !important;\">")
                    .append("<td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">")
                    .append(movementDto.getId())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">")
                    .append(movementDto.getCreatedAt())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">")
                    .append(movementDto.getConcept())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">$")
                    .append(movementDto.getTotal())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">$")
                    .append(movementDto.getFee().multiply(movementDto.getTotal()).divide(BigDecimal.valueOf(100.00), 2, RoundingMode.CEILING))
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">$")
                    .append(movementDto.getBalance())
                    .append("</td></tr>");
        }

        String downloadLink = String.format(
                "https://goodnews-front.vercel.app/tickets?providerId=%s&from=%s&to=%s", movements.get(0).getPersonId(),
                TimeZoneUtils.now().withTimeAtStartOfDay(), TimeZoneUtils.now().plusDays(1).withTimeAtStartOfDay());

        String body = String.format(
                ReaderUtils.read(providerTempalte),
                TimeZoneUtils.now(),
                movements.get(0).getBalance().toString(),
                table,
                downloadLink);

        simpleJavaMailClient.send(
                env.getProperty("mailing.from"),
                "mgoldblat@gmail.com",
                "Resumen de cuenta",
                body);
    }

    private void sendMailToCustomer(List<MovementDto> movements) {
        if (movements.isEmpty())
            return;

        StringBuilder table = new StringBuilder();
        for (MovementDto movementDto : movements) {
            table
                    .append("<tr style=\"font-size:14px;line-height:22px;font-family:'Open Sans', sans-serif !important;\">")
                    .append("<td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">")
                    .append(movementDto.getId())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">")
                    .append(movementDto.getCreatedAt())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">")
                    .append(movementDto.getConcept())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">$")
                    .append(movementDto.getTotal())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">$")
                    .append(movementDto.getTotalFee().multiply(movementDto.getTotal()).divide(BigDecimal.valueOf(100.00), 2, RoundingMode.CEILING))
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">$")
                    .append(movementDto.getBalance())
                    .append("</td></tr>");
        }

        String body = String.format(
                ReaderUtils.read(customerTemplate),
                TimeZoneUtils.now(),
                movements.get(0).getBalance().toString(),
                table);

        simpleJavaMailClient.send(
                env.getProperty("mailing.from"),
                "mgoldblat@gmail.com",
                "Resumen de cuenta",
                body);
    }

    private void sendMailToFinanciera(List<MovementDto> movements) {
        if (movements.isEmpty())
            return;

        StringBuilder table = new StringBuilder();
        for (MovementDto movementDto : movements) {
            table
                    .append("<tr style=\"font-size:14px;line-height:22px;font-family:'Open Sans', sans-serif !important;\">")
                    .append("<td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">")
                    .append(movementDto.getId())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">")
                    .append(movementDto.getCreatedAt())
                    .append("<td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">")
                    .append(movementDto.getPersonName())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">")
                    .append(movementDto.getConcept())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">$")
                    .append(movementDto.getTotal())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">%")
                    .append(movementDto.getTotalFee())
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">$")
                    .append("CUSTOMER".equalsIgnoreCase(movementDto.getPersonDtype())
                            ? movementDto.getFee().multiply(movementDto.getTotal()).divide(BigDecimal.valueOf(100.00), 2, RoundingMode.CEILING)
                            : "0.00")
                    .append("</td><td style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:14px;line-height:22px;text-align:left;padding:6px;border-bottom:1px solid rgba(0, 0, 0, .15);white-space:nowrap;font-family:'Open Sans', sans-serif !important;\">$")
                    .append(movementDto.getBalance())
                    .append("</td></tr>");
        }

        String body = String.format(
                ReaderUtils.read(financieraTemplate),
                TimeZoneUtils.now(),
                movements.get(0).getBalance().toString(),
                table);

        simpleJavaMailClient.send(
                env.getProperty("mailing.from"),
                "mgoldblat@gmail.com",
                "Resumen de cuenta",
                body);

    }
}
