package com.gsb.goodnews.simplejavamail;

import lombok.RequiredArgsConstructor;
import org.simplejavamail.api.email.Email;
import org.simplejavamail.email.EmailBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SimpleJavaMailClient {

    private static final Logger logger = LoggerFactory.getLogger(SimpleJavaMailClient.class);

    private final MyMailerFactory myMailerFactory;

    public void send(String from, String to, String subject, String body) {
        Email email = EmailBuilder.startingBlank()
                .from(from)
                .to(to)
                .withSubject(subject)
                .withHTMLText(body)
                .buildEmail();

        try {
            this.myMailerFactory.get().sendMail(email);
        } catch (Exception ignored) {
            logger.error("No se pudo enviar el mail!");
        }
    }
}
