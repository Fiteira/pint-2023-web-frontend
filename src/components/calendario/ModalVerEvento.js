import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../services/api";
import { useHistory } from "react-router-dom";
import * as Icon from 'react-bootstrap-icons';
const ModalVerEvento = ({ show, onHide, evento }) => {
  const [nomeParticipantes, setNomeParticipantes] = useState([]);
  const history = useHistory();

  const cargo = localStorage.getItem('Cargo');


  useEffect(() => {
    async function fetchParticipantes() {
      if (evento) {
        setNomeParticipantes([]);
        await api
          .get(`/api/usuarioreunioes?nreuniao=${evento.extendedProps.nreuniao}`)
          .then((response) => {
            const nomePromises = response.data.message.map((participante) => api.get(`/api/usuarios/${participante.NUsuario}`));
            Promise.all(nomePromises)
              .then((responses) => {
                const nomes = responses.map((response) => response.data.message.Nome);
                setNomeParticipantes(nomes);
              })
              .catch((error) => {
                console.log("Erro ao buscar nomes dos participantes:", error);
              });
          })
          .catch((error) => {
            console.log("Erro ao buscar participantes:", error);
          });
      }
    }

    fetchParticipantes();
  }, [evento]);
  if (!evento) {
    return null;
  }
  const handleAddToGoogleCalendar = () => {
    const startDate = evento.start.toISOString().replace(/-|:|\.\d+/g, "");
    const endDate = evento.end.toISOString().replace(/-|:|\.\d+/g, "");
  
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evento.title)}&dates=${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`;
  
    window.open(url, "_blank");
  };
  function formatDateTimeRange(startDate, endDate) {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedStartDate = startDate.toLocaleString("pt-pt", options);
    const formattedEndDate = endDate.toLocaleString("pt-pt", options);

    const endTime = formattedEndDate.split(",")[1].trim();

    return `${formattedStartDate} - ${endTime}`;
  }

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title><i>{evento.title}</i></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>
          {evento.extendedProps.tipo === 0 && <span>Entrevista - {formatDateTimeRange(evento.start, evento.end)} </span>}
          {evento.extendedProps.tipo === 1 && <span>Reunião - {formatDateTimeRange(evento.start, evento.end)}</span>}
          {evento.extendedProps.tipo !== 0 && evento.extendedProps.tipo !== 1 && <span>Outro - {formatDateTimeRange(evento.start, evento.end)}</span>}
        </h5>
        <div className="accordion" id="usersAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="usersHeading">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#usersCollapse" aria-expanded="false" aria-controls="usersCollapse">
                Participantes:
              </button>
            </h2>
            <div id="usersCollapse" className="accordion-collapse collapse" aria-labelledby="usersHeading" data-bs-parent="#usersAccordion">
              <div className="accordion-body" style={{ maxHeight: "200px", overflowY: "auto" }}>
                <ul className="list-group">
                  {nomeParticipantes.map((nome, index) => (
                    <li className="list-group-item" key={index}>
                      {nome}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div className="align-start">
          <Button variant="secondary" onClick={handleAddToGoogleCalendar}>
            Adicionar à Google Agenda <Icon.CalendarPlusFill/>
          </Button>
        </div>
        <div className="align-end">
        {cargo === "1" || cargo === "2" ? null :
          (evento.extendedProps.tipo === 0 && (
            <Button
              variant="primary"
              onClick={() => history.push(`/entrevistas/${evento.extendedProps.nentrevista}`)}
            >
              Ver entrevista 
            </Button>
          ))
        }
          {cargo === "1" || cargo === "2" ? null :
            (evento.extendedProps.tipo === 1 && (
              <Button
                variant="primary"
                onClick={() => history.push(`/oportunidades/${evento.extendedProps.noportunidade}`)}
              >
                Ver oportunidade
              </Button>
            ))
          }
         
          <Button variant="secondary" className="ms-3" onClick={onHide}>
            Fechar <Icon.XLg/>
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalVerEvento;
