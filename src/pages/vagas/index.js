import api from '../../services/api';
import './style.css'

import Card from '../vagas/Card';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Pagination } from 'react-bootstrap'; 
import * as Icon from 'react-bootstrap-icons';

function Vagas( {cargo} ) {
  const [vagas, setVagas] = useState([]);
  const [optionsLocalidade, setOptionsLocalidade] = useState([]);

  const [selectedValueLocalidade, setSelectedValueLocalidade] = useState('');

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [atualizarLista, setAtualizarLista] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4;


  const atualizar = () =>{
    setAtualizarLista(atualizarLista + 1);
  }



  useEffect(() => {
      async function fetchVagas() {
        let params = {};
        let response;

        if (cargo === 1 || cargo === null) {
          params.estado = 1;
          params.tipovaga= 1;

          response = await api.get('api/vagas',{params});  
          
        }else if(cargo === 2 || cargo === 3 || cargo === 4) {
          params.estado = 1;
          response = await api.get('api/vagas',{params});  
        }else
        {
          response = await api.get('api/vagas');  
        }
      
      var localidade = parseInt(selectedValueLocalidade)

      
      if(!selectedValueLocalidade){
        const vagas = response.data.message;
        setVagas(vagas);
        setIsLoading(false); 
      }else
      {
        const vagas = response.data.message.filter((vaga) => vaga.NLocalidade === localidade);
        setVagas(vagas);
        setIsLoading(false);
      }
      
    }
    fetchVagas();
  }, [cargo,selectedValueLocalidade,atualizarLista]);


  
  useEffect(() => {
    async function fetchData() {
      const response = await api.get('/api/localidades');
      const data = response.data.message;
      setOptionsLocalidade(data);
    }
    fetchData();
  }, []);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = vagas.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(vagas.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
        </div>
      ) :(
      <div className="container mt-6">
        <div className="row mb-3">
            <div className="col-md-2 offset-1 text-start"><h1 >Vagas </h1></div>

            <div className={cargo === 0 || cargo === 5 ? "col-md-2 offset-4 d-flex align-items-center justify-content-center" : "col-md-2 offset-6 d-flex align-items-center justify-content-center"}>
            <select value={selectedValueLocalidade} className="form-select" onChange={(event) => setSelectedValueLocalidade(event.target.value)}>
              <option value="">Localização</option>
              {optionsLocalidade.map((option) => (
              <option key={option.NLocalidade} value={option.NLocalidade}>
                  {option.Localidade}
              </option>
              ))}
            </select> 
            </div> 

            {cargo === 0 || cargo === 5 ? (          
                <div className="col-md-2 d-flex justify-content-end">
                  <button type="button" className="btn btn-primary m-2" onClick={() => history.push('/criarVaga')} >Criar Vaga&nbsp;<Icon.PlusLg/></button>
                </div>
              ) : null}
            
        </div>
        <div className="row mb-5">
          <div className="col-md-6 mb-4 offset-1 text-start"> 
              Veja todas as oportunidades disponíveis para poder trabalhar na nossa empresa!
          </div>
        </div>
        
        <div className="row position-relative justify-content-center">
        {currentCards.length > 0 ? (
            currentCards.map((vaga) => (
              <Card
                key={vaga.NVaga}
                vaga={vaga}
                cargo={cargo}
                AtualizarLista={atualizar}
              />
            ))
          ) : (
            <p>Não existem vagas na localidade selecionada.</p>
          )}
        </div>
        <div className="d-flex justify-content-center mt-4">
        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>)}            
 
  </>
    
    
  );
}

export { Vagas };