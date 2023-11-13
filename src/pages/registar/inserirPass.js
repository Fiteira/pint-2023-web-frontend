import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './style.css'
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { useToast } from '../../components/toasts/toast';
function InserirPass() {
  const { showSuccessToast, showErrorToast } = useToast();  
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const queryParams = new URLSearchParams(window.location.search)
  const code = queryParams.get("resetpassword");
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if(!code) {
      alert('Falta o código')
      return
    }
    if (errorMessage) {
      showErrorToast("A palavra-passe não cumpre as regras.") 
      return;
    }
    if (password === passwordConfirm) {

      api.post(`/api/resetpassword?code=${code}` , {Senha:password}).then(() => {
          showSuccessToast("Palavra-passe redefinida com sucesso!")
            history.push("/login");

      }).catch(err => {        
        showErrorToast(err.response.data.message);
      })
    } else {
      showErrorToast('As palavras-passes não são iguais, tente novamente.');
    }
   
  }
  const validatePassword = (value) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[^\s]{6,}$/;

    if (!value) {
      setErrorMessage("");
    } else if (!regex.test(value)) {
      setErrorMessage("A palavra-passe deve conter pelo menos uma letra maiúscula ou minúscula, um número e ter um comprimento mínimo de 6 caracteres, sem permitir espaços em branco.");
    } else {
      setErrorMessage("");
    }
  };
  const handleChangePassword = (event) => {
    const { value } = event.target;
    setPassword(value);
    validatePassword(value);
  };

  return (
    <div className='container mt-6'>
  <div className="registar-container">
  <div className="row justify-content-center m-auto">
    <div className="offset- col-lg-5 col-md-7">
      <div className="panel border bg-white">
        <div className="panel-heading">
          <h3 className="pt-3 font-weight-bold">Recuperar Palavra-Passe</h3>
        </div>
        <div className="panel-body p-3">
          <form onSubmit={handleSubmit}>
            <div className="form-group py-2">
              <label htmlFor='password'>Palavra-Passe *</label>
              <input type="password" className="form-control" id="password" placeholder="Palavra-Passe" value={password} onChange={handleChangePassword} required />
              {errorMessage && <div className="text-danger">{errorMessage}</div>}
            </div>
            <div className="form-group py-1 pb-2">
              <label htmlFor='password'>Confirmar palavra-passe *</label>
              <input type='password' className='form-control' id='passwordconfirm' placeholder='Confirmar palavra-passe' value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} required/>
            </div>
            <button type='submit' className='btn btn-primary btn-block mt-3 w-100'>
              Confirmar
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

export{InserirPass};