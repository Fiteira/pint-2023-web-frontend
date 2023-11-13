import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { useToast } from "../../components/toasts/toast";
const Alert= ({ show, onHide, nome, textbody,click, mensagem, enviadoComSucesso}) =>{


  const {showSuccessToast} = useToast();  
    if(enviadoComSucesso === true)
    { 
        showSuccessToast(mensagem)
        onHide();
    };
    
    return (

    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
        {nome} 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {!textbody ? (<>Tem a certeza? </>) : textbody}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={click}>
          Sim <Icon.CheckLg/>
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Não <Icon.XLg/>
        </Button>
      </Modal.Footer>
    </Modal>
    
    )

    
}

export default Alert;