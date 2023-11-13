import Accordion from 'react-bootstrap/Accordion';
import "./style.css"; 
import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { CriarEntrevista } from "../entrevista/modalCriarentrevista";
import Alert from '../../components/alerts/alerts.js'
import { useHistory } from "react-router-dom";
import * as Icon from 'react-bootstrap-icons';

function Candidatura() {
  const { ncand } = useParams();
  const [candidatura, setCandidatura] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [cv, setcv] = useState(null);
  const [entrevista, setEntrevista] = useState([]);
  const [reunioes, setReunioes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  const [atualizarLista, setAtualizarLista] = useState(1);

  const handleCloseModal = () => {
    setShowModal(false);
    setAtualizarLista(atualizarLista + 1)
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    async function fetchData() {
  
        await api.get(`/api/candidaturas/${ncand}`)
        .then(response =>{
          setCandidatura(response.data.message);
          api.get(`/api/usuarios/${response.data.message.NUsuario}`)
          .then(response =>{
            
            setUsuario(response.data.message);
            setcv(response.data.message.CV);
          })
          .catch(err => {
          console.log(err);
         })

        })
        .catch(err => {
          console.log(err);
         })

    }
    fetchData();
    
  }, [ncand]); 

const PDFButton = () => {
  const handleButtonClick = () => {
    window.open(cv, '_blank');
  };

  return (
    <button className="btn btn-primary ms-3" onClick={handleButtonClick}>
      Ver CV do candidato
    </button>
  );
};



function RemoverCandidatura () {

  api.put(`/api/candidaturas/${ncand}`, {  
     Estado:0,
     Estagio:"Rejeitada"
    })
    .then(() => {
        history.push("/dashboard");
    })
    .catch((err) => {
      console.log(err);
    });
};
    

useEffect(() => {
  async function fetchEntrevistas() {
    const response = await api.get(`api/entrevistas?ncandidatura=${ncand}`);
      setEntrevista(response.data.message);
      }
      fetchEntrevistas();
    }, [ncand,atualizarLista]);


    useEffect(() => {
      async function fetchReunioes() {
        const response = await api.get("api/reunioes");
          setReunioes(response.data.message);
          }
          fetchReunioes();
        }, [ncand]);
        
        const getDataHoraReuniao = (nentre) => {
          const Reuniao = reunioes.find(reuniao => reuniao.NEntrevista === nentre);
          if (Reuniao) {
            const dataHoraInicio = new Date(Reuniao.DataHoraInicio);
            const dia = dataHoraInicio.getDate().toString().padStart(2, '0');
            const mes = (dataHoraInicio.getMonth() + 1).toString().padStart(2, '0');
            const ano = dataHoraInicio.getFullYear();
            const horas = dataHoraInicio.getHours().toString().padStart(2, '0');
            const minutos = dataHoraInicio.getMinutes().toString().padStart(2, '0');
            return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
          }
          return '';
        }
        const getTituloReuniao = (nentre) => {
          const Reuniao = reunioes.find(reuniao => reuniao.NEntrevista === nentre);
          return Reuniao ? Reuniao.Titulo : '';
        }
        
  return (
  <>
    {!usuario.Nome ? (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
      </div>
    ) :(
    <div className="container mt-6">
      <div className="row">
      <div className="col-md-4 mt-5 text-start">
        <div className="card">
          <h3 className="card-header">{candidatura.NomeVaga}</h3>
          <div className="card-body">
            <h5 className="card-title">{usuario.Nome}</h5>
            <p className="card-text">{new Date(candidatura.DataCandidatura).toLocaleDateString()}</p>
            <div className="d-flex justify-content-start">
            {candidatura.Estagio === "Análise" || candidatura.Estagio === "Entrevista" ? (
              <>
                <div className="" role="group" aria-label="Exemplo de grupo de botões">
                  <button
                    type="button"
                    className="btn btn-secondary" onClick={() => setShowModal(true)}>
                    <span className="d-flex align-items-center"><span  className="mr-2">Criar Entrevista&nbsp;<Icon.CalendarPlus/></span></span>
                  </button>
                  <CriarEntrevista
                    show={showModal}
                    onHide={handleCloseModal}
                    candidatura={candidatura}
                  />  
                  <button type="button" className="btn btn-primary mx-2" onClick={() => setShowAlert(true)}>
                  <span className="d-flex align-items-center"><span  className="mr-2">Rejeitar Candidatura&nbsp;<Icon.XLg /></span></span>
                  </button>
                  <Alert
                  show={showAlert}
                  onHide={handleCloseAlert}
                  nome = {'Prentende rejeitar a candidatura?'} 
                  click = {RemoverCandidatura} 
                  mensagem = {'Removida com sucesso'}
                  enviadoComSucesso = {false}
                  />
                </div>
              </>
              ) : (
                <strong>Candidatura {candidatura.Estagio}</strong>
              )}
            </div>
          </div>
        </div>
        <div className="simple1">
        {entrevista.length > 0 && (
        <div className="accordion mt-3 " id="accordionExample" >
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
              <h5>Entrevistas associadas à candidatura</h5>
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div className="accordion-body" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              <Accordion>
                {entrevista.map((entrevista, index) => {
                  return (
                    <div className="row mb-2" key={index}>
                      <div className="col-8">
                        <strong>{getTituloReuniao(entrevista.NEntrevista)}</strong>
                        <br />
                        {getDataHoraReuniao(entrevista.NEntrevista)}
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm mb-2 col-4"
                        onClick={() => history.push(`/entrevistas/${entrevista.NEntrevista}`)}
                      >
                        Mostrar mais
                      </button>
                      <hr />
                    </div>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
          )}
          </div>
          <div className="col-8">
            <div className="btn-group d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-info"
                style={{ marginTop: '50%' }}
                onClick={() => history.push('/dashboard')}
              >
                <Icon.ChevronLeft/>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '50%' }}
                onClick={() => history.push('/dashboard')}
              >
                Voltar para o dashboard
              </button>
            </div> 
          </div>


        </div>
        <div className="col-md-7 mt-5 text-start">
  <h4>Informações do candidato:</h4>
      <label htmlFor="nome">Nome:</label>
      <input type="text" className="form-control" value={usuario.Nome} id="nome" readOnly/>

      <label htmlFor="linkedin">Linkedin:</label>
      <input type="text" className="form-control" value={usuario.Linkedin} id="linkedin" readOnly/>

      <label htmlFor="Email">Email:</label>
      <input type="text" className="form-control" value={usuario.Email} id="email" readOnly/>
  <div className="row">
    <div className="col">
      <label htmlFor="telefone">Telefone:</label>
      <input type="text" className="form-control" value={usuario.Telefone} id="telefone" readOnly/>
    </div>
    <div className="col">
      <label htmlFor="pret">Pretenção Salarial:</label>
      <input type="text" className="form-control" value={candidatura.PretencaoSalarial + " €"} id="pretencao" readOnly/>
    </div>
  </div>
  <div className="my-2">
    <label htmlFor="pret mr-2">CV:</label>
  <PDFButton/>
  </div>
  
  <h4 className="card-title mb-1">Mensagem:</h4>
  <div className="card">
    <textarea type="text" className='form-control' value={candidatura.Mensagem} style={{ height: '140px', width: "100%" }} readOnly />
  </div>
</div>
</div>
    </div>
    )}
  </>
  );
}

export { Candidatura };
