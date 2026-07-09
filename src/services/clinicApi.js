import apiClient from "../api/api";

export const toDateTime = (date, time = "00:00") => {
    if (!date) return "";
    return `${date}T${time || "00:00"}:00`;
};

export const formatDate = (date) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

export const mapPatient = (patient) => ({
    ...patient,
    fullName: patient.nome || "",
    gender: patient.sexo || "",
    birthdate: patient.data_nascimento || "",
    phone: patient.telefone || "",
    healthInsurance: patient.healthInsurance || "-",
});

export const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id ? Number(user.id) : null;
};

export const fetchPatients = async () => {
    const response = await apiClient.get("/paciente");
    return Array.isArray(response.data) ? response.data.map(mapPatient) : [];
};

export const fetchPatientDetails = async (id) => {
    const response = await apiClient.get(`/paciente/${id}`);
    return mapPatient(response.data);
};

export const createPatient = (formData) => apiClient.post("/paciente", {
    nome: formData.fullName,
    cpf: formData.cpf,
    telefone: formData.phone,
    email: formData.email,
    data_nascimento: formData.birthdate,
    sexo: formData.gender,
    responsavel: formData.emergencyContact,
});

export const fetchConsultations = async (patientId) => {
    const query = patientId ? `?paciente_id=${patientId}` : "";
    const response = await apiClient.get(`/consulta${query}`);
    return Array.isArray(response.data) ? response.data : [];
};

export const createConsultation = (formData, patientId) => apiClient.post("/consulta", {
    motivo: formData.reason,
    data_consulta: toDateTime(formData.date, formData.time),
    observacoes: [
        formData.description,
        formData.medication && `Medicação: ${formData.medication}`,
        formData.dosagePrecautions && `Dosagem e precauções: ${formData.dosagePrecautions}`,
    ].filter(Boolean).join("\n"),
    medico_responsavel_id: getCurrentUserId(),
    paciente_id: patientId,
});

export const fetchExams = async ({ page, limit, patientId } = {}) => {
    const params = new URLSearchParams();
    if (page) params.set("pagina", page);
    if (limit) params.set("limite", limit);
    if (patientId) params.set("paciente_id", patientId);

    const response = await apiClient.get(`/exames${params.toString() ? `?${params}` : ""}`);
    return response.data || {};
};

export const createExam = (examData, patientId) => apiClient.post("/exames", {
    tipo_exame: examData.type || examData.name,
    valor: examData.value || 0,
    descricao: [
        examData.name,
        examData.laboratory && `Laboratório: ${examData.laboratory}`,
        examData.documentUrl && `Documento: ${examData.documentUrl}`,
    ].filter(Boolean).join("\n"),
    resultado: examData.results,
    data_exame: toDateTime(examData.date, examData.time),
    paciente_id: patientId,
});

export const fetchMedicalRecords = async (patientId) => {
    const query = patientId ? `?paciente_id=${patientId}` : "";
    const response = await apiClient.get(`/prontuario${query}`);
    return Array.isArray(response.data) ? response.data : [];
};
