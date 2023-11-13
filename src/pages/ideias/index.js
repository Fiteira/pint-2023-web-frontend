import api from '../../services/api';
import './style.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';

function Ideias() {
  const [ideias, setIdeias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('recentes');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;
  const history = useHistory();

  useEffect(() => {
    async function fetchIdeias() {
      const response = await api.get('api/ideias');
      setIdeias(response.data.message);
      setIsLoading(false);
    }

    fetchIdeias();
  }, []);

  const estados = [...new Set(ideias.map((ideia) => ideia.Estado))];

  const sortedIdeias = [...ideias].sort((a, b) => {
    const dateA = new Date(a.Data);
    const dateB = new Date(b.Data);

    if (selectedOrder === 'recentes') {
      return dateB - dateA;
    } else if (selectedOrder === 'antigas') {
      return dateA - dateB;
    }

    return 0;
  });

  const filteredIdeias = sortedIdeias.filter((ideia) => {
    if (selectedEstado === '') {
      return true;
    } else {
      return ideia.Estado === selectedEstado;
    }
  });

  // Paginação
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentIdeias = filteredIdeias.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredIdeias.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
        </div>
      ) : (
        <div className="container mt-6">
          <div className="row-md-12 row p-3">
            <div className="col-md-2 text-start"><h1>Ideias</h1></div>
            <div className="col-md-6"></div>
            <div className="col-md-4">
              <div className="d-flex">
                <select value={selectedEstado} className="form-select me-2" onChange={(event) => setSelectedEstado(event.target.value)}>
                  <option value="">Estado</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
                <select value={selectedOrder} className="form-select" onChange={(event) => setSelectedOrder(event.target.value)}>
                  <option value="recentes">Mais recentes</option>
                  <option value="antigas">Mais antigas</option>
                </select>
              </div>
            </div>
          </div>
          <table className="table table-striped w-100 mx-auto table-bordered">
            <thead>
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Autor</th>
                <th scope="col">Data</th>
                <th scope="col">Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentIdeias.map((ideia) => (
                <tr key={ideia.NIdeia}>
                  <td>{ideia.Titulo}</td>
                  <td>{ideia.NomeUsuario}</td>
                  <td>{new Date(ideia.Data).toLocaleDateString()}</td>
                  <td>{ideia.Estado}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary transparent-btn"
                      onClick={() => history.push(`/ideias/${ideia.NIdeia}`)}
                    >
                      Mostrar mais
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        </div>
      )}
    </>
  );
}

export { Ideias };
