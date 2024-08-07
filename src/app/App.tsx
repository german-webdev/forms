import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PersonalDataForm from '../components/PersonalDataForm';
import AddressWorkForm from '../components/AddressWorkForm';
import LoanParametersForm from '../components/LoanParametersForm';

const App: React.FC = () => {
  return (
    <main className='app'>
      <Router>
        <Container>
          <Routes>
            <Route path="/" element={<PersonalDataForm />} />
            <Route path="/address-work" element={<AddressWorkForm />} />
            <Route path="/loan-parameters" element={<LoanParametersForm />} />
          </Routes>
        </Container>
      </Router>
    </main>

  );
};

export default App;
