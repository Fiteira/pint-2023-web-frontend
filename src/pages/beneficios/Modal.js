import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const ModalBeneficios = ({ show, onHide, nome, subtitulo, descricao }) => {

  
    return (
        <Modal show={show} onHide={onHide} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{nome} <br/> <h5>{subtitulo}</h5> </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' ,whiteSpace: 'pre-wrap'}}>{descricao}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Fechar <Icon.XLg/>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  export default ModalBeneficios;