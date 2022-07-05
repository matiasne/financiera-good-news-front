package com.gsb.goodnews.simplejavamail;

import lombok.RequiredArgsConstructor;
import org.simplejavamail.api.mailer.Mailer;
import org.simplejavamail.api.mailer.config.TransportStrategy;
import org.simplejavamail.mailer.MailerBuilder;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class MyMailerFactory {

    private final Environment env;

    private Mailer mailer;

    public Mailer get() {
        if (this.mailer == null) {
            this.mailer = MailerBuilder
                    .withSMTPServer(
                            env.getProperty("mailing.host"),
                            Integer.parseInt(Objects.requireNonNull(env.getProperty("mailing.port"))),
                            env.getProperty("mailing.user"),
                            env.getProperty("mailing.pass"))
                    .withTransportStrategy(TransportStrategy.SMTP)
                    .buildMailer();
        }

        return this.mailer;
    }
}
