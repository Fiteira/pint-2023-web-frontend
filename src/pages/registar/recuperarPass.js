import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './style.css'
import api from '../../services/api';
import { useHistory } from "react-router-dom";
import { useToast } from '../../components/toasts/toast';
 


function RecuperarPass() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const {showMessageToast } = useToast();
  const handleSubmit = (event) => {
    event.preventDefault();
    api.post(`/api/requestresetpassword`, {Email: email})
    showMessageToast("Se o email for valido, vai receber um email na sua caixa")
    history.push('/')
  };

  return (
    <div className='container mt-6'>
<div className="registar-container">
  <div className="row justify-content-center m-auto">
    <div className="offset- col-lg-5 col-md-7">
      <div className="panel border bg-white">
        <div className="panel-heading">
          <h3 className="pt-3 font-weight-bold">Recuperar palavra-passe</h3>
        </div>
        <div className="panel-body p-3">
          <form onSubmit={handleSubmit}>
            <div className="form-group py-2">
            <label htmlFor='email'>Seu Email *</label>
              <input type='email' className='form-control'  placeholder='Seu email' value={email} onChange={(event) => setEmail(event.target.value)} required/>
            </div>
            <button type='submit' className='btn btn-primary btn-block mt-3 w-100'>
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}

export{RecuperarPass};