import { BrowserRouter } from 'react-router-dom'

import Header from './components/Header'
import HomePage from './pages/HomePage'
import Footer from './components/Footer'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <HomePage />
      <Footer />
    </BrowserRouter>
  )
}

export default App
