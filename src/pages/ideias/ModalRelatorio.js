import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import api from '../../services/api';

const ModalRelatorio = ({ show, onHide, nideia }) => {
  const [relatorioAdm, setRelatorioAdm] = useState('');
  const [relatorioAutor, setRelatorioAutor] = useState('');

  const [notificarParticipantes, setNotificarParticipantes] = useState(false);

  const history = useHistory();

  const handleAceitar = async () => {

    if(notificarParticipantes){
      try {
        const data = {
          ApontamentosAdm: relatorioAdm,
          ApontamentosAutor: relatorioAutor,
          Tipo: 1,
          DataHora: new Date().toISOString(),
          NIdeia: nideia
        };
  
        await api.put(`/api/ideias/${nideia}`, { Estado: "Aceite" });
        await api.post('/api/relatorioideia', data);
        onHide();
  
        history.push("/ideias"); 
      } catch (error) {
        console.error(error);
      }
    }else{

      try {
        const data = {
          ApontamentosAdm: '',
          ApontamentosAutor: relatorioAutor,
          Tipo: 1,
          DataHora: new Date().toISOString(),
          NIdeia: nideia
        };
  
        await api.put(`/api/ideias/${nideia}`, { Estado: "Aceite" });
        await api.post('/api/relatorioideia', data);
        onHide();
  
        history.push("/ideias"); 
      } catch (error) {
        console.error(error);
      }

      
      
    }

    
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Notifique o Administrador e o Autor que a ideia foi Aceite</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="notificarParticipantes"
            checked={notificarParticipantes}
            onChange={() => setNotificarParticipantes(!notificarParticipantes)}
          />
          <label className="form-check-label" htmlFor="notificarParticipantes">
            Notificar a Administração
          </label>
        </div>
        { notificarParticipantes ? ( 
        <Form.Group controlId="RelatorioAdm">
          <Form.Label>Relatório para o Administrador</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            style={{height: '300px'}}
            placeholder="Informe o administrador"
            value={relatorioAdm}
            onChange={(e) => setRelatorioAdm(e.target.value)}
          />
        </Form.Group>
        ):null}
       
        <Form.Group controlId="RelatorioAutor">
          <Form.Label>Relatório para o autor</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            style={{height: '300px'}}
            placeholder="Informe o autor"
            value={relatorioAutor}
            onChange={(e) => setRelatorioAutor(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={handleAceitar}>
          Enviar <Icon.SendFill/>
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Fechar <Icon.XLg/>
        </Button>
        
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRelatorio;
