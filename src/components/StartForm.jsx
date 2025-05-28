import { useNavigate } from "react-router-dom"

export default function StartForm() {
    const navigate = useNavigate();

    const startApp = (e) => {
        e.preventDefault()
        navigate('/personligt') //Går till steg 2 (startar ansökan)
    }
    return (
        <div>
            <h2>Ansök om lån nu!</h2>
            <p>Vi erbjuder marknadens bästa räntor.</p>
            <form onSubmit={startApp}>
                <button type="submit">Starta ansökan</button>
            </form>
        </div>
    )
}