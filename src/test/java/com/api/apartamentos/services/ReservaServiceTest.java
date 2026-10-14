package com.api.apartamentos.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.api.apartamentos.models.ClienteModel;
import com.api.apartamentos.models.ReservaModel;
import com.api.apartamentos.models.UnidadRentableModel;
import com.api.apartamentos.repositories.IClienteRepository;
import com.api.apartamentos.repositories.IReservaRepository;
import com.api.apartamentos.repositories.IUnidadRentableRepository;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {
    @Mock
    private IReservaRepository reservaRepository;
    @Mock
    private IUnidadRentableRepository unidadRepository;
    @Mock
    private IClienteRepository clienteRepository;

    private ReservaService service;
    private UnidadRentableModel unidad;
    private ClienteModel cliente;

    @BeforeEach
    void setUp() {
        service = new ReservaService(reservaRepository, unidadRepository, clienteRepository);
        unidad = new UnidadRentableModel();
        unidad.setIdUnidad(1L);
        unidad.setPrecioNoche(new BigDecimal("1250.00"));
        cliente = new ClienteModel();
        cliente.setId(1L);
    }

    @Test
    void calculaImporteConPrecioPersistidoYNochesDelRango() {
        ReservaModel reserva = nuevaReserva();
        when(unidadRepository.findById(1L)).thenReturn(Optional.of(unidad));
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(reservaRepository.existeSolapamiento(eq(1L), eq(null), any(LocalDateTime.class), any(LocalDateTime.class))).thenReturn(false);
        when(reservaRepository.save(any(ReservaModel.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReservaModel guardada = service.save(reserva);

        assertEquals(new BigDecimal("6250.00"), guardada.getImporteTotal());
        assertEquals(unidad, guardada.getUnidad());
        assertEquals(cliente, guardada.getCliente());
        verify(reservaRepository).save(reserva);
    }

    @Test
    void rechazaUnidadInexistenteAntesDeGuardar() {
        when(unidadRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> service.save(nuevaReserva()));

        assertEquals("La unidad indicada no existe", exception.getMessage());
    }

    private ReservaModel nuevaReserva() {
        ReservaModel reserva = new ReservaModel();
        UnidadRentableModel unidadReferencia = new UnidadRentableModel();
        unidadReferencia.setIdUnidad(1L);
        ClienteModel clienteReferencia = new ClienteModel();
        clienteReferencia.setId(1L);
        reserva.setUnidad(unidadReferencia);
        reserva.setCliente(clienteReferencia);
        reserva.setFechaEntrada(LocalDateTime.parse("2026-10-10T15:00:00"));
        reserva.setFechaSalida(LocalDateTime.parse("2026-10-15T11:00:00"));
        reserva.setEstado("PENDIENTE");
        return reserva;
    }
}