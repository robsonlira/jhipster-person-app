package br.com.dominio.domain;

import br.com.dominio.domain.enumeration.PhoneType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Phone.
 */
@Entity
@Table(name = "phone")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Phone implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "number", nullable = false)
    private String number;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "phone_type", nullable = false)
    private PhoneType phoneType;

    @OneToMany(mappedBy = "phone")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "phone" }, allowSetters = true)
    private Set<Person> people = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Phone id(Long id) {
        this.id = id;
        return this;
    }

    public String getNumber() {
        return this.number;
    }

    public Phone number(String number) {
        this.number = number;
        return this;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public PhoneType getPhoneType() {
        return this.phoneType;
    }

    public Phone phoneType(PhoneType phoneType) {
        this.phoneType = phoneType;
        return this;
    }

    public void setPhoneType(PhoneType phoneType) {
        this.phoneType = phoneType;
    }

    public Set<Person> getPeople() {
        return this.people;
    }

    public Phone people(Set<Person> people) {
        this.setPeople(people);
        return this;
    }

    public Phone addPerson(Person person) {
        this.people.add(person);
        person.setPhone(this);
        return this;
    }

    public Phone removePerson(Person person) {
        this.people.remove(person);
        person.setPhone(null);
        return this;
    }

    public void setPeople(Set<Person> people) {
        if (this.people != null) {
            this.people.forEach(i -> i.setPhone(null));
        }
        if (people != null) {
            people.forEach(i -> i.setPhone(this));
        }
        this.people = people;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Phone)) {
            return false;
        }
        return id != null && id.equals(((Phone) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Phone{" +
            "id=" + getId() +
            ", number='" + getNumber() + "'" +
            ", phoneType='" + getPhoneType() + "'" +
            "}";
    }
}
