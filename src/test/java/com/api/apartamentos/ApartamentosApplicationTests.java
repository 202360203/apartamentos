package com.api.apartamentos;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.api.apartamentos.models.ClienteModel;

import tools.jackson.databind.ObjectMapper;

@SpringBootTest
class ApartamentosApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void clientePasswordCanBeReadButIsNeverSerialized() throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		ClienteModel cliente = mapper.readValue("{\"password\":\"ClienteSegura123!\"}", ClienteModel.class);

		assertEquals("ClienteSegura123!", cliente.getPassword());
		assertFalse(mapper.writeValueAsString(cliente).contains("ClienteSegura123!"));
	}

}
