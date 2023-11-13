import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import ModalRelatorio from "./ModalRelatorio";
import ModalRelatorioRej from "./ModalRelatorioRej";
import { useHistory } from "react-router-dom";
import * as Icon from 'react-bootstrap-icons';
import "./style.css";

function Ideia() {
  const { nideia } = useParams();
  const [ideia, setIdeia] = useState(null);
  const [topicos, setTopicos] = useState([]);
  const [showModalRelatorio, setshowModalRelatorio] = useState(false);
  const [showModalRelatorioRej, setshowModalRelatorioRej] = useState(false);
  const [relatorioIdeia, setRelatorioIdeia] = useState(null);

  const history = useHistory();

  const handleArquivar = async () => {
    try {
      await api.put(`/api/ideias/${nideia}`, { Estado: "Arquivada" });
      setIdeia((prevIdeia) => ({ ...prevIdeia, Estado: "Arquivada" }));
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleCloseModal = () => {
    setshowModalRelatorio(false);
  };
  
  const handleCloseModalRej = () => {
    setshowModalRelatorioRej(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/api/ideias/${nideia}`);
        if (response.data.message === false) {
          setIdeia(null);
        } else {
          setIdeia(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [nideia]);

  useEffect(() => {
    async function fetchTopicos() {
      try {
        const response = await api.get(`/api/topicosdasideias?nideia=${nideia}`);
        if (response.data.message === false) {
          setTopicos(null);
        } else {
          const topicoData = response.data.message;
          const response2 = await Promise.all(topicoData.map(async (data) => {
            const response2Item = await api.get(`/api/topicoideias/${data.NTopicoIdeia}`);
            return response2Item.data.message;
          }));
          setTopicos(response2);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchTopicos();
  }, [ideia, nideia]);

  useEffect(() => {
    async function fetchRelatorioIdeia() {
      try {
        const response = await api.get(`/api/relatorioideia?NIdeia=${nideia}`);
        if (response.data.message === false) {
          setRelatorioIdeia(null);
        } else {
          const relatorios = response.data.message;
          const relatorioAceito = relatorios.find(relatorio => relatorio.NIdeia === parseInt(nideia) && relatorio.Tipo === 1);
          if (relatorioAceito) {
            setRelatorioIdeia(relatorioAceito);
          } else {
            setRelatorioIdeia(null);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  
    if (ideia && ideia.Estado === "Aceite") {
      fetchRelatorioIdeia();
    }
  }, [nideia, ideia]);
  
  return (
    <>
      {!ideia && !topicos.NTopicoIdeia ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border mx-auto my-auto" style={{ width: '3rem', height: '3rem' }} role="status" />
        </div>
      ) : (
        <div className="container mt-6">
          <div className="row"> 
          <div className="col-md-4 mt-5 text-start">
            <div className="card">
              <h3 className="card-header">{ideia.Titulo}</h3>
              <div className="card-body">
                <h5 className="card-title">{ideia.NomeUsuario}</h5>
                <p className="card-text">{new Date(ideia.Data).toLocaleDateString()}</p>

                <h5>Tópicos</h5>
                {topicos.map((topico) => (
                  <p key={topico.NTopicoIdeia}>{topico.NomeTopico}</p>
                ))}
                {ideia.Estado !== "Aceite" && (
                  <div className="d-flex justify-content-end">
                    <div className="" role="group" aria-label="Exemplo de grupo de botões">
                      {ideia.Estado !== "Rejeitada" && (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={(event) => { setshowModalRelatorio(true) }}
                          >
                            Aceitar
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary mx-1"
                            onClick={(event) => { setshowModalRelatorioRej(true) }}
                          >
                            Rejeitar
                          </button>
                        </>
                      )}
                      {ideia.Estado !== "Rejeitada" && ideia.Estado !== "Arquivada" && (
                        <button type="button" className="btn btn-secondary mx-0" onClick={handleArquivar}>
                          Arquivar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-8">
            <div className="btn-group d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-info"
                style={{ marginTop: '110%' }}
                onClick={() => history.push('/ideias')}
              >
                <Icon.ChevronLeft/>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '110%' }}
                onClick={() => history.push('/ideias')}
              >
                Voltar para as ideias
              </button>
            </div> 
          </div>
          </div>
          <div className="col-md-8 mt-5 text-start">
            <h4 id="">{ideia.Titulo}</h4>
            <p>{ideia.Descricao}</p>
            {ideia.Estado === "Aceite" && relatorioIdeia && (
              <div>
                <br/><br/><br/>
                <h5>Relatório para o Administrador:</h5>
                {relatorioIdeia.ApontamentosAdm ? (<p>{relatorioIdeia.ApontamentosAdm}</p>)
                :
                (<p>Não existem nenhum relatório da administração</p>)}
                
              </div>
            )}
          </div>
          </div>
          <ModalRelatorio
            show={showModalRelatorio}
            onHide={handleCloseModal}
            nideia={nideia}
          />
          <ModalRelatorioRej
            show={showModalRelatorioRej}
            onHide={handleCloseModalRej}
            nideia={nideia}
          />
        </div>
      )}
    </>
  );
}

export { Ideia };