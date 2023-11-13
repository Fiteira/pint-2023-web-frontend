import React, { useEffect, useState } from "react";
import GraficoLinhas from "../../components/graficos/graficoLinhas";
import GraficoPizza from "../../components/graficos/graficoPizza";
import GraficoBarras from "../../components/graficos/graficoBarras";
import api from "../../services/api";
import * as Icon from 'react-bootstrap-icons';


const Reporting = () => {
  const [chartDataCandidatura, setChartDataCandidatura] = useState(null);
  const [chartDataIdeia, setChartDataIdeia] = useState(null);
  const [chartDataOportunidade, setChartOportunidade] = useState(null)
  const [chartDataUsuario, setChartDataUsuario] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [chartPizzaDataCandidatura, setChartPizzaCandidatura] = useState(null);
  const [Candidatura, setCandidatura] = useState([])
  const [Ideia, setIdeia] = useState([])
  const [Oportunidade, setOportunidade] = useState([])
  const [Usuario, setUsuario] = useState([])
  const [dataLoaded, setDataLoaded] = useState([])
  const [chartDataCandidaturaPorVaga, setChartDataCandidaturaPorVaga] = useState(null);
  
  const [activeTab, setActiveTab] = useState(1);

useEffect(() => {
  const fetchData = async() => {
    console.log("Obter dados API...")

    const candidaturasResponse = await api.get("/api/candidaturas");
    const candidaturasData = candidaturasResponse.data.message;
    setCandidatura(candidaturasData)
    const ideiasResponse = await api.get("/api/ideias")
    setIdeia(ideiasResponse.data.message);

    const oportunidadeResponse = await api.get("/api/oportunidades");
    setOportunidade(oportunidadeResponse.data.message);
    setDataLoaded(true)

    const usuariosResponse = await api.get("/api/usuarios");
    setUsuario(usuariosResponse.data.message)
    
  }
  fetchData()
},[])

  useEffect(() => {
  const fetchData = async () => {
    console.log("Calculos...")
    try {
      // Fetch data for "/api/candidaturas" endpoint
 
      // Calculate the total number of days in the selected month
      const selectedDate = new Date();
      selectedDate.setMonth(currentMonth);
      selectedDate.setDate(1);
      selectedDate.setHours(0, 0, 0, 0);
      const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
      // Process the data to get the total candidaturas for each day in the current month
      const totalCandidaturasByDay = new Array(daysInMonth).fill(0);

      Candidatura.forEach((candidatura) => {
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
            fill: true,
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

Candidatura.forEach((candidatura) => {
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
      

const usuariosData = Usuario


// Calculate the total number of days in the selected month
selectedDate.setMonth(currentMonth);
selectedDate.setDate(1);
selectedDate.setHours(0, 0, 0, 0);

// Process the data to get the total usuarios for each day in the current month
const totalUsuariosByDay = new Array(daysInMonth).fill(0);

usuariosData.forEach((usuario) => {
  const usuarioDate = new Date(usuario.DataHoraRegisto);
  if (
    usuarioDate.getMonth() === selectedDate.getMonth() &&
    usuarioDate.getFullYear() === selectedDate.getFullYear()
  ) {
    const dayOfMonth = usuarioDate.getDate();
    totalUsuariosByDay[dayOfMonth - 1] += 1;
  }
});



const newChartDataUsuario = {
  labels: labels,
  datasets: [
    {
      label: "Utilizadores",
      data: totalUsuariosByDay,
      fill: true,
      borderColor: "rgba(75, 192, 192, 1)",
      tension: 0.4,
      borderJoinStyle: "round",
    },
  ],
};

setChartDataUsuario(newChartDataUsuario);

      // Fetch data for "/api/ideias" endpoint

      const ideiasData = Ideia

      // Process the data to get the total ideias for each day in the current month
      const totalIdeiasByDay = new Array(daysInMonth).fill(0);

      ideiasData.forEach((ideia) => {
        const ideiaDate = new Date(ideia.Data);
        if (
          ideiaDate.getMonth() === selectedDate.getMonth() &&
          ideiaDate.getFullYear() === selectedDate.getFullYear()
        ) {
          const dayOfMonth = ideiaDate.getDate();
          totalIdeiasByDay[dayOfMonth - 1] += 1;
        }
      });

      const newChartDataIdeia = {
        labels: labels,
        datasets: [
          {
            label: "Ideias",
            data: totalIdeiasByDay,
            fill: true,
            borderColor: "rgba(192, 75, 192, 1)",
            tension: 0.4,
            borderJoinStyle: "round",
          },
        ],
      };

      setChartDataIdeia(newChartDataIdeia);


      const oportunidadesData = Oportunidade;

      // Process the data to get the total opportunities for each day in the current month
      const totalOportunidadesByDay = new Array(daysInMonth).fill(0);

      oportunidadesData.forEach((oportunidade) => {
        const oportunidadeDate = new Date(oportunidade.DataHoraCriacao);
        if (
          oportunidadeDate.getMonth() === selectedDate.getMonth() &&
          oportunidadeDate.getFullYear() === selectedDate.getFullYear()
        ) {
          const dayOfMonth = oportunidadeDate.getDate();
          totalOportunidadesByDay[dayOfMonth - 1] += 1;
        }
      });

      const newChartDataOportunidade = {
        labels: labels,
        datasets: [
          {
            label: "Oportunidades",
            data: totalOportunidadesByDay,
            fill: true,
            borderColor: "rgba(192, 75, 192, 1)",
            tension: 0.4,
            borderJoinStyle: "round",
          },
        ],
      };

      setChartOportunidade(newChartDataOportunidade);

      const totalCandidaturasByStage = {
        Aceite: 0,
        Análise: 0,
        Entrevista: 0,
        Rejeitada: 0,
      };
      
      Candidatura.forEach((candidatura) => {
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
  if(dataLoaded)
  fetchData();
}, [currentMonth,dataLoaded, Candidatura, Ideia, Oportunidade, Usuario]);


  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => prevMonth - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => prevMonth + 1);
  };

  return (
    <div className="container mt-6 mb-4">
      
      <h1 className="col-md-3 mb-5 text-start">Reporting</h1> 
      <div className="col-md-12 mt-5">
            <h5>
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 1 ? 'active' : ''}`}
                    onClick={() => setActiveTab(1)}
                    href="#"
                  >
                    Candidaturas/Entrevistas
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 2 ? 'active' : ''}`}
                    onClick={() => setActiveTab(2)}
                    href="#"
                  >
                   Ideias
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 3 ? 'active' : ''}`}
                    onClick={() => setActiveTab(3)}
                    href="#"
                  >
                    Oportunidades
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 4 ? 'active' : ''}`}
                    onClick={() => setActiveTab(4)}
                    href="#"
                  >
                    Utilizadores
                  </a>
                </li>
              </ul> 
            </h5>
          <div className="month-navigation mt-5" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={handlePrevMonth}><Icon.CaretLeftFill/></button>
            <h3 className='mx-2'>{new Date(new Date().getFullYear(), currentMonth, 1).toLocaleString("pt", { month: "long", year: "numeric" })}</h3>
            <button className="btn btn-primary"  onClick={handleNextMonth}><Icon.CaretRightFill/></button>
          </div>
          </div>
      <div className="row">
        <div className="col-12">
        {activeTab === 1 ?
            <>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <GraficoLinhas chartData={chartDataCandidatura} Nome={"Candidaturas"} />
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                  <GraficoPizza chartData={chartPizzaDataCandidatura} Nome={"Estado das candidaturas"} ></GraficoPizza>
                </div>
                <div className="col-md-6 align-items-center justify-content-center">
                  <GraficoBarras chartData={chartDataCandidaturaPorVaga} Nome={"Candidaturas por Vaga"} ></GraficoBarras>
                </div>
              </div>
            </>
              : activeTab === 2 ?
              <>
              <div className="col-10 offset-1">
                <GraficoLinhas chartData={chartDataIdeia} Nome={"Ideias"} />
              </div>
              </>   
              : activeTab === 3 ? 
              <>
              <div className="col-10 offset-1">
              <GraficoLinhas chartData={chartDataOportunidade} Nome={"Oportunidades"} />
              </div>
              </>
              : activeTab === 4 ? 
              <>
              <div className="col-10 offset-1">
              <GraficoLinhas chartData={chartDataUsuario} Nome="Utilizadores Registados" />
              </div>
              </>
              :null
              }
          
        </div>
      </div>
    </div>
    
  );
}

export { Reporting };
