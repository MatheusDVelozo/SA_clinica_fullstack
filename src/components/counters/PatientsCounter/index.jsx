import { useState, useEffect } from 'react'
import { FaHospitalUser } from 'react-icons/fa'
import { fetchPatients as getPatients } from '../../../services/clinicApi'

const PatientsCounter = () => {
    const [patientCounter, setPatientCounter] = useState(0)

    useEffect(() => {
        const loadPatients = async () => {
            try {
                const patients = await getPatients()
                setPatientCounter(Array.isArray(patients) ? patients.length : 0)
            } catch (error) {
                console.error("Erro ao obter dados do pacientes", error)
                setPatientCounter(0)
            }
        }
        loadPatients()
    }, [])

    return (
        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
                <FaHospitalUser className='text-blue-600' />{patientCounter}
            </h2>
            <p className='text-gray-600 mt-2'>Pacientes</p>
        </div>
    )
}

export default PatientsCounter
