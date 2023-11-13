import api from '../../services/api';
import './style.css'
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import * as Icon from 'react-bootstrap-icons';

function Entrevistas( {cargo} ) {
  const [entrevistas, setEntrevista] = useState([]);
  const [candidatura, setCandidatura] = useState([]);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEntrevistas() {
      const response = await api.get('api/entrevistas',{
        params: {
          estado: 1
        }
      });

      setEntrevista(response.data.message);
      setIsLoading(false);
    }

    fetchEntrevistas();
  }, []);
  useEffect(() => {
    async function fetchCandidaturas(ncand) {
      const response = await api.get(`api/candidaturas`);
      setCandidatura(response.data.message);
      setIsLoading(false);
    }

    fetchCandidaturas();
  }, []);

  const getNomeCandidato = (ncand) => {
    const Candidatura = candidatura.find(candidatura => candidatura.NCandidatura === ncand);
    return Candidatura ? Candidatura.NomeUsuario : '';
  }
  const getNomeVaga = (ncand) => {
    const Candidatura = candidatura.find(candidatura => candidatura.NCandidatura === ncand);
    return Candidatura ? Candidatura.NomeVaga : '';
  }

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
        </div>
      ) :(
      <div className="container mt-6">
        <div className="row-md-12 row p-3">
          <h1 className="col-md-2 ">Entrevistas </h1>
          <div className="col-md-7 "></div>
          {cargo === 0 || cargo === 3 ? (
              <button type="button" className="btn btn-primary btn-lg col-md-2" onClick={() => history.push('/criarEntrevista')} >Criar Entrevista&nbsp;<Icon.PlusCircle/></button>
            ) : null}
        </div>
        <div className="d-flex justify-content-center">
        <table className="table table-striped w-75  table-bordered">
          <thead>
            <tr>
              <th scope="col">Estado</th>
              <th scope="col">Nome da vaga</th>
              <th scope="col">Nome do Candidato</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {entrevistas.map((entrevista) => (
              <tr key={entrevista.NEntrevista}>
                <td>{entrevista.Estado}</td>
                <td>{getNomeVaga(entrevista.NCandidatura)}</td>
                <td>{getNomeCandidato(entrevista.NCandidatura)}</td>
                <td><button
                    type="button"
                    className="btn btn-outline-primary transparent-btn mx-2"
                    onClick={() => history.push(`/entrevistas/${entrevista.NEntrevista}`)}
                    >
                    Mostrar mais
                    </button>
              </td>
              </tr> 
            ))}
          </tbody>
        </table>
        </div>
    </div>)}
  </>
    
    
  );
}

export { Entrevistas };