package br.com.dominio.service.mapper;

import br.com.dominio.domain.*;
import br.com.dominio.service.dto.PhoneDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Phone} and its DTO {@link PhoneDTO}.
 */
@Mapper(componentModel = "spring", uses = { PersonMapper.class })
public interface PhoneMapper extends EntityMapper<PhoneDTO, Phone> {
    @Mapping(target = "person", source = "person", qualifiedByName = "id")
    PhoneDTO toDto(Phone s);
}
