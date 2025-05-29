import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Form6Result( {data, resetForm} ) {
    const { income, obligations, request } = data;
    const navigate = useNavigate();

    // State för loading-animation
    const [loading, setLoading] = useState(true);

    // Simulera API-anrop med setTimeout för loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // 2 sekunders simulering
        return () => clearTimeout(timer);
    }, []);

    //Räknar ut ett beslut baserat på input data
    let decision = 'REVIEW'
    const salary = Number(income.salary) || 0;
    const expenses = Number(obligations.monthlyExpenses) || 0;
    const totalOtherLoans = obligations.otherLoans.reduce((sum, loan) => sum + Number(loan.amount || 0), 0);
    const requestedAMount = Number(request.amount) || 0;
    
    const disposableIncome = salary - expenses;
    const totalDebtAfterLoan = totalOtherLoans + requestedAMount;

    if (salary < 15000 || disposableIncome < 0) {
        // Låg inkomst eller utgifter överstigande inkomst = avslag
        decision = 'DECLINE';
    } else if (disposableIncome > salary * 0.3 && totalDebtAfterLoan < 20 * salary) {
        // Hanterbar skuld och bra inkomst = godkänd
        decision = 'APPROVE';
    } else if (totalDebtAfterLoan > 50 * salary) {
        // Hög skuld i förhållande till inkomst = avslag
        decision = 'DECLINE';
    } else {
        // Annars manuell översyn
        decision = 'REVIEW';
    }

    // Endast rendera loading-komponent under simulering
    if (loading) {
        return (
        <div className="form-container">
            <div className="loading-container">
                <div className="spinner"></div>
                <h2>Laddar beslut...</h2>
            </div>
        </div>
        );
    }

    return (
        <div className="form-container">
            <div className="result">
                <h2>Beslut på ansökan</h2>
                {decision === 'APPROVE' && (
                    <p>Grattis! Din låneansökan är preliminärt <strong>godkänd</strong>. Vi kontaktar dig med vidare information.</p>
                )}
                {decision === 'DECLINE' && (
                    <p>Tyvärr, din låneansökan har <strong>avslagits</strong>.</p>
                )}
                {decision === 'REVIEW' && (
                    <p>Din ansökan behöver <strong>vidare granskning</strong>. Vi kommer att kontakta dig så fort som möjligt.</p>
                )}
                <div className='go-to-start-btn'>
                    <button onClick={() => { resetForm(); navigate('/'); }}>Gå till startsidan</button>
                </div>
            </div>
        </div>
    )
}