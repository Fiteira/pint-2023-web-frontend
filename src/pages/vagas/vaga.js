import "./style.css"; 
import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import ModalRecomendar from './modalRecomendar';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import ModalCandidatar from "./modalCandidatar";

import * as Icon from 'react-bootstrap-icons';

function Vaga() {
  const { nvaga } = useParams();
  const IDUtilizador = localStorage.getItem('IDUtilizador');
  const cargo = localStorage.getItem('Cargo');
  const [vaga, setVaga] = useState(null);

  const [showModalRecomendar, setshowModalRecomendar] = useState(false);
  const [showModalCandidatar, setshowModalCandidatar] = useState(false);

  const [validacao, setValidacao] = useState(false);
  const history = useHistory();

  const [candidatado, setCandidatado] = useState(false);

  const handleCloseModalRecomendar = () => {
    setshowModalRecomendar(false);
  };

  const handleCloseModalCandidatar = () => {
    setshowModalCandidatar(false);
    
  };

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      if (!token) {
        setValidacao(true);
      }

        try {
          const response = await api.get('/api/checktoken', { 
            headers: {
              Authorization: `${token}`,
            },
          });
  
          const validacao = response.data.success;
  
          if(validacao === false)
          {
            console.log("validacao false");
            setValidacao(true);
          }
        } catch (error) {
          console.log(error);
          setValidacao(true);
        }
    }
    fetchData();
  }, []);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/api/vagas/${nvaga}`);
        if (response.data.message === false) {
          setVaga(null);
        } else {
          setVaga(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [nvaga]);

  


  useEffect(() => {
    async function fetchData() {

        const response = await api.get(`/api/candidaturas?nusuario=${IDUtilizador}&nvaga=${nvaga}`);
        
        if(response.data.message.length === 0)
        {
          setCandidatado(false)
        }else
        {
          setCandidatado(true)
        }

    }
    fetchData();
  }, [IDUtilizador, nvaga]);

  const [indicacoes, setIndicacoes] = useState(null);

  useEffect(() => {
    async function fetchData() {

      const response = await api.get(`/api/indicacoes?nvaga=${nvaga}`);
      
      setIndicacoes(response.data.message)
        
    }
    fetchData();
  }, [nvaga]);


  return (
    <>
    { !vaga ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
        </div>
      ) :(
    <div className="container mt-6">
      <div className="row">
        <div className="col-md-4 mt-5">
            <div className="card text-start">
              <h3 className="card-header">{vaga.NomeVaga}</h3>
              <div className="card-body">
                <h5 className="card-title">{vaga.Localidade}</h5>
                <p className="card-text">{vaga.Subtitulo}</p>
                <div className="d-flex justify-content-end">
                  <div className="" role="group" aria-label="Exemplo de grupo de botões">
                  {candidatado ? (

                      <button type="button" className="btn btn-secondary mx-2" disabled={true}>
                        Já Candidatado 
                      </button>
                      ):
                      (
                      <button type="button" className="btn btn-secondary mx-2"
                      onClick={() => validacao ? history.push('/login') : setshowModalCandidatar(true)}
                      >
                        Candidatar-se <Icon.PersonVcard/>
                      </button>
                      )}
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => validacao ? history.push('/login') : setshowModalRecomendar(true)}
                    >
                      Recomendar <Icon.PersonHeart/>
                    </button>

                    
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-7">
              <div className="btn-group d-flex justify-content-start">
                <button type="button" className="btn btn-info"
                  style={{ marginTop: '350px' }}
                          onClick={() => history.push('/vagas')}
                          >
                            <Icon.ChevronLeft/>
                  </button>
                <button type="button" className="btn btn-primary"
                style={{ marginTop: '350px' }}
                        onClick={() => history.push('/vagas')}
                        >
                          Voltar para vagas
                </button>
              </div> 
            </div>
            
            
          </div>
        <div className="col-md-8 text-start mt-5">
          <h4 id="">Descrição do Perfil:</h4>
          <div style={{ maxHeight: cargo === 0 || cargo === 5 ? '250px' : '450px', overflowY: 'auto', whiteSpace: 'pre-wrap'  }}> {vaga.Descricao} </div>
          {cargo === "0" || cargo === "5" ? (
          <div className="col-md-12">
            <strong><h4 className="mt-4">Recomendações da vaga:</h4></strong>
          <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
              <table className="table table-striped table-bordered ">
                    <thead>
                      <tr>
                        <th className="col-1">Recomendador</th>
                        <th className="col-1">Recomendado</th>
                        <th className="col-1">Email</th>
                        <th className="col-1">Telefone</th>
                        <th className="col-1">Linkedin</th>
                        <th className="col-1">CV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indicacoes && indicacoes.length > 0 ? (
                        indicacoes.map((indicacao) => (
                          <tr key={indicacao.NIndicacao}>
                            <td>{indicacao.NomeUsuario}</td>
                            <td>{indicacao.NomeCand}</td>
                            <td>{indicacao.EmailCand}</td>
                            <td>{indicacao.TelefoneCand ? indicacao.TelefoneCand : <span>N/A</span>}</td>
                            <td>{indicacao.LINKEDIN ? indicacao.LINKEDIN : <span>N/A</span>}</td>
                            <td>
                              {indicacao.CV ? (
                                <button
                                  type="button"
                                  className="sm-btn btn-outline-primary transparent-btn"
                                  onClick={() => indicacao.CV && window.open(indicacao.CV, '_blank')}
                                >
                                  Ver CV
                                </button>
                              ) : (
                                <span>Não anexado</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : 
                        <tr>
                          <td colSpan="6">Não existem recomendações associadas a esta vaga</td>
                        </tr>
                      }
                    </tbody>
                  </table>
              </div>
          </div>
          ) : null}

        </div>
      </div>
     
        <ModalRecomendar
          show={showModalRecomendar}
          onHide={handleCloseModalRecomendar}
          IdVaga={nvaga}
          IdUtilizador={IDUtilizador}
        />

        <ModalCandidatar
          show={showModalCandidatar}
          onHide={handleCloseModalCandidatar}
          IdVaga={nvaga}
          IdUtilizador={IDUtilizador}
          NomeVaga={vaga.NomeVaga}
        />
    </div>
    )}
  </>
  );
}

export { Vaga };