package com.gsb.goodnews.controller;

import com.gsb.goodnews.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mails")
@RequiredArgsConstructor
@CrossOrigin
public class MailController {

    private final MailService mailService;

    @PostMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void sendMails() {
        mailService.sendMails();
//        CompletableFuture.runAsync(mailService::sendMails);
    }
}
