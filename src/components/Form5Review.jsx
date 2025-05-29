import { useNavigate } from 'react-router-dom';
import '../styles/Forms.css';

export default function Form5Review({ data }) {
    const navigate = useNavigate();
    const { personal, income, obligations, request } = data;

    const handleConfirm = () => {
        console.log('Full form data: ', data);
        navigate('/resultat');
    };

    return (
        <div className="form-container">
            <div className="summary">
                <h2>Översikt av ansökan</h2>

                <h3>Personuppgifter</h3>
                <p><strong>Namn:</strong> {personal.name}</p>
                <p><strong>Personnummer:</strong> {personal.personalNumber}</p>
                <p><strong>Telefon:</strong> {personal.phone}</p>
                <p><strong>E-post:</strong> {personal.email}</p>
                <p><strong>Adress:</strong> {personal.address}</p>

                <h3>Inkomst</h3>
                <p><strong>Sysselsättning:</strong> {income.workStatus}</p>
                <p><strong>Anställd:</strong> {income.employed ? 'Ja' : 'Nej'}</p>
                {income.employed && (
                    <>
                    <p><strong>Arbetsgivare:</strong> {income.employerName}</p>
                    <p><strong>Befattning:</strong> {income.jobTitle}</p>
                    </>
                )}
                <p><strong>Månadslön:</strong> {income.salary} kr</p>
                {income.message && <p><strong>Meddelande:</strong> {income.message}</p>}

                <h3>Åtaganden</h3>
                {obligations.otherLoans.length > 0 ? (
                    <div>
                    <p><strong>Andra lån:</strong></p>
                    <ul>
                        {obligations.otherLoans.map((loan, idx) => (
                        <li key={idx}>{loan.type} – {loan.amount} kr</li>
                        ))}
                    </ul>
                    </div>
                ) : (
                    <p><strong>Andra lån:</strong> Inga</p>
                )}
                <p><strong>Månadsutgifter:</strong> {obligations.monthlyExpenses} kr</p>

                <h3>Önskat lån</h3>
                <p><strong>Belopp:</strong> {request.amount} kr</p>
                <p><strong>Syfte:</strong> {request.purpose}</p>
                <p className='margin'><strong>Återbetalningstid:</strong> {request.termYears} år</p>

                <div className="form-navigation">
                    <button type="button" onClick={() => navigate('/lan')}>Tillbaka</button>
                    <button type="button" onClick={handleConfirm}>Skicka</button>
                </div>
            </div>
        </div>
    );
}