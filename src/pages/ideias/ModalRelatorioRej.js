import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import api from '../../services/api';

const ModalRelatorioRej = ({ show, onHide, nideia }) => {
  const [relatorioAutor, setRelatorioAutor] = useState('');

  const history = useHistory();

  const handleRejeitar = async () => {
    try {
      const data = {
        ApontamentosAutor: relatorioAutor,
        Tipo: 0,
        DataHora: new Date().toISOString(),
        NIdeia: nideia
      };

      await api.put(`/api/ideias/${nideia}`, { Estado: "Rejeitada" });
      await api.post('/api/relatorioideia', data);
      onHide();

      history.push("/ideias");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Notifique o Autor que a ideia foi Rejeitada</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="RelatorioAutor">
          <Form.Label>Relatório para o autor</Form.Label>
          <Form.Control
            as="textarea"
            style={{height: '300px'}}
            rows={5}
            placeholder="Informe o autor"
            value={relatorioAutor}
            onChange={(e) => setRelatorioAutor(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={handleRejeitar}>
          Enviar <Icon.SendFill/>
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Fechar <Icon.XLg/>
        </Button>
        
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRelatorioRej;
