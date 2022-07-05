package com.gsb.goodnews.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsb.goodnews.security.constant.SecurityConstants;
import com.gsb.goodnews.security.dto.AuthorizationRequestDto;
import com.gsb.goodnews.security.utils.TokenUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
        super.setAuthenticationFailureHandler(new JwtAuthenticationFailureHandler());
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        try {
            AuthorizationRequestDto authorizationRequestDto = new ObjectMapper().readValue(request.getInputStream(), AuthorizationRequestDto.class);
            UsernamePasswordAuthenticationToken user = new UsernamePasswordAuthenticationToken(
                    authorizationRequestDto.getUsername(), authorizationRequestDto.getPassword());

            return this.authenticationManager.authenticate(user);
        } catch (IOException e) {
            return null;
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) {
        String token = TokenUtil.INSTANCE.generateToken(authResult);
        response.addHeader(SecurityConstants.HEADER_AUTHORIZATION_KEY, SecurityConstants.TOKEN_BEARER_PREFIX + " " + token);
    }
}
