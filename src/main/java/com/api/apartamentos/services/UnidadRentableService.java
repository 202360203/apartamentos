package com.api.apartamentos.services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.api.apartamentos.models.UnidadRentableModel;
import com.api.apartamentos.repositories.IUnidadRentableRepository;

@Service
public class UnidadRentableService extends BaseCrudService<UnidadRentableModel> {
    private final IUnidadRentableRepository unidadRepository;
    public UnidadRentableService(IUnidadRentableRepository repository) { super(repository); unidadRepository = repository; }
    public List<UnidadRentableModel> findByPropiedad(Long id) { return unidadRepository.findByPropiedad_IdPropiedad(id); }
}
