package com.gsb.goodnews;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

//@SpringBootApplication
//public class FinancieraApplication {
//
//	public static void main(String[] args) {
//		SpringApplication.run(FinancieraApplication.class, args);
//	}
//}

/**
 * https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto-create-a-deployable-war-file
 */
@SpringBootApplication
public class FinancieraApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(FinancieraApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(FinancieraApplication.class);
    }
}