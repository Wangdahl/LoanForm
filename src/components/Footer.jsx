import '../styles/Footer.css'

export default function Footer() {
    return (
        <footer>
            <div className="footer-content"> 
                    <div className='footer-container footer-container-1'>
                <p><strong>© 2025 Skuldsatt.se</strong></p>
                <p>För dig som vill fatta välgrundade beslut om lån.</p>
                    </div>
                <div className='footer-container footer-container-2'>
                    <p>Org.nr: 556789-1234</p> 
                    <p>Adress: Storgatan 12, 111 22 Stockholm</p>
                </div>
                <div className='footer-container footer-container-3'>
                    <p>Vid frågor, vänligen kontakta oss via e-post: <strong>kontakt@skuldsatt.se</strong></p>
                </div>
            </div>
        </footer>
    );
}
