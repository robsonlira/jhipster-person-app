package br.com.dominio.service.mapper;

import br.com.dominio.domain.*;
import br.com.dominio.service.dto.PersonDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Person} and its DTO {@link PersonDTO}.
 */
@Mapper(componentModel = "spring", uses = { PhoneMapper.class })
public interface PersonMapper extends EntityMapper<PersonDTO, Person> {
    @Mapping(target = "phone", source = "phone", qualifiedByName = "id")
    PersonDTO toDto(Person s);
}
