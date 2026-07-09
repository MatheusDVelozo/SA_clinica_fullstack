import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchPatientDetails, formatDate } from "../../services/clinicApi";

const PatientDetails = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPatientDetails = async () => {
            try {
                const patientData = await fetchPatientDetails(id);
                setPatient(patientData);
            } catch (error) {
                console.error("Erro ao obter os detalhes do paciente", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPatientDetails();
    }, [id]);

    if (isLoading) {
        return <p className="text-gray-600">Carregando detalhes do paciente...</p>;
    }

    if (!patient) {
        return <p className="text-gray-600">Paciente não encontrado.</p>;
    }

    return (
        <section className="space-y-6">
            <Link to="/dashboard" className="text-cyan-700 font-semibold hover:underline">
                Voltar
            </Link>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-cyan-800 mb-4">{patient.fullName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                    <p><strong>Registro:</strong> {patient.id}</p>
                    <p><strong>CPF:</strong> {patient.cpf || "-"}</p>
                    <p><strong>Email:</strong> {patient.email || "-"}</p>
                    <p><strong>Telefone:</strong> {patient.phone || "-"}</p>
                    <p><strong>Sexo:</strong> {patient.gender || "-"}</p>
                    <p><strong>Nascimento:</strong> {formatDate(patient.birthdate)}</p>
                    <p><strong>Responsável:</strong> {patient.responsavel || "-"}</p>
                </div>
            </div>

            <DetailList
                title="Consultas"
                emptyText="Nenhuma consulta cadastrada."
                items={patient.Consulta || []}
                renderItem={(consultation) => (
                    <>
                        <p className="font-semibold text-gray-800">{consultation.motivo}</p>
                        <p className="text-sm text-gray-600">{formatDate(consultation.data_consulta)}</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{consultation.observacoes || "-"}</p>
                    </>
                )}
            />

            <DetailList
                title="Exames"
                emptyText="Nenhum exame cadastrado."
                items={patient.Exame || []}
                renderItem={(exam) => (
                    <>
                        <p className="font-semibold text-gray-800">{exam.tipo_exame}</p>
                        <p className="text-sm text-gray-600">{formatDate(exam.data_exame)}</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{exam.descricao || "-"}</p>
                        <p className="text-sm text-gray-700"><strong>Resultado:</strong> {exam.resultado || "-"}</p>
                    </>
                )}
            />

            <DetailList
                title="Prontuários"
                emptyText="Nenhum prontuário cadastrado."
                items={patient.Prontuario || []}
                renderItem={(record) => (
                    <>
                        <p className="font-semibold text-gray-800">{formatDate(record.data_prontuario)}</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{record.descricao || "-"}</p>
                        <p className="text-sm text-gray-600">
                            Médico: {record.usuario?.nome || record.usuario?.email || record.medico_responsavel_id}
                        </p>
                    </>
                )}
            />
        </section>
    );
};

const DetailList = ({ title, emptyText, items, renderItem }) => (
    <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-cyan-800 mb-4">{title}</h3>
        {items.length ? (
            <ul className="space-y-3">
                {items.map((item) => (
                    <li key={item.id} className="border rounded-lg p-4">
                        {renderItem(item)}
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500">{emptyText}</p>
        )}
    </div>
);

export default PatientDetails;
