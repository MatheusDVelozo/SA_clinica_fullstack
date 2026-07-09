import { useEffect, useState } from "react";
import { fetchExams, formatDate } from "../../services/clinicApi";

const ExamsList = () => {
    const [page, setPage] = useState(1);
    const [exams, setExams] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const limit = 10;

    useEffect(() => {
        const loadExams = async () => {
            try {
                const data = await fetchExams({ page, limit });
                setExams(Array.isArray(data.exames) ? data.exames : []);
                setTotal(data.total || 0);
                setTotalPages(data.totalPaginas || 1);
            } catch (error) {
                console.error("Erro ao listar exames", error);
            }
        };

        loadExams();
    }, [page]);

    const filteredExams = (exams || []).filter((exam) =>
        [
            exam.tipo_exame,
            exam.descricao,
            exam.resultado,
            exam.paciente?.nome,
            exam.paciente?.email,
        ].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold text-cyan-800">Lista de exames</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar exame ou paciente"
                    className="border rounded-lg px-3 py-2 w-full sm:w-80 focus:ring-2 focus:ring-cyan-600 outline-none"
                />
            </div>

            {filteredExams.length ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b text-gray-600">
                                <tr>
                                    <th className="py-2 pr-3">ID</th>
                                    <th className="py-2 pr-3">Paciente</th>
                                    <th className="py-2 pr-3">Tipo</th>
                                    <th className="py-2 pr-3">Descrição</th>
                                    <th className="py-2 pr-3">Data</th>
                                    <th className="py-2 pr-3">Valor</th>
                                    <th className="py-2 pr-3">Resultado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredExams.map((exam) => (
                                    <tr key={exam.id}>
                                        <td className="py-3 pr-3">{exam.id}</td>
                                        <td className="py-3 pr-3">{exam.paciente?.nome || "-"}</td>
                                        <td className="py-3 pr-3">{exam.tipo_exame}</td>
                                        <td className="py-3 pr-3 whitespace-pre-line">{exam.descricao}</td>
                                        <td className="py-3 pr-3">{formatDate(exam.data_exame)}</td>
                                        <td className="py-3 pr-3">R$ {Number(exam.valor || 0).toFixed(2)}</td>
                                        <td className="py-3 pr-3">{exam.resultado || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mt-6">
                        <span className="text-sm text-gray-600">
                            Página {page} de {totalPages} - {total} exames
                        </span>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setPage(index + 1)}
                                    className={`px-3 py-1 rounded-lg text-white ${index + 1 === page ? "bg-cyan-950" : "bg-cyan-700 hover:bg-cyan-600"}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-gray-500 text-center py-6">Nenhum exame encontrado.</p>
            )}
        </section>
    );
};

export default ExamsList;
