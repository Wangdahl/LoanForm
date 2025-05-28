
export default function Form6Result( {data} ) {
    const { income, obligations, request } = data;

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
    return (
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
        </div>
    )
}