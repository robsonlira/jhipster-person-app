package br.com.dominio.service;

import br.com.dominio.domain.Phone;
import br.com.dominio.repository.PhoneRepository;
import br.com.dominio.service.dto.PhoneDTO;
import br.com.dominio.service.mapper.PhoneMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Phone}.
 */
@Service
@Transactional
public class PhoneService {

    private final Logger log = LoggerFactory.getLogger(PhoneService.class);

    private final PhoneRepository phoneRepository;

    private final PhoneMapper phoneMapper;

    public PhoneService(PhoneRepository phoneRepository, PhoneMapper phoneMapper) {
        this.phoneRepository = phoneRepository;
        this.phoneMapper = phoneMapper;
    }

    /**
     * Save a phone.
     *
     * @param phoneDTO the entity to save.
     * @return the persisted entity.
     */
    public PhoneDTO save(PhoneDTO phoneDTO) {
        log.debug("Request to save Phone : {}", phoneDTO);
        Phone phone = phoneMapper.toEntity(phoneDTO);
        phone = phoneRepository.save(phone);
        return phoneMapper.toDto(phone);
    }

    /**
     * Partially update a phone.
     *
     * @param phoneDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PhoneDTO> partialUpdate(PhoneDTO phoneDTO) {
        log.debug("Request to partially update Phone : {}", phoneDTO);

        return phoneRepository
            .findById(phoneDTO.getId())
            .map(
                existingPhone -> {
                    phoneMapper.partialUpdate(existingPhone, phoneDTO);

                    return existingPhone;
                }
            )
            .map(phoneRepository::save)
            .map(phoneMapper::toDto);
    }

    /**
     * Get all the phones.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<PhoneDTO> findAll() {
        log.debug("Request to get all Phones");
        return phoneRepository.findAll().stream().map(phoneMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one phone by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PhoneDTO> findOne(Long id) {
        log.debug("Request to get Phone : {}", id);
        return phoneRepository.findById(id).map(phoneMapper::toDto);
    }

    /**
     * Delete the phone by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Phone : {}", id);
        phoneRepository.deleteById(id);
    }
}
