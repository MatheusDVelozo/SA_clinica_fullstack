import { useState, useEffect } from 'react'

import { useParams } from 'react-router'
import apiClient from '../../api/api'


const ExamsList = () => {
    const [page, setPage] = useState(1)
    const [exams, setExams] = useState()
    const [total, setTotal] = useState()
    const [totalPagina, setTotalPagina] = useState()
    const limite = 10
    useEffect(() => {
        const fethExames = async () => {
            try {
                const response = await apiClient.get(`/exames?pagina=${page}&limite=${limite}`)
                if (response.data) {
                    setExams(response.data.exames)
                    setTotal(response.data.total)
                    setTotalPagina(response.data.totalPaginas)
                }
            } catch (error) {
                console.error("Erro ao listar exames", error)
            }
        }
        fethExames()
    }, [page])

    return (
        <>

        <div className="bg-white shadow rounded-2xl p-6 mt-8">
            <h2 className="text-xl font-semibold text-cyan-800 mb-4">
                Informações Rápidas de Pacientes
            </h2>

            {/* Campo de busca */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <label htmlFor="search" className="text-gray-700 font-medium">
                    Buscar Paciente:
                </label>
                <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Digite o nome, email ou telefone"
                    className="border rounded-lg px-3 py-2 w-full sm:w-80 focus:ring-2 focus:ring-cyan-600 outline-none"

                />
            </div>

            {/* Lista de pacientes */}

            {
                filteredPatients.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {
                            filteredPatients.map((patient) => (
                                <li
                                    key={patient.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-cyan-100 text-cyan-700 p-3 rounded-full">
                                            <FaUserAlt size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{patient.fullName}</p>
                                            <p className="text-sm text-gray-600">{patient.email}</p>
                                            <p className="text-sm text-gray-600">{patient.phone}</p>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 mt-2 sm:mt-0 text-right">
                                        <p><strong>Idade:</strong>{ages[patient.id] || "-"} anos</p>
                                        <p><strong>Plano:</strong>{patient.healthInsurance || "-"}</p>
                                        <Link
                                            to={`/paciente/${patient.id}`}
                                            className="text-cyan-700 font-semibold hover:underline"
                                        >
                                            Ver detalhes
                                        </Link>
                                    </div>

                                </li>
                            ))

                        }
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-6">
                        Nenhum paciente encontrado
                    </p>
                )
            }

        </div>





        
            <div>Lista de exames</div>
            {
                exams?.length ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo de Exame</th>
                                    <th>Descrição</th>
                                    <th>Data do Exame</th>
                                    <th>Valor</th>
                                    <th>Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((exame) => (
                                    <tr>
                                        <td>{exame.id}</td>
                                        <td>{exame.tipo_exame}</td>
                                        <td>{exame.descricao}</td>
                                        <td>{exame.data_exame}</td>
                                        <td>{exame.valor}</td>
                                        <td><em>{exame.resultado}</em></td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        <div className='flex gap-5 items-center justify-center'>
                            <span>Resultado {limite * page} de {total}</span>
                            {Array.from(Array(totalPagina)).map((_, i) => (
                                <button 
                                    onClick={() => {
                                        setPage(i + 1)
                                    }}
                                    className={` px-2 py-1 ${i + 1 == page ? "bg-cyan-950" : "bg-cyan-600"}  cursor-pointer text-white rounded-lg`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <span>Sem dados!</span>
                )
            }
        </>
    )
}

export default ExamsList