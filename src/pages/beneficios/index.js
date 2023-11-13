import React, { useEffect, useState } from 'react';
import './style.css';
import * as Icon from 'react-bootstrap-icons';
import Card from '../beneficios/Card';
import api from '../../services/api';
import ModalCriarBeneficios from './ModalCriar';
import { Pagination } from 'react-bootstrap';

const BeneficiosPage = () => {
  var cargo = localStorage.getItem('Cargo');

  const [beneficios, setBeneficios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [atualizarLista, setAtualizarLista] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4;

  const atualizar = () => {
    setAtualizarLista(atualizarLista + 1);
  };

  const handleCloseModal = () => {
    atualizar();
    setShowModal(false);
  };

  useEffect(() => {
    api.get('/api/beneficios').then((response) => setBeneficios(response.data.message));
  }, [atualizarLista]);

  // Paginação
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = beneficios.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(beneficios.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-6">
      <div className="row row-md-12 mb-3 text-start">
        <div className="col-md-2">
          <h1>Benefícios</h1>
        </div>
        <div className="col-md-8"></div>
        <div className="col-md-2">
          {cargo === '0' ? (
            <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
              Criar Benefício&nbsp;
              <Icon.PlusLg />
            </button>
          ) : null}
        </div>
      </div>
      <div className="row position-relative justify-content-center">
        {currentCards.map((beneficio) => (
          <Card key={beneficio.NBeneficio} beneficio={beneficio} cargo={cargo} AtualizarLista={atualizar} />
        ))}
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
      <ModalCriarBeneficios show={showModal} onHide={handleCloseModal} />
    </div>
  );
};

export { BeneficiosPage };