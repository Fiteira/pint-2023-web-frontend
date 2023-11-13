import React, { useState,useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../../services/api';

import * as Icon from 'react-bootstrap-icons';

const ModalContactos = ({ show, onHide,oportunidade}) => {
    
    const [empresa, setEmpresa] = useState([]);
    const [contactos, setContactos] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    
    const [editingContactoId, setEditingContactoId] = useState(null);
    const [atualizarLista, setAtualizarLista] = useState(1);

    useEffect(() => {
        if (oportunidade.NCliente) {
          async function fetchDataEmpresa() {
            const response = await api.get(`/api/clientes/${oportunidade.NCliente}`);
            const data = response.data.message;
            setEmpresa(data);
          }
      
          async function fetchContacatos() {
            const response = await api.get(`/api/contactos?ncliente=${oportunidade.NCliente}`);
            const data = response.data.message;
            setContactos(data);
          }
      
          fetchDataEmpresa();
          fetchContacatos();
        }
      }, [oportunidade.NCliente,atualizarLista]);
    

      const handleCancelar = () => {
        setMostrarFormulario(false);
        setEmail('');
        setTelefone('');
      };


      const handleSalvar = () => {
        
        if(editingContactoId)
        {   

            api.put(`/api/contactos/${editingContactoId}`,{
                Telefone:telefone,
                Email:email,
                NCliente:oportunidade.NCliente,

            }).then(contacto => {
                    setAtualizarLista(atualizarLista+1)
            }).catch(err => {
    
                console.log(err);
            
            })
            setEmail('');
            setTelefone('');
            setMostrarFormulario(false);
            setEditingContactoId(null);

        }else{

            api.post("/api/contactos", {

                Telefone:telefone,
                Email:email,
                NCliente:oportunidade.NCliente,
                
             }
              ).then(contacto => {
                    setAtualizarLista(atualizarLista+1)
            }).catch(err => {
    
                console.log(err);
            
            })
            setEmail('');
            setTelefone('');
            setMostrarFormulario(false);
        }
      };

    return (  
    <>
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
            <Modal.Title>Contactos da <i>{empresa.NomeEmp}</i></Modal.Title>
            </Modal.Header>

            <Modal.Body> 
                <div className="d-flex m-3 row">
                    <div className="float-start col-5">
                        Contacto Principal <br/><br/> 
                        <div style={{ whiteSpace: 'nowrap' }}>
                        <strong>Email:</strong> <a href={`mailto:${empresa.EmailEmp}`}>{empresa.EmailEmp}</a> <br/>
                        <strong>Telefone:</strong> {empresa.TelefoneEmp} <br/>
                        </div>
                    </div>
                    <div className="float-end col-7">
                    {mostrarFormulario || contactos.length === 0 ? (
                        <div>
                            <h4>Cria novo contacto</h4>
                            <div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            </div>
                            <div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Telefone"
                                value={telefone}
                                onChange={(event) => setTelefone(event.target.value)}
                            />
                            </div>
                            <br/>
                            <div className="float-end">
                            <button type="button" className="btn btn-primary" onClick={handleSalvar}>
                                Guardar <Icon.Save/>
                            </button>
                            &nbsp;
                            <button type="button" className="btn btn-outline-primary" onClick={handleCancelar}>
                                Cancelar <Icon.XLg/>
                            </button>
                            </div>
                        </div>
                        ) : (

                            <div>
                                
                    
                        <div className="d-flex m-2 row"> 
                            Lista de Contacto: <br/>
                        </div>
                        {contactos && contactos.length > 0 ? (<table className="table table-striped w-45  table-bordered">
                             <thead>
                                 <tr>
                                 <th scope="col">Telefone</th>
                                 <th scope="col">Email</th>
                                 <th scope="col">
                                     <button type="button" className="btn btn-primary" onClick={(event) => setMostrarFormulario(true)}>
                                         <Icon.Plus/>
                                     </button>
                                 </th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {contactos.map((contacto) => (
                                 <tr key={contacto.NContactos}>
                                     <td>{contacto.Telefone}</td>
                                     <td><a href={`mailto:${empresa.EmailEmp}`}>{contacto.Email}</a> </td>
                                     <td><button
                                         type="button"
                                         className="btn btn-outline-primary transparent-btn"
                                         onClick={() => {
                                            setMostrarFormulario(true);
                                            setEmail(contacto.Email);
                                            setTelefone(contacto.Telefone);
                                            setEditingContactoId(contacto.NContactos);
                                          }}
                                         >
                                         <Icon.Pencil/>
                                         </button>
                                 </td>
                                 </tr> 
                                 ))}
                             </tbody>
                         </table>): null}
                         </div>
                         )}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar <Icon.XLg/>
                </Button>
            </Modal.Footer>
    </Modal>
    

    </>
   
       
    );
  }
  
  export default ModalContactos;
