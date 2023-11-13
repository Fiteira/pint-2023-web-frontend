import "./style.css"; 
import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import ModalEditarOportunidade from "./modalEditarOportunidade";
import ModalContactos from "./modalContactos";
import api from '../../services/api';
import { CriarReuniaoOportunidade } from "../entrevista/modalCriarReuniao";
import * as Icon from 'react-bootstrap-icons';
import { useToast } from "../../components/toasts/toast";
function PageOportunidade() {
  const { nOportunidade } = useParams();
  const [showModalEditarOportunidade, setshowModalEditarOportunidade] = useState(false);
  const [showModalContactosOportunidade, setshowModalContactosOportunidade] = useState(false);
  const [oportunidade, setOportunidade] = useState([]);
  const [status, setStatus] = useState([]);
  const [atualizarStatus, setAtualizarStatus] = useState(0);
  const [atualizarOportunidade, setAtualizarOportunidade] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [optionsEmpresa, setOptionsEmpresa] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const {showErrorToast} = useToast();
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

  const handleCloseModalEditarOportunidade = () => {
    setshowModalEditarOportunidade(false);
    
  };

  const handleCloseModalContactosOportunidade = () => {
    setshowModalContactosOportunidade(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/api/oportunidades/${nOportunidade}`); 
        setOportunidade(response.data.message);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [nOportunidade,atualizarOportunidade]);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/api/status?noportunidade=${nOportunidade}`); 
        setStatus(response.data.message);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [nOportunidade,atualizarStatus]);

  const handleSelecionarArquivo = (event) => {
    const file = event.target.files[0];
    if (file === undefined) {

        setArquivoSelecionado("")
        return
    }
    if (file.size > 5000000) {
      showErrorToast("O arquivo deve ter menos de 5MB, escolha outro ficheiro!")
      event.target.value = "";
    }
    if (file.type === "application/pdf"  || (file && file.length > 0) ) {
      // O arquivo selecionado é um arquivo PDF
      setArquivoSelecionado(file);
    } else {
      // O arquivo selecionado não é um arquivo PDF, exibe um alerta
      showErrorToast("Utilize o formato de ficheiro correto!");
      event.target.value = "";
    }
  };

  const handleCancelarSelecaoArquivo = () => {
    setArquivoSelecionado(null);
    document.getElementById('comentario').disabled = false;
  };

  function formatDate(dateString) {
    if (!dateString) {
      return 'data não definida'; // Retorna uma string vazia se a data for indefinida
    }
  
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`;
  }
  const handleSubmit = async () => {
    try {
      const data = {
        NOportunidade: nOportunidade,
        Titulo: titulo
      };
  
      if (arquivoSelecionado) {
        const formData = new FormData();
        formData.append("ficheiro", arquivoSelecionado);
  
        const response = await api.post("/api/ficheiro", formData);
        
        data.EnderecoAnexo = response.data.message;
        data.Descricao = null;
        
        await api.post(`/api/status`, data);
        
      } else if (mensagem !== ""){
        data.Descricao = mensagem;
        data.EnderecoAnexo = null;
        await api.post(`/api/status`, data);


      }

      setTitulo("");
      setMensagem("");
      setArquivoSelecionado(null);
  
      setAtualizarStatus(atualizarStatus + 1);

    } catch (error) {
      console.error(error);
    }
  };

  var cargo = localStorage.getItem('Cargo');
  const NUtilizador = localStorage.getItem('IDUtilizador');

  useEffect(() => {
    async function fetchDataEmpresa() {
        const response = await api.get('/api/clientes');    
        if(cargo === "0" || cargo === "3")
        {
          const data = response.data.message;
          setOptionsEmpresa(data);
        }else
        {
          const data = response.data.message.filter((cliente) => String(cliente.NUsuarioCriador) === NUtilizador);
          setOptionsEmpresa(data);
        }
      }
    fetchDataEmpresa();
  }, [NUtilizador,cargo]);


  const atulizarOportunidade = () => {
    setAtualizarOportunidade(atualizarOportunidade + 1);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  console.log(oportunidade);
  return (
    <>
      { !oportunidade.NomeCliente || !optionsEmpresa ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
        </div>
      ) :(
    
        
    <div className="container mt-6">
      <div className="row">
      <div className="col-md-5 text-start mt-5">
        <div className="card">
          <div className="card-header"><h3>{oportunidade.Titulo}</h3>
          <h5 className="card-title">Cliente:&nbsp;{oportunidade.NomeCliente}</h5>
          </div>
          
          <div className="card-body">
            
            <p className="card-text">Autor:&nbsp;{oportunidade.NomeUsuarioCriador}</p>
            {oportunidade.Valor ? <p className="card-text">Valor:&nbsp;{oportunidade.Valor}€</p> : <p>Valor: N/A</p> }
            <p className="card-text">Área de negócio:&nbsp;{oportunidade.NomeEtiqueta}</p> 
            <p className="card-text">Tipo do Projeto:&nbsp;{oportunidade.TipoProjeto}</p>
            <div className="d-flex justify-content-end">
              <div className="" role="group" aria-label="Exemplo de grupo de botões">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(event) =>{setshowModalContactosOportunidade(true)}}
                >
                  Contactos <Icon.TelephoneFill/>
                </button>
                { cargo === "0" || cargo === "3" ? (
                 <>
                  &nbsp;&nbsp;
                  <button
                    type="button"
                    className="btn btn-secondary" onClick={() => setShowModal(true)}>
                    <span className="d-flex align-items-center"><span  className="mr-2">Criar Reunião&nbsp;<Icon.CalendarPlus/></span></span>
                  </button>
                 </>
                ): null }
              &nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={(event) =>{setshowModalEditarOportunidade(true)}}
                >
                  Editar <Icon.PencilFill/>
                </button>
                
              </div>
            </div>
          </div>
        </div>
        <div className="col-7">
              <div className="btn-group d-flex justify-content-start">
                <button type="button" className="btn btn-info"
                  style={{ marginTop: '240px' }}
                          onClick={() => history.push('/oportunidades')}
                          >
                            <Icon.ChevronLeft/>
                  </button>
                <button type="button" className="btn btn-primary"
                style={{ marginTop: '240px' }}
                        onClick={() => history.push('/oportunidades')}
                        >
                          Voltar para oportunidades
                </button>
              </div> 
            </div>
            
        </div>
        <div className="col-md-7 text-start mt-5">
          <h5>Descrição:</h5>
          <div style={{ maxHeight: '300px', overflowY: 'auto', whiteSpace: 'pre-wrap'  }}>{oportunidade.Descricao} </div>

        <div className="p-2 form-color">
      
        <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  <h5>Histórico de Ações:</h5>
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div className="accordion-body" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  <Accordion>
                    {status.map((status, index) => (
                      <Accordion.Item key={index} eventKey={index.toString()}>
                        <Accordion.Header>{`${status.Titulo} (${formatDate(status.DataHora)})`}</Accordion.Header>
                        {status.Descricao ? (
                          <Accordion.Body>{status.Descricao}</Accordion.Body>
                        ) : (
                          <Accordion.Body>
                            <a href={status.EnderecoAnexo} target="_blank" rel="noopener noreferrer">Ver anexo</a>
                          </Accordion.Body>
                        )}
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
                <div className="p-2 form-color">
                  <div className="mx-3 d-flex">
                    <div className="flex-grow-1">
                      <div>
                        <input type="text" id="titulo" className="form-control" placeholder="Título" value={titulo} onChange={(event) => setTitulo(event.target.value)} required />
                      </div>
                      <div>
                        <input type="text" id="mensagem" className="form-control" placeholder={arquivoSelecionado ? arquivoSelecionado.name : "Mensagem"} value={mensagem} disabled={arquivoSelecionado !== null} onChange={(event) => setMensagem(event.target.value)} />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button type="button" id="ficheiro" className="btn btn-upload" onClick={() => document.getElementById('file-input').click()}>
                        <Icon.Paperclip />
                      </button>
                      <input id="file-input" type="file" className="d-none" onChange={handleSelecionarArquivo} onCancel={handleCancelarSelecaoArquivo} />
                      <button id="send" className="btn ml-2" onClick={handleSubmit}>
                        <Icon.SendFill />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
         </div>
      </div>
      

        <ModalEditarOportunidade
          show={showModalEditarOportunidade}
          onHide={handleCloseModalEditarOportunidade}
          nCargo = {cargo}
          oportunidade = {oportunidade}
          optionsEmpresa= {optionsEmpresa}
          atulizarOportunidade={atulizarOportunidade}
        />

        <ModalContactos
          show={showModalContactosOportunidade}
          onHide={handleCloseModalContactosOportunidade}
          oportunidade = {oportunidade}
        />  

        <CriarReuniaoOportunidade
          show={showModal}
          onHide={handleCloseModal}
          oportunidade={oportunidade}
        /> 
    </div>
  )}
</>
  );
 
  
}

export { PageOportunidade };