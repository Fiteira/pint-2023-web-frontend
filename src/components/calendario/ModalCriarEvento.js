import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useState,useRef } from 'react';
import api from "../../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "../../components/toasts/toast";
import * as Icon from 'react-bootstrap-icons';

const ModalCriarEventos = ({ show, onHide, evento, candidatura, noportunidade, tipo, datainicio, datafim,AtualizarCalendario}) => {

  const {showSuccessToast} = useToast();
    let nusuariocandidato = (candidatura) ? candidatura.NUsuario : null;
    const nusuariocriador = localStorage.getItem("IDUtilizador");

    const [notificarParticipantes, setNotificarParticipantes] = useState(false);
    const [notificacaoTempo, setNotificacaoTempo] = useState(null);

    const descricao = useRef('');
    const titulo = useRef('')

    const [usuarios, setUsuarios] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([])

    const [submitting, setSubmitting] = useState(false);

    const handleUserSelection = (user) => {
      setSelectedUsers((prevSelectedUsers) => {
        if (prevSelectedUsers.includes(user)) {
          return prevSelectedUsers.filter((selectedUser) => selectedUser !== user);
        } else {
          return [...prevSelectedUsers, user];
        }
      });
    };

    const handleNotificacaoTempoChange = (e) => {
      const selectedOption = e.target.value;
      setNotificacaoTempo(selectedOption);
    }

    const handleNotificarParticipantesChange = (e) => {
      const selectedOption = e.target.value;
      setNotificarParticipantes(selectedOption);
  
      if (selectedOption === false) {
        setNotificacaoTempo(null);
      }
    }
    async function handleSubmit(event) {
      event.preventDefault();

      if (submitting) {
        return;
      }
  
      setSubmitting(true);

      const estado = "Pendente";
      const descricaoValue = descricao.current.value;
      const tituloValue = titulo.current.value;

      let dataHoraNotificacao = null;

      if (notificarParticipantes !== 'nao' && notificacaoTempo) {
        const tempoNotificacao = parseInt(notificacaoTempo, 10);
        dataHoraNotificacao = new Date(datainicio);
        dataHoraNotificacao.setMinutes(dataHoraNotificacao.getMinutes() - tempoNotificacao);
      }
    
      const reunioesParams = {
        NUsuarioCriador: nusuariocriador,
        Titulo: tituloValue,
        Descricao: descricaoValue,
        Tipo: tipo,
        DataHoraInicio: datainicio,
        DataHoraFim: datafim,
        DataHoraNotificacao : dataHoraNotificacao
      };
    
      let promise;
     
      if (tipo === 0) {

       const response = await api.put(`api/candidaturas/${candidatura.NCandidatura}`,{
          Estagio:"Entrevista"
        });
        try {
          const entrevistaRes = await api.post("/api/entrevistas", {
            NCandidatura: candidatura.NCandidatura,
            Descricao: descricaoValue,
            Estado: estado,
          });
      
          reunioesParams.NEntrevista = entrevistaRes.data.message.NEntrevista;
    
          promise = api.post("/api/reunioes", reunioesParams);
        } catch (error) {
          console.log(error);
        }
      } else if (tipo === 1) {
        promise = api.post("/api/reunioes", {
          NOportunidade: noportunidade,
          ...reunioesParams,
        });
      } else {
        promise = api.post("/api/reunioes", {
          Tipo: 2,
          ...reunioesParams,
        });
      }

      try {
        const reuniaoRes = await promise;
        console.log(reuniaoRes);
        const promises = [];
    
        selectedUsers.forEach((user) => {
          promises.push(
            api.post("/api/usuarioreunioes", {
              NUsuario: user.NUsuario,
              NReunioes: reuniaoRes.data.message.NReunioes,
            })
          );
        });
    
        await Promise.all(promises);
    
        await api.post("/api/usuarioreunioes", {
          NUsuario: nusuariocriador,
          NReunioes: reuniaoRes.data.message.NReunioes,
        });
    
        await api.post("/api/usuarioreunioes", {
          NUsuario: nusuariocandidato,
          NReunioes: reuniaoRes.data.message.NReunioes,
        });
      } catch (error) {
        console.log(error);
        setSubmitting(false);
      } finally {
        showSuccessToast("Enviado com sucesso")
        AtualizarCalendario();
        setSubmitting(false);
        onHide();
      }
    }

    useEffect(() => {
      async function fetchUsuarios() {
        let response;
    
    
        if (tipo === 0) {
          response = await api.get('api/usuarios?ncargo=5,0');
        } else if (tipo === 1) {
          response = await api.get('api/usuarios?ncargo=0,3');
        } else {
          response = await api.get('api/usuarios');
        }
    
        // Não colocar o Usuario Criaador e o candidato na lista de selecionar, pois vem por padrão
        const filteredUsuarios = response.data.message.filter(
          usuario => usuario.NUsuario !== nusuariocandidato && usuario.NUsuario !== nusuariocriador
        );
    
        setUsuarios(filteredUsuarios);
      }
    
      fetchUsuarios();
    }, [nusuariocandidato, nusuariocriador, tipo]);

    return (
      <Modal show={show} onHide={onHide} size="xl">
    <form onSubmit={handleSubmit}>
      <Modal.Header closeButton>
        <Modal.Title> Criar Reunião {(tipo === 0) ? "Entrevista" : (tipo === 1) ? "Oportunidade" : ""} <br/> </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label htmlFor="dataInicio">Data de Início:</label>
          <DatePicker
            selected={datainicio}
            disabled={true}
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
          />
        </div>
        <div>
          <label htmlFor="dataFim">Data de Fim:</label>
          <DatePicker
            selected={datafim}
            disabled={true}
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
          />
        </div>
        <label htmlFor="name">Título:</label>
        <input type="text" className='form-control' ref={titulo} required/><br />

        <label htmlFor="name">Descrição:</label>
        <textarea type="text" className='form-control' ref={descricao}/><br />
<div className="form-check">
  <input
    className="form-check-input"
    type="checkbox"
    id="notificarParticipantes"
    checked={notificarParticipantes}
    onChange={() => setNotificarParticipantes(!notificarParticipantes)}
  />
  <label className="form-check-label" htmlFor="notificarParticipantes">
    Notificar participantes
  </label>
</div>
{notificarParticipantes && (
  <div className="form-group mb-1">
    <label htmlFor="notificacaoTempo">Tempo de Notificação:</label>
    <select
      className="form-control"
      id="notificacaoTempo"
      value={notificacaoTempo}
      onChange={handleNotificacaoTempoChange}
    >
      <option value="">Selecione o tempo</option>
      <option value="15">15 min</option>
      <option value="30">30 min</option>
      <option value="45">45 min</option>
      <option value="60">1 hora</option>
      <option value="1440">1 dia</option>
    </select>
  </div>
          )}
       <div className="accordion" id="usersAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="usersHeading">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#usersCollapse" aria-expanded="false" aria-controls="usersCollapse">
              Adicionar participantes ({tipo === 0 ? (<small>Você e o candidato já fazem parte da reunião</small>) : (<small>Você já faz parte da reunião</small>)})
            </button>
          </h2>
          <div id="usersCollapse" className="accordion-collapse collapse show" aria-labelledby="usersHeading" data-bs-parent="#usersAccordion">
            <div className="accordion-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {/* Scrollable list of users */}
              <ul className="list-group">
                {usuarios.map((user) => (
                  <li
                    className={`list-group-item ${selectedUsers.includes(user) ? 'active' : ''}`}
                    key={user.NUsuario}
                    onClick={() => handleUserSelection(user)}
                  >
                    {user.Nome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit" disabled={submitting}>
        {submitting ? "Enviando..." : <>Enviar <Icon.SendFill/></>}
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Fechar <Icon.XLg/>
        </Button>
      </Modal.Footer>
    </form>
  </Modal>
    );
            }
  
  export default ModalCriarEventos;
