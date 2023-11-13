import "./style.css";
import api from "../../services/api";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Alert from '../../components/alerts/alerts.js'
import { useToast } from "../../components/toasts/toast";
import * as Icon from 'react-bootstrap-icons';

function Entrevista() {
  const {nentre} = useParams();
  const [entrevista, setEntrevista] = useState("");
  const [candidatura, setCandidatura] =  useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [nota, setNota] = useState("");
  const fotoperfil = localStorage.getItem('Foto');
  const idRH = localStorage.getItem('IDUtilizador');
  const [novanota, setNovanota] = useState("");
  const [atualizarMensagens, setAtualizarMensagens] = useState(0);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const {showErrorToast, showSuccessToast} = useToast();  
  const [showAlertRejeitar, setShowAlertRejeitar] = useState(false);
  const [showAlertAceitar, setShowAlertAceitar] = useState(false);
  const history = useHistory();

  const handleCloseAlertRejeitar = () => {
    setShowAlertRejeitar(false);
  };
  const handleCloseAlertAceitar = () => {
    setShowAlertAceitar(false);
  };
  function RemoverCandidatura () {

    api.put(`/api/candidaturas/${candidatura.NCandidatura}`, {  
       Estagio: "Rejeitada"
      })
      .then(() => {
  
      handleCloseAlertRejeitar()
      history.push(`/candidaturas/${candidatura.NCandidatura}`);
      })
      .catch((err) => {
        console.log(err);
      });

  };

  function AceitarCandidatura () {

    api.put(`/api/candidaturas/${candidatura.NCandidatura}`, {  
       Estagio: "Aceite"
      })
      .then(() => {
        handleCloseAlertAceitar()
        showSuccessToast("Candidatura aceite com sucesso")
        history.push(`/candidaturas/${candidatura.NCandidatura}`);
      })
      .catch((err) => {
        console.log(err);
      });

  };
  

  

  useEffect(() => {
    async function fetchData() {
      if (nentre) {
        try {
          const response = await api.get(`/api/entrevistas/${nentre}`);
          if (response.data.success === false) {
            setEntrevista(null);
          } else {
            setEntrevista(response.data.message);
          }
        } catch (error) {
          console.error(error);
          setEntrevista(null);
        }
      } else {
        setEntrevista(null);
      }
    }
  
    fetchData();
  }, [nentre]);// eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    async function fetchCandidaturas() {
      if (entrevista && entrevista.NCandidatura) {
        try {
          const response = await api.get(`/api/candidaturas/${entrevista.NCandidatura}`);
          if (response.data.success === false) {
            setCandidatura(null);
          } else {
            setCandidatura(response.data.message);
          }
        } catch (error) {
          console.error(error);
          setCandidatura(null);
        }
      } else {
        setCandidatura(null);
      }
    }
  
    fetchCandidaturas();
  }, [entrevista]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function fetchNota() {
      if (entrevista) {
        try {
          const response = await api.get(`/api/nota?nentrevista=${nentre}`);
          if (response.data.success === false) {
            setNota(null);
          } else {
            setNota(response.data.message);
            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
          setNota(null);
        }
      } else {
        setNota(null);
      }
    }
  
    fetchNota();
  }, [candidatura, atualizarMensagens]);// eslint-disable-line react-hooks/exhaustive-deps
  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      handleNovaNota();
    }
  }
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
    if (file.type === "application/pdf" || (file && file.length > 0) ) {
      // O arquivo selecionado é um arquivo PDF
      setArquivoSelecionado(file);
    } else {
      // O arquivo selecionado não é um arquivo PDF, exibe um alerta
      showErrorToast("Utilize o formato de ficheiro correto!");
      event.target.value = "";
    }
  };
  function formatarDataHora(dataHora) {
    const data = new Date(dataHora);
    const dia = adicionarZero(data.getDate());
    const mes = adicionarZero(data.getMonth() + 1);
    const ano = data.getFullYear();
    const hora = adicionarZero(data.getHours());
    const minuto = adicionarZero(data.getMinutes());
  
    return `${dia}/${mes}/${ano}, às ${hora}:${minuto}`;
  }
  
  function adicionarZero(numero) {
    if (numero < 10) {
      return `0${numero}`;
    }
    return numero;
  }
  const handleNovaNota = async () => {
    try {
      const data = {
        DataHora: new Date(),
        NUsuarioRH: idRH,
        NEntrevista: entrevista.NEntrevista,
      };
  
      if (arquivoSelecionado) {
        const formData = new FormData();
        formData.append("ficheiro", arquivoSelecionado);
  
        const response = await api.post("/api/ficheiro", formData);
        data.Anexo = response.data.message;
        data.Texto = null;
        await api.post(`/api/nota`, data);
      } else if (novanota !== ""){
        data.Texto = novanota;
        data.Anexo = null;
        await api.post(`/api/nota`, data);
      }else{
        showErrorToast("Escreva uma mensagem ou adicione um anexo!")
      }
  

    } catch (error) {
      console.error(error);
    }
  
    setAtualizarMensagens(atualizarMensagens + 1);
    setNovanota("");
    setArquivoSelecionado(null);
  };
  const handleCancelarSelecaoArquivo = () => {
    setArquivoSelecionado(null);
    document.getElementById('comentario').disabled = false;
  };
  const handleInput = (event) => {
    setNovanota(event.target.value);
  };


  console.log(entrevista);

  return (
    <>
    {isLoading ? (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
      </div>
    ) :(

       
      <div className="container mt-6">
      <div className="row">
      <div className="col-md-4 mt-5">
      <div className="card text-start">
  <h3 className="card-header">{candidatura.NomeUsuario}</h3>
  <div className="card-body">
    <h5 className="card-title mb-4">Vaga: {candidatura.NomeVaga}</h5>
    <div className="row">
      <div className="col-12">
      <button
                type="button"
                className="btn btn-primary btn-block w-100"
                onClick={() =>
                  history.push(`/candidaturas/${candidatura.NCandidatura}`)
                }
              >
                <span className="align-items-center">
                  <span className="mr-2">
                    Ver candidatura&nbsp;<Icon.PersonFill />
                  </span>
                </span>
              </button>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col d-flex" >
              {candidatura.Estagio === "Análise" || candidatura.Estagio === "Entrevista" ? (
                <>
                  <button
                    type="button"
                    className="btn btn-primary btn-block mt-3 mx-1 w-50"
                    onClick={() => setShowAlertRejeitar(true)}
                  >
                    <span className="align-items-center">
                      <span className="mr-1">
                        Rejeitar candidato&nbsp;<Icon.XLg />
                      </span>
                    </span>
                  </button>
                  <button
                type="button"
                className="btn btn-secondary btn-block mt-3 mx-1 w-50"
                onClick={() => setShowAlertAceitar(true)}
              >
                <span className="align-items-center">
                  <span className="mr-1">
                    Aprovar candidato&nbsp;<Icon.CheckLg />
                  </span>
                </span>
              </button>
      
                  <Alert
                    show={showAlertRejeitar}
                    onHide={handleCloseAlertRejeitar}
                    nome={"Deseja rejeitar a candidatura?"}
                    click={RemoverCandidatura}
                    mensagem={"Candidatura removida com sucesso!"}
                    enviadoComSucesso={false}
                  />
                  <Alert
                    show={showAlertAceitar}
                    onHide={handleCloseAlertAceitar}
                    nome={"Deseja aprovar essa candidatura?"}
                    click={AceitarCandidatura}
                    mensagem={"Candidatura aprovada com sucesso!"}
                    enviadoComSucesso={false}
                  />
                </>
              ) : (
                <strong>Candidatura {candidatura.Estagio}</strong>
              )}
            </div>
          
        
   
          </div>
        </div>
      </div>
      <div className="col-8">
              <div className="btn-group d-flex justify-content-start">
                <button type="button" className="btn btn-info"
                  style={{ marginTop: '320px' }}
                          onClick={() => history.push('/dashboard')}
                          >
                            <Icon.ChevronLeft/>
                  </button>
                <button type="button" className="btn btn-primary"
                style={{ marginTop: '320px' }}
                        onClick={() => history.push('/dashboard')}
                        >
                          Voltar para o dashboard
                </button>
              </div> 
            </div>
      </div>
    
      <div className="col-md-8 mt-5">
        <div className="col-md-12">

           <div className="text-start">
           <h4>Descrição:</h4>
            <div className="text-start mb-5" style={{ maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap'}}>
                {entrevista.Descricao}
            </div>
           </div>     
          
          
            

          <div className="card">
            <div className="p-3 bg-grey text-start">
              <h4>Notas da Entrevista</h4>
            </div>
            <div className="mt-2" id="mensagens">
            {nota.sort((a, b) => new Date(a.DataHora) - new Date(b.DataHora)).map((nota, index) => (
  <div key={index} className={`mt-2 message-bg ${index % 2 === 0 ? "even" : "odd"}`}>
    <div className="d-flex flex-row p-3">
      <div className="w-100">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-row align-items-center">
            <span className="mr-2"><b>{nota.NomeRH}</b></span>
          </div>
          <small>{formatarDataHora(nota.DataHora)}</small>
        </div>
        {nota.Anexo ?
          nota.Texto ?
            <p className="text-justify comment-text mb-0 ">
              {nota.Texto}
            </p>
            :
            <a href={nota.Anexo} target="_blank" rel="noopener noreferrer">Ver anexo</a>
          :
          <p className="text-justify comment-text mb-0 text-start">
            {nota.Texto}
          </p>
        }
      </div>
    </div>
  </div>
))}
</div>
<div className="mt-2 d-flex flex-row align-items-center p-3 form-color">
      <img src={fotoperfil} width="50" className="rounded-circle mr-2" alt="FotoPerfil" />
      <div className="input-group mx-3">
        <input
          type="text"
          className="form-control"
          placeholder={arquivoSelecionado ? arquivoSelecionado.name : "Introduza o comentário..."}
          value={novanota}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={arquivoSelecionado !== null}
        />
  <button type="button" id="ficheiro" className="btn btn-upload" onClick={() => document.getElementById('file-input').click()}>
    <Icon.Paperclip/>
  </button>
  <input id="file-input" type="file" className="d-none" onChange={handleSelecionarArquivo} onCancel={handleCancelarSelecaoArquivo} />

        <button id="send" className="btn" onClick={handleNovaNota}><Icon.SendFill/></button>
      </div>
    </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )}
  </>
  );
}

export { Entrevista };
