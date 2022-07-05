package com.gsb.goodnews.util;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomSerializer {
    private final ObjectMapper objectMapper;

    CustomSerializer() {
        this.objectMapper = new ObjectMapper()
                .setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
    }

    public <T> T readValue(String content, Class<T> clazz) throws IOException {
        return this.objectMapper.readValue(content, clazz);
    }

    public String writeValueAsString(Object value) throws IOException {
        return this.objectMapper.writeValueAsString(value);
    }
}
