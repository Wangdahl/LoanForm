import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import StartForm from '../components/StartForm'
import Form1Personal from '../components/Form1Personal'
import Form2Income from '../components/Form2Income'
import Form3Debt from '../components/Form3Debt'
import Form4Loan from '../components/Form4Loan'
import Form5Review from '../components/Form5Review'
import Form6Result from '../components/Form6Result'
import coinsImg from '../assets/coins.jpg';

import '../styles/HomePage.css'


export default function HomePage( ) {
    
    // Lyfter state för samtliga inputs till HomePage.jsx för att
    // smidigt kunna komma åt dem mellan komponenter.
    const initialFormData = {
        personal: {
            name:       '',
            personalNumber: '',
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
            monthlyExpenses:  '',
        },
        request: {
            amount:           '',
            purpose:          '',
            termYears:        '',
        },
    }
    const [formData, setFormData] = useState(initialFormData)
    const [hydrated, setHydrated] = useState(false);

    //Funktion för att uppdatera en  sektion av formuläret
    function updateSection(sectionKey, newSectionData) {
        setFormData(prevData => ({
            ...prevData,
            [sectionKey]: newSectionData
        }))
    } 
    //Spara och hämta data i local storage
    useEffect(() => {
        // Vid första laddning, hämta ev. sparad ansökan
        const saved = localStorage.getItem('loanFormData')
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch (err) {
                console.error('Kunde inte läsa sparad data:', err);
            }
        }
        setHydrated(true);
    }, [])

    useEffect(() => {
        //Spara alla förändringar i localstorage
        if (!hydrated) return;
        try {
            localStorage.setItem('loanFormData', JSON.stringify(formData));
        } catch (err) {
            console.error('Kunde inte spara data:', err);
        }
    }, [formData, hydrated])

    //Funktion för att reseta formuläret efter skickad ansökan
    const resetForm = () => {
        setFormData(initialFormData)
        localStorage.removeItem('loanFormData')
    }
    return (
        <main>
            <div className='bg-img-container'>
                <img src={coinsImg} alt="stacks of coins" className='bg-img'/>
            </div>
            <Routes>
                {/* Steg 1: Start */}
                <Route index element={<StartForm />} />
                {/* Steg 2: Personuppgifter */}
                <Route path='personligt' element={
                    <Form1Personal 
                        data={formData.personal}
                        updateSection={updateSection}
                    />} 
                />
                {/* Steg 3: Inkomst */}
                <Route path='inkomst' element={
                    <Form2Income 
                        data={formData.income}
                        updateSection={updateSection}
                    />}
                />
                {/* Steg 4: Skulder */}
                <Route path='skulder' element={
                    <Form3Debt 
                        data={formData.obligations}
                        updateSection={updateSection}
                        hydrated={hydrated}
                    />} 
                />
                {/* Steg 5: Låneönskemål */}
                <Route path='lan' element={
                    <Form4Loan
                        data={formData.request}
                        updateSection={updateSection}
                    />} 
                />
                {/* Steg 6: Granskning */}
                <Route path='granska' element={
                    <Form5Review 
                        data={formData}
                    />} 
                />
                {/* Steg 7: Resultat */}
                <Route path='resultat' element={
                    <Form6Result 
                        data={formData}
                        resetForm={resetForm}
                    />
                } />
            </Routes>
        </main>
    )
}