import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './style.css'
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { useToast } from '../../components/toasts/toast';
function ValidarEmail() {
  const queryParams = new URLSearchParams(window.location.search)
  const code = queryParams.get("code");
  const history = useHistory();
  const { showSuccessToast, showErrorToast } = useToast();
  useEffect(() => {

    if (!code) {
      alert('Falta o código')
      return
    }

   async function sendCode() {
        const response = await api.get(`/api/validaremail?code=${code}`).then(() => {
            showSuccessToast("Validação feita com sucesso!")
            history.push("/login");
          }).catch(err => {      
            showErrorToast(err.response.data.message)
          })
          console.log(response);
    } 
    sendCode();

  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className='container mt-6'>
    </div>
  );
}

export { ValidarEmail };
