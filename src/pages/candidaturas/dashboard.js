import React, { useState, useEffect } from 'react';
import './style.css'
import api from '../../services/api';
import { useHistory } from "react-router-dom";
import Calendario from "../../components/calendario/calendario";
import GraficoLinhas from "../../components/graficos/graficoLinhas";
import GraficoPizza from "../../components/graficos/graficoPizza";
import GraficoBarras from '../../components/graficos/graficoBarras';
import * as Icon from 'react-bootstrap-icons';

function Dashboard() {
    const [candidatura, setCandidatura] = useState([]);
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);

    const [events, setEvents] = useState([]);
    const [isLoadingCalendario, setIsLoadingCalendario] = useState(true);
    const id = localStorage.getItem("IDUtilizador");

    const [selectedValueEstagio, setSelectedValueEstagio] = useState('');
    const [selectedValueTipo, setSelectedValueTipo] = useState('');

    const [activeTab, setActiveTab] = useState(1);



     //parte da candidatura

    const [searchCandidaturas, setSearchCandidaturas] = useState('');

    const options = [
      { NEstagio: '1', nome: 'Análise' },
      { NEstagio: '2', nome: 'Entrevista' },
      { NEstagio: '3', nome: 'Rejeitada' },
      { NEstagio: '4', nome: 'Aceite' },
    ];

   

  useEffect(() => {
    async function fetchCandidaturas() {
      const response = await api.get('api/candidaturas',{
        params: {
          estado: 1
        }
      });
      if(!selectedValueEstagio)
      {
        setCandidatura(response.data.message);
        setIsLoading(false);
      }else if(selectedValueEstagio === "1")
      {
        const candidatura = response.data.message.filter((candidatura) => candidatura.Estagio === "Análise");
        setCandidatura(candidatura);
        setIsLoading(false);
      }else if(selectedValueEstagio === "2")
      {
        const candidatura = response.data.message.filter((candidatura) => candidatura.Estagio === "Entrevista");
        setCandidatura(candidatura);
        setIsLoading(false);
      }else if(selectedValueEstagio === "3")
      {
        const response = await api.get('api/candidaturas',{
          params: {
            estado: 0
          }
        });
        const candidatura = response.data.message.filter((candidatura) => candidatura.Estagio === "Rejeitada");
      
        setCandidatura(candidatura);
        setIsLoading(false);
      }else if(selectedValueEstagio === "4")
      {
        const candidatura = response.data.message.filter((candidatura) => candidatura.Estagio === "Aceite");
        setCandidatura(candidatura);
        setIsLoading(false);
      }
    }

    fetchCandidaturas();
  }, [selectedValueEstagio]);

    const flitragemCandidaturas = candidatura.filter((candidatura) => candidatura.NomeVaga.toLowerCase().includes(searchCandidaturas.toLowerCase()) 
    || candidatura.NomeUsuario.toLowerCase().includes(searchCandidaturas.toLowerCase()) )


  

  //parte da entrevista

    const [entrevistas, setEntrevista] = useState([]);
    const [todascandidatura, setTodasCandidatura] = useState([]);
    const [searchEntrevistas, setSearchEntrevistas] = useState('');

    const optionsEntrevista = [
      { NTipo: '1', nome: 'Pendente'},
      { NTipo: '2', nome: 'Finalizada'}
    ];
  
    useEffect(() => {
      async function fetchEntrevistas() {
        const response = await api.get('api/entrevistas',{
          params: {
            estado: 1
          }
        });
        if(!selectedValueTipo)
        {
          setEntrevista(response.data.message);
          setIsLoading(false);
        }else if (selectedValueTipo === "1") {
          const entrevista = response.data.message.filter((entrevista) => entrevista.Estado == "Pendente");
          setEntrevista(entrevista);
          setIsLoading(false);
        }else if(selectedValueTipo === "2"){
          const entrevista = response.data.message.filter((entrevista) => entrevista.Estado == "Finalizada")
          setEntrevista(entrevista);
          setIsLoading(false);
        }
      }
      fetchEntrevistas();
    }, [selectedValueTipo]);

      const filteredEntrevistas = entrevistas.filter((entrevista) => {
        const { NomeVaga, NomeUsuario } = entrevista;
        const lowerCaseQuery = searchEntrevistas.toLowerCase();
        return NomeVaga.toLowerCase().includes(lowerCaseQuery) || NomeUsuario.toLowerCase().includes(lowerCaseQuery);
      });
    


    useEffect(() => {
      async function fetchCandidaturas() {
        const response = await api.get('api/candidaturas');
      
          setTodasCandidatura(response.data.message);
        
          setIsLoading(false);
      }

      fetchCandidaturas();
    }, [selectedValueTipo]);



    //parte da calendario

    useEffect(() => {
      async function fetchEvents() {
        try {
          const response = await api.get("api/usuarioreunioes?nusuario=" + id);
          const reunioes = response.data.message;
  
          // Mapear as reuniões recebidas da API e formatá-las corretamente para o FullCalendar
          const mappedEvents = reunioes.map((reuniao) => {
            let eventColor = 'blue';
          
            if (reuniao.Tipo === 0) {
              eventColor = 'yellow';
            } else if (reuniao.Tipo === 1) {
              eventColor = '#111211';
            }
          
            return {
              title: reuniao.Titulo,
              start: reuniao.DataHoraInicio,
              end: reuniao.DataHoraFim,
              id: reuniao.NReunioes.toString(),
              color: eventColor
            };
          });
  
          setEvents(mappedEvents);
          setIsLoadingCalendario(false);
        } catch (error) {
          console.error("Erro ao obter reuniões da API:", error);
        }
      }
  
      fetchEvents() 
    }, [id]);



    //graficos das candidaturas

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [chartDataCandidatura, setChartDataCandidatura] = useState(null);
    const [chartDataCandidaturaPorVaga, setChartDataCandidaturaPorVaga] = useState(null);
    const [chartPizzaDataCandidatura, setChartPizzaCandidatura] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try { 

          const selectedDate = new Date();
          selectedDate.setMonth(currentMonth);
          selectedDate.setDate(1);
          selectedDate.setHours(0, 0, 0, 0);
          const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

          const totalCandidaturasByDay = new Array(daysInMonth).fill(0);
          
          //para o grafico coluna

          todascandidatura.forEach((candidatura) => {
            const candidaturaDate = new Date(candidatura.DataCandidatura);
            if (
              candidaturaDate.getMonth() === selectedDate.getMonth() &&
              candidaturaDate.getFullYear() === selectedDate.getFullYear()
            ) {
              const dayOfMonth = candidaturaDate.getDate();
              totalCandidaturasByDay[dayOfMonth - 1] += 1;
            }
          });
    
          const labels = Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            return `${day.toString().padStart(2, "0")}/${(currentMonth + 1).toString().padStart(2, "0")}`;
          });
    
          const newChartDataCandidatura = {
            labels: labels,
            datasets: [
              {
                label: "Candidaturas",
                data: totalCandidaturasByDay,
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.4,
                borderJoinStyle: "round",
              },
            ],
          };
    
          setChartDataCandidatura(newChartDataCandidatura);

       
// Gráfico de barras das candidaturas por vaga
selectedDate.setMonth(currentMonth);
selectedDate.setDate(1);
selectedDate.setHours(0, 0, 0, 0);

const candidaturasByVaga = {};

todascandidatura.forEach((candidatura) => {
  const candidaturaDate = new Date(candidatura.DataCandidatura);
  if (
    candidaturaDate.getMonth() === selectedDate.getMonth() &&
    candidaturaDate.getFullYear() === selectedDate.getFullYear()
  ) {
    const { NVaga, NomeVaga } = candidatura;

    if (!candidaturasByVaga[NVaga]) {
      candidaturasByVaga[NVaga] = {
        label: NomeVaga,
        data: 0,
        backgroundColor: "rgba(75, 192, 192, 1)",
      };
    }

    candidaturasByVaga[NVaga].data += 1;
  }
});

const newChartDataCandidaturaPorVaga = {
  labels: Object.values(candidaturasByVaga).map((vaga) => vaga.label),
  datasets: [
    {
      label: "Candidaturas por Vaga",
      data: Object.values(candidaturasByVaga).map((vaga) => vaga.data),
      backgroundColor: Object.values(candidaturasByVaga).map((vaga) => vaga.backgroundColor),
      tension: 0.4,
      borderJoinStyle: "round",
    },
  ],
};

setChartDataCandidaturaPorVaga(newChartDataCandidaturaPorVaga);

          //para o grafico pizza
          const totalCandidaturasByStage = {
            Aceite: 0,
            Análise: 0,
            Entrevista: 0,
            Rejeitada: 0,
          };
          
          todascandidatura.forEach((candidatura) => {
            const candidaturaDate = new Date(candidatura.DataCandidatura);
            if (
              candidaturaDate.getMonth() === selectedDate.getMonth() &&
              candidaturaDate.getFullYear() === selectedDate.getFullYear()
            ) {
              const stage = candidatura.Estagio;
              if (stage === "Aceite") {
                totalCandidaturasByStage.Aceite += 1;
              } else if (stage === "Análise") {
                totalCandidaturasByStage.Análise += 1;
              } else if (stage === "Entrevista") {
                totalCandidaturasByStage.Entrevista += 1;
              } else if (stage === "Rejeitada") {
                totalCandidaturasByStage.Rejeitada += 1;
              }
            }
          });
    
          const newChartPizzaDataCandidatura = {
            labels: Object.keys(totalCandidaturasByStage),
            datasets: [
              {
                label: "Candidaturas",
                data: Object.values(totalCandidaturasByStage),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                ],
                borderWidth: 1,
              },
            ],
          };
    
          setChartPizzaCandidatura(newChartPizzaDataCandidatura);

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, [currentMonth,activeTab, todascandidatura]);


  return (
    <>
      {isLoading && isLoadingCalendario ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
        </div>
      ) :(
      <div className="container mt-6 mb-4">
        
       <h1 className="col-md-3 mb-5 ">Dashboard Vagas</h1> 

        <div className="row">
          <div  className="col-md-6">
           <Calendario events={events} isLoading={isLoading} bloquearEventos={true}/>
          </div>

          <div className="col-md-6">
          <h5>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === 1 ? 'active' : ''}`}
                  onClick={() => setActiveTab(1)}
                  href="#"
                >
                  Candidatura
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === 2 ? 'active' : ''}`}
                  onClick={() => setActiveTab(2)}
                  href="#"
                >
                  Entrevistas
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === 3 ? 'active' : ''}`}
                  onClick={() => setActiveTab(3)}
                  href="#"
                >
                  Crescimento
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === 4 ? 'active' : ''}`}
                  onClick={() => setActiveTab(4)}
                  href="#"
                >
                  Distribuição
                </a>
              </li>
            </ul> 
          </h5> 
            

            {activeTab === 1 ?
            <>
            <div className="row mb-3 mt-3">
              <div className="col-md-7">
                <input className="form-control" type="search" value={searchCandidaturas} placeholder="Título/Candidato" onChange={(event) => setSearchCandidaturas(event.target.value)}/>
                </div>
              <div className="col-md-1"/>
              <div className="col-md-4">
              <select value={selectedValueEstagio} className="form-select" onChange={(event) => setSelectedValueEstagio(event.target.value)}>
                <option value="">(Estágio)</option>
                {options.map((option) => (
                <option key={option.NEstagio} value={option.NEstagio}>
                    {option.nome}
                </option>
                ))}
              </select>
              </div>
            </div>
            
            <div style={{ height: '445px', overflow: 'auto' }}>
              <table className="table table-striped table-bordered w-100">
                    <thead>
                      <tr>
                        <th className="col-1">Estágio</th>
                        <th className="col-2">Título</th>
                        <th className="col-1">Candidato</th>
                        <th className="col-1">Data</th>
                        <th className="col-5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {flitragemCandidaturas.map((candidatura) => (
                        <tr key={candidatura.NCandidatura}>
                          <td>{candidatura.Estagio}</td>
                          <td>{candidatura.NomeVaga}</td>
                          <td>{candidatura.NomeUsuario}</td>
                          <td>{new Date(candidatura.DataCandidatura).toLocaleDateString()}</td>
                          <td><button
                              type="button"
                              className="btn btn-outline-primary transparent-btn mx-2"
                              onClick={() => history.push(`/candidaturas/${candidatura.NCandidatura}`)}
                              >
                              Mostrar mais
                              </button>
                        </td>
                        </tr> 
                      ))}
                    </tbody>
                  </table>
              </div>
            </>
           
              : activeTab === 2 ?
              <>
                <div className="row mb-3 mt-3">
                  <div className="col-md-7">
                  <input className="form-control" type="search" value={searchEntrevistas} placeholder="Título/Candidato" onChange={(event) => setSearchEntrevistas(event.target.value)}/>
                  </div>
                  <div className="col-md-1"/>
                  <div className="col-md-4">
                  <select value={selectedValueTipo} className="form-select" onChange={(event) => setSelectedValueTipo(event.target.value)}>
                    <option value="">(Estado)</option>
                    {optionsEntrevista.map((option) => (
                    <option key={option.NTipo} value={option.NTipo}>
                        {option.nome}
                    </option>
                    ))}
                  </select>
                  </div>
                </div>
                <div style={{ height: '445px', overflow: 'auto' }}>
                  <table className="table table-striped table-bordered w-100">
                    <thead>
                      <tr>
                        <th className="col-1">Estado</th>
                        <th className="col-2">Título</th>
                        <th className="col-2">Candidato</th>
                        <th className="col-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEntrevistas.map((entrevista) => (
                        <tr key={entrevista.NEntrevista}>
                          <td className="text-center">
                            {entrevista.Estado === "Pendente" ? (
                              <Icon.ClockHistory />
                            ) : entrevista.Estado === "Finalizada" ? (
                              <Icon.CheckLg />
                            ) : null}
                          </td>
                          <td>{entrevista.NomeVaga}</td>
                          <td>{entrevista.NomeUsuario}</td>
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
              </>   
              : activeTab === 3 ? 
              <>
              <div className="month-navigation mt-5" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button className="btn btn-primary" onClick={() => setCurrentMonth((prevMonth) => prevMonth - 1)}><Icon.CaretLeftFill/></button>
                <h3 className="mx-2">{new Date(new Date().getFullYear(), currentMonth, 1).toLocaleString("pt", { month: "long", year: "numeric" })}</h3>
                <button className="btn btn-primary" onClick={() => setCurrentMonth((prevMonth) => prevMonth + 1)}> <Icon.CaretRightFill/></button>
              </div>
              <div>
                <GraficoLinhas chartData={chartDataCandidatura} Nome={"Candidaturas"} />
                <GraficoBarras chartData={chartDataCandidaturaPorVaga} Nome={"Candidaturas por vaga"} />
              </div>
            </>
              : activeTab === 4 ? 
              <>
              <div className="month-navigation mt-5" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button className="btn btn-primary" onClick={() => {setCurrentMonth((prevMonth) => prevMonth - 1)}}><Icon.CaretLeftFill/></button>
                <h3 className='mx-2'>{new Date(new Date().getFullYear(), currentMonth, 1).toLocaleString("pt", { month: "long", year: "numeric" })}</h3>
                <button className="btn btn-primary" onClick={() => {setCurrentMonth((prevMonth) => prevMonth + 1)}}><Icon.CaretRightFill/></button>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> 
               <GraficoPizza chartData={chartPizzaDataCandidatura} Nome={"Estado das candidaturas"} />
              </div>    
              </>

              :null
              }

            </div>
          </div>
        </div>
      )}
  </>
    
    
  );
}

export { Dashboard };
