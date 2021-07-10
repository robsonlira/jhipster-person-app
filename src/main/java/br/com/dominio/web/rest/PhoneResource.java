package br.com.dominio.web.rest;

import br.com.dominio.repository.PhoneRepository;
import br.com.dominio.service.PhoneService;
import br.com.dominio.service.dto.PhoneDTO;
import br.com.dominio.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.dominio.domain.Phone}.
 */
@RestController
@RequestMapping("/api")
public class PhoneResource {

    private final Logger log = LoggerFactory.getLogger(PhoneResource.class);

    private static final String ENTITY_NAME = "phone";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PhoneService phoneService;

    private final PhoneRepository phoneRepository;

    public PhoneResource(PhoneService phoneService, PhoneRepository phoneRepository) {
        this.phoneService = phoneService;
        this.phoneRepository = phoneRepository;
    }

    /**
     * {@code POST  /phones} : Create a new phone.
     *
     * @param phoneDTO the phoneDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new phoneDTO, or with status {@code 400 (Bad Request)} if the phone has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/phones")
    public ResponseEntity<PhoneDTO> createPhone(@Valid @RequestBody PhoneDTO phoneDTO) throws URISyntaxException {
        log.debug("REST request to save Phone : {}", phoneDTO);
        if (phoneDTO.getId() != null) {
            throw new BadRequestAlertException("A new phone cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PhoneDTO result = phoneService.save(phoneDTO);
        return ResponseEntity
            .created(new URI("/api/phones/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /phones/:id} : Updates an existing phone.
     *
     * @param id the id of the phoneDTO to save.
     * @param phoneDTO the phoneDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phoneDTO,
     * or with status {@code 400 (Bad Request)} if the phoneDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the phoneDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/phones/{id}")
    public ResponseEntity<PhoneDTO> updatePhone(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PhoneDTO phoneDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Phone : {}, {}", id, phoneDTO);
        if (phoneDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phoneDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!phoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PhoneDTO result = phoneService.save(phoneDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, phoneDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /phones/:id} : Partial updates given fields of an existing phone, field will ignore if it is null
     *
     * @param id the id of the phoneDTO to save.
     * @param phoneDTO the phoneDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phoneDTO,
     * or with status {@code 400 (Bad Request)} if the phoneDTO is not valid,
     * or with status {@code 404 (Not Found)} if the phoneDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the phoneDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/phones/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<PhoneDTO> partialUpdatePhone(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PhoneDTO phoneDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Phone partially : {}, {}", id, phoneDTO);
        if (phoneDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phoneDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!phoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PhoneDTO> result = phoneService.partialUpdate(phoneDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, phoneDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /phones} : get all the phones.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of phones in body.
     */
    @GetMapping("/phones")
    public List<PhoneDTO> getAllPhones() {
        log.debug("REST request to get all Phones");
        return phoneService.findAll();
    }

    /**
     * {@code GET  /phones/:id} : get the "id" phone.
     *
     * @param id the id of the phoneDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the phoneDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/phones/{id}")
    public ResponseEntity<PhoneDTO> getPhone(@PathVariable Long id) {
        log.debug("REST request to get Phone : {}", id);
        Optional<PhoneDTO> phoneDTO = phoneService.findOne(id);
        return ResponseUtil.wrapOrNotFound(phoneDTO);
    }

    /**
     * {@code DELETE  /phones/:id} : delete the "id" phone.
     *
     * @param id the id of the phoneDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/phones/{id}")
    public ResponseEntity<Void> deletePhone(@PathVariable Long id) {
        log.debug("REST request to delete Phone : {}", id);
        phoneService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
