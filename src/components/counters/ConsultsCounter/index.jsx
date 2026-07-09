import { useState, useEffect } from 'react'
import { FaCalendarCheck } from 'react-icons/fa'
import { fetchConsultations } from '../../../services/clinicApi'

const ConsultsCounter = () => {
    const [consultCounter, setConsultCounter] = useState(0)

    useEffect(() => {
        const fetchConsults = async () => {
            try {
                const consults = await fetchConsultations()
                setConsultCounter(Array.isArray(consults) ? consults.length : 0)
            } catch (error) {
                console.error("Erro ao obter dados do pacientes", error)
                setConsultCounter(0)
            }
        }
        fetchConsults()
    }, [])

    return (
        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
                <FaCalendarCheck className='text-blue-600' />{consultCounter}
            </h2>
            <p className='text-gray-600 mt-2'>Consultas</p>
        </div>
    )
}

export default ConsultsCounter
