package com.api.apartamentos.models;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "unidades_rentables")
public class UnidadRentableModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "id_unidad") private Long idUnidad;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "id_propiedad", nullable = false)
    @JsonIgnoreProperties({"propietario", "hibernateLazyInitializer", "handler"}) private PropiedadModel propiedad;
    @Column(nullable = false, length = 100) private String nombre;
    @Column(nullable = false, length = 40) private String tipo;
    @Column(nullable = false) private int capacidad;
    @Column(name = "precio_noche", nullable = false, precision = 12, scale = 2) private BigDecimal precioNoche;
    @Column(nullable = false, length = 20) private String estado = "DISPONIBLE";
    public Long getIdUnidad() { return idUnidad; } public void setIdUnidad(Long value) { idUnidad = value; }
    public PropiedadModel getPropiedad() { return propiedad; } public void setPropiedad(PropiedadModel value) { propiedad = value; }
    public String getNombre() { return nombre; } public void setNombre(String value) { nombre = value; }
    public String getTipo() { return tipo; } public void setTipo(String value) { tipo = value; }
    public int getCapacidad() { return capacidad; } public void setCapacidad(int value) { capacidad = value; }
    public BigDecimal getPrecioNoche() { return precioNoche; } public void setPrecioNoche(BigDecimal value) { precioNoche = value; }
    public String getEstado() { return estado; } public void setEstado(String value) { estado = value; }
}
