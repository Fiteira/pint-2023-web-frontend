import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import "./style.css";
import ptLocale from "@fullcalendar/core/locales/pt";
import ModalCriarEventos from './ModalCriarEvento';
import api from "../../services/api";
import ModalVerEvento from "./ModalVerEvento";
import { useToast } from '../../components/toasts/toast';
import 'bootstrap-icons/font/bootstrap-icons.css'
// Tipo => 0 = entrevista,  1 = oportunidade e 2 = outros
const Calendario = ({  candidatura, noportunidade, tipo, bloquearEventos }) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [evento, setEvento] = useState(null);
  const { showErrorToast} = useToast();
  const nutilizador = localStorage.getItem('IDUtilizador');

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [atualizarCalendario, setAtualizarCalendario] = useState(1);

  const atualizar = () =>{
    setAtualizarCalendario(atualizarCalendario + 1);
  }

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await api.get("api/usuarioreunioes?nusuario=" + nutilizador);
        const reunioes = response.data.message;
        // Mapear as reuniões recebidas da API e formatá-las corretamente para o FullCalendar
        const mappedEvents = reunioes.map((reuniao) => {
          let eventColor = 'blue';
        
          if (reuniao.Tipo === 0) {
            eventColor = '#32d600';
          } else if (reuniao.Tipo === 1) {
            eventColor = '#111211';
          }
        
          return {
            title: reuniao.Titulo,
            start: reuniao.DataHoraInicio,
            end: reuniao.DataHoraFim,
            id: reuniao.NReunioes.toString(),
            color: eventColor,
            extendedProps: {
              nreuniao: reuniao.NReunioes,
              tipo: reuniao.Tipo,
              nentrevista: reuniao.NEntrevista || 0,
              noportunidade: reuniao.NOportunidade || 0

            }
          };
        });

        setEvents(mappedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter reuniões da API:", error);
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [nutilizador,atualizarCalendario])
    

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseModalVer = () => {
    setShowModalVer(false);
  };

  const handleDateClick = (info) => {
    //console.log(`Inicio ${info.start}, fim ${info.end}` )
    setStartDate(info.start)
    setEndDate(info.end)
    setShowModal(true);
  };

  const handleSelectEvent = async (arg) => {
//alert(arg.event.title + " " + arg.event.start);
  await setEvento(arg.event)
  setShowModalVer(true)

  // TODO: Criar um modal usando os parametros acima!

  }


  
  



  return (
    <div className="container">
      
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="spinner-border mx-auto my-auto" style={{ width: "3rem", height: "3rem" }} role="status" />
        </div>
      ) : (
        <div>
          <ModalVerEvento
            show={showModalVer}
            onHide={handleCloseModalVer}
            evento={evento}
          />
          <ModalCriarEventos
            show={showModal}
            onHide={handleCloseModal}
            tipo={tipo}
            candidatura={candidatura}
            noportunidade={noportunidade}
            datainicio={startDate}
            datafim={endDate}
            AtualizarCalendario={atualizar}
          />
          <FullCalendar        
            selectable="true"
            editable
            dayHeaders
            eventStartEditable="false"
            events={events}
            headerToolbar={{
              start: "today prev next",
              center: "title",
              end: "dayGridMonth timeGridWeek timeGridDay",
            }}
            plugins={[daygridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
            themeSystem='bootstrap5'
            views={{
              dayGridMonth: {
                titleFormat: { year: "numeric", month: "long" },
              },
              timeGridWeek: {
                titleFormat: { year: "numeric", month: "long" },
              },
              timeGridDay: {
                titleFormat: { year: "numeric", month: "long", day: "2-digit" },
                allDaySlot: false,
              },
            }}
            navLinks={true}
            locale={ptLocale}
            selectMirror
            eventClick={function (arg) {
              handleSelectEvent(arg)
            }}
            unselectAuto

            select={function (arg) {
              if (arg.start.getHours() !== 0 || arg.start.getMinutes() !== 0) {

                if(bloquearEventos === true){
                  showErrorToast("Este calendário é apenas de visualização, não é permitido criar eventos!")  
                }
                else
                handleDateClick(arg);
              }else {
                let calendarApi = arg.view.calendar;
                calendarApi.changeView("timeGridDay", arg.start);
            }}
          }
          />
        </div>
      )}
      <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ backgroundColor: 'blue', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
        <span style={{ marginLeft: '5px' }}>Outros</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
        <span style={{ backgroundColor: '#111211', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
        <span style={{ marginLeft: '5px' }}>Oportunidades</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
        <span style={{ backgroundColor: '#32d600', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
        <span style={{ marginLeft: '5px' }}>Entrevistas</span>
      </div>
    </div>
     
    
    </div>
  );
};

export default Calendario;