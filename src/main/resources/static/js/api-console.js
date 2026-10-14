(() => {
    const examples = {
        clientes: { tipo: "CLIENTE", nombres: "Ana", apellidos: "Garcia Lopez", email: "ana.garcia@example.com", telefono: "+525512345678", fechaNacimiento: "1990-05-15", ine: "INE-ANA-001", direccion: "Av. Reforma 100", password: "ClienteSegura123!", estatus: "ACTIVO" },
        propiedades: { propietario: { id: 1 }, tipo: "APARTAMENTO", titulo: "Apartamento Centro", descripcion: "Apartamento amueblado", direccion: "Calle Juarez 25", ciudad: "Ciudad de Mexico", estadoFederativo: "CDMX", codigoPostal: "06000", pais: "Mexico", latitud: 19.4326, longitud: -99.1332, precioNoche: 1250, capacidad: 4, numHabitaciones: 2, numBanos: 1, metrosCuadrados: 85, comodidades: "WiFi, cocina equipada", reglas: "No fumar", estado: "DISPONIBLE" },
        reservas: { unidad: { idUnidad: 1 }, cliente: { id: 1 }, fechaEntrada: "2026-10-10T15:00:00", fechaSalida: "2026-10-15T11:00:00", estado: "PENDIENTE", comentario: "Llegada despues de las 15:00" },
        pagos: { reserva: { idReservacion: 1 }, importe: 6250, fechaVencimiento: "2026-10-05", metodo: "TRANSFERENCIA", estado: "PENDIENTE" },
        unidades: { propiedad: { idPropiedad: 1 }, nombre: "Unidad Centro 101", tipo: "APARTAMENTO_COMPLETO", capacidad: 4, precioNoche: 1250, estado: "DISPONIBLE" },
        disponibilidades: { unidad: { idUnidad: 1 }, fechaInicio: "2026-10-01T00:00:00", fechaFin: "2026-12-31T23:59:59", disponible: true, precioEspecial: 1150 },
        imagenes: { propiedad: { idPropiedad: 1 }, url: "https://images.example.com/apartamento.jpg", descripcion: "Vista principal" },
        resenas: { reserva: { idReservacion: 1 }, cliente: { id: 1 }, calificacionGeneral: 5, calificacionComunicacion: 5, comentario: "Excelente estancia" },
        notificaciones: { remitente: { id: 1 }, destinatario: { id: 1 }, asunto: "Reserva recibida", mensaje: "Tu reserva fue registrada correctamente.", estado: "NO_LEIDA" }
    };

    const resources = [
        { key: "clientes", label: "Clientes", path: "/api/clientes" },
        { key: "propiedades", label: "Propiedades", path: "/api/propiedades" },
        { key: "reservas", label: "Reservas", path: "/api/reservas" },
        { key: "pagos", label: "Pagos", path: "/api/pagos", related: [{ label: "Por reserva", path: "/reserva/" }], extra: [{ key: "confirm", label: "Confirmar pago", method: "POST", suffix: "/confirmar" }, { key: "refund", label: "Reembolsar pago", method: "POST", suffix: "/reembolsar" }] },
        { key: "unidades", label: "Unidades rentables", path: "/api/unidades", related: [{ label: "Por propiedad", path: "/propiedad/" }] },
        { key: "disponibilidades", label: "Disponibilidades", path: "/api/disponibilidades", related: [{ label: "Por unidad", path: "/unidad/" }] },
        { key: "imagenes", label: "Imágenes de propiedades", path: "/api/propiedad-imagenes", related: [{ label: "Por propiedad", path: "/propiedad/" }] },
        { key: "resenas", label: "Reseñas", path: "/api/resenas", related: [{ label: "Por reserva", path: "/reserva/" }] },
        { key: "notificaciones", label: "Notificaciones", path: "/api/notificaciones", related: [{ label: "Por destinatario", path: "/destinatario/" }] }
    ];
    const actions = [
        { key: "list", label: "Listar todos", method: "GET" },
        { key: "get", label: "Consultar por ID", method: "GET", needsId: true, suffix: (id) => `/${id}` },
        { key: "create", label: "Crear", method: "POST", body: true },
        { key: "update", label: "Actualizar por ID", method: "PUT", needsId: true, body: true, suffix: (id) => `/${id}` },
        { key: "delete", label: "Eliminar por ID", method: "DELETE", needsId: true, suffix: (id) => `/${id}` }
    ];

    const resourceSelect = document.querySelector("#api-resource");
    const actionSelect = document.querySelector("#api-action");
    const idGroup = document.querySelector("#api-id-group");
    const idInput = document.querySelector("#api-id");
    const idLabel = document.querySelector("#api-id-label");
    const payloadGroup = document.querySelector("#api-payload-group");
    const payloadInput = document.querySelector("#api-payload");
    const routeOutput = document.querySelector("#api-route");
    const output = document.querySelector("#api-output");
    const responseTitle = document.querySelector("#api-response-title");
    const statusOutput = document.querySelector("#api-status");
    const submit = document.querySelector("#api-submit");

    resources.forEach((resource) => resourceSelect.add(new Option(resource.label, resource.key)));

    function currentResource() {
        return resources.find((resource) => resource.key === resourceSelect.value);
    }

    function availableActions(resource) {
        const options = [...actions];
        resource.related?.forEach((related, index) => options.push({ key: `related-${index}`, label: related.label, method: "GET", needsId: true, suffix: (id) => `${related.path}${id}`, idLabel: "ID relacionado" }));
        resource.extra?.forEach((extra) => options.push({ ...extra, needsId: true, suffix: (id) => `/${id}${extra.suffix}` }));
        return options;
    }

    function selectedAction() {
        return availableActions(currentResource()).find((action) => action.key === actionSelect.value);
    }

    function populateActions() {
        const options = availableActions(currentResource());
        actionSelect.replaceChildren(...options.map((action) => new Option(action.label, action.key)));
        actionSelect.value = "list";
    }

    function updateForm() {
        const resource = currentResource();
        const action = selectedAction();
        idGroup.classList.toggle("d-none", !action.needsId);
        payloadGroup.classList.toggle("d-none", !action.body);
        idLabel.textContent = action.idLabel || "Identificador";
        if (action.body && !payloadInput.value.trim()) payloadInput.value = JSON.stringify(examples[resource.key], null, 2);
        const suffix = action.suffix ? action.suffix(idInput.value || ":id") : "";
        routeOutput.textContent = `${action.method} ${resource.path}${suffix}`;
    }

    async function execute() {
        const resource = currentResource();
        const action = selectedAction();
        if (action.needsId && !idInput.value.trim()) {
            output.textContent = "Ingresa un identificador para esta operación.";
            responseTitle.textContent = "Falta un dato";
            statusOutput.textContent = "Revisa el formulario";
            statusOutput.className = "api-status is-error";
            idInput.focus();
            return;
        }

        let body;
        if (action.body) {
            try {
                body = JSON.parse(payloadInput.value);
            } catch {
                output.textContent = "El cuerpo no contiene JSON válido.";
                responseTitle.textContent = "JSON inválido";
                statusOutput.textContent = "Revisa el cuerpo";
                statusOutput.className = "api-status is-error";
                payloadInput.focus();
                return;
            }
        }

        const url = `${resource.path}${action.suffix ? action.suffix(idInput.value) : ""}`;
        routeOutput.textContent = `${action.method} ${url}`;
        submit.disabled = true;
        submit.textContent = "Enviando...";
        responseTitle.textContent = "Solicitud en curso";
        statusOutput.textContent = "Conectando";
        statusOutput.className = "api-status";
        try {
            const response = await fetch(url, {
                method: action.method,
                headers: body === undefined ? {} : { "Content-Type": "application/json" },
                body: body === undefined ? undefined : JSON.stringify(body)
            });
            const text = await response.text();
            let result = text;
            try { result = text ? JSON.parse(text) : "Sin contenido"; } catch { /* Respuesta de texto plano */ }
            output.textContent = typeof result === "string" ? result : JSON.stringify(result, null, 2);
            responseTitle.textContent = response.ok ? "Operación completada" : "La API devolvió un error";
            statusOutput.textContent = `${response.status} ${response.statusText}`;
            statusOutput.className = `api-status ${response.ok ? "is-success" : "is-error"}`;
            if (response.ok && action.key === "get" && result && typeof result === "object") payloadInput.value = JSON.stringify(result, null, 2);
        } catch (error) {
            output.textContent = error.message || "No fue posible conectar con la API.";
            responseTitle.textContent = "Error de conexión";
            statusOutput.textContent = "Sin respuesta";
            statusOutput.className = "api-status is-error";
        } finally {
            submit.disabled = false;
            submit.textContent = "Ejecutar";
        }
    }

    resourceSelect.addEventListener("change", () => { payloadInput.value = ""; populateActions(); updateForm(); });
    actionSelect.addEventListener("change", updateForm);
    idInput.addEventListener("input", updateForm);
    submit.addEventListener("click", execute);
    populateActions();
    updateForm();
})();