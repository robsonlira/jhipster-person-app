package br.com.dominio.service.mapper;

import br.com.dominio.domain.*;
import br.com.dominio.service.dto.PhoneDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Phone} and its DTO {@link PhoneDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PhoneMapper extends EntityMapper<PhoneDTO, Phone> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PhoneDTO toDtoId(Phone phone);
}
