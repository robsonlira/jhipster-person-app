package br.com.dominio.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PhoneMapperTest {

    private PhoneMapper phoneMapper;

    @BeforeEach
    public void setUp() {
        phoneMapper = new PhoneMapperImpl();
    }
}
