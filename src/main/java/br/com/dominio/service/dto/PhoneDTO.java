package br.com.dominio.service.dto;

import br.com.dominio.domain.enumeration.PhoneType;
import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link br.com.dominio.domain.Phone} entity.
 */
public class PhoneDTO implements Serializable {

    private Long id;

    @NotNull
    private String number;

    @NotNull
    private PhoneType phoneType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public PhoneType getPhoneType() {
        return phoneType;
    }

    public void setPhoneType(PhoneType phoneType) {
        this.phoneType = phoneType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PhoneDTO)) {
            return false;
        }

        PhoneDTO phoneDTO = (PhoneDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, phoneDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PhoneDTO{" +
            "id=" + getId() +
            ", number='" + getNumber() + "'" +
            ", phoneType='" + getPhoneType() + "'" +
            "}";
    }
}
