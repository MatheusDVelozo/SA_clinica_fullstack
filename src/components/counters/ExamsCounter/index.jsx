import { useState, useEffect } from 'react'
import { FaCalendarPlus } from 'react-icons/fa'
import { fetchExams as getExams } from '../../../services/clinicApi'

const ExamsCounter = () => {
    const [examCounter, setExamCounter] = useState(0)

    useEffect(() => {
        const loadExams = async () => {
            try {
                const data = await getExams({ page: 1, limit: 10 })
                setExamCounter(data?.total || 0)
            } catch (error) {
                console.error("Erro ao obter dados do pacientes", error)
                setExamCounter(0)
            }
        }
        loadExams()
    }, [])

    return (
        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
                <FaCalendarPlus className='text-blue-600' />{examCounter}
            </h2>
            <p className='text-gray-600 mt-2'>Exames</p>
        </div>
    )
}

export default ExamsCounter
