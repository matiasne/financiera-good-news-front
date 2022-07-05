package com.gsb.goodnews.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthorizationRequestDto implements Serializable {

    private static final long serialVersionUID = 1L;

    String username;
    String password;
}
