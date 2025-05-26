import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import StartForm from '../components/StartForm'
import Form1Personal from '../components/Form1Personal'
import Form2Income from '../components/Form2Income'
import Form3Debt from '../components/Form3Debt'
import Form4Loan from '../components/Form4Loan'
import Form5Review from '../components/Form5Review'
import Form6Result from '../components/Form6Result'


export default function HomePage() {
    
    // Lyfter state för samtliga inputs till HomePage.jsx för att
    // smidigt kunna komma åt dem mellan komponenter.
    const [formData, setFormData] = useState({
        personal: {
        name:       '',
        persNumber: '',
        phone:      '',
        email:      '',
        address:    '',
        },
        income: {
        employed:    false,
        workStatus:     '',
        employerName:   '',
        jobTitle:       '',
        salary:          0,
        message:        '',
        },
        obligations: {
        otherLoans:       [],
        loanAmount:        0,
        monthlyExpenses:  '',
        },
        request: {
        amount:           '',
        purpose:          '',
        termYears:        '',
        collateral:    false,
        collateralDetail: '',
        },
    })

    return (
        <main>
            <Routes>
                <Route index element={<StartForm />} />
                <Route path='personligt' element={<Form1Personal />} />
                <Route path='inkomst' element={<Form2Income />} />
                <Route path='skulder' element={<Form3Debt />} />
                <Route path='lan' element={<Form4Loan />} />
                <Route path='bekrafta' element={<Form5Review />} />
                <Route path='resultat' element={<Form6Result />} />
            </Routes>
        </main>
    )
}