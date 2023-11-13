import "./style.css"
import Oportunidade from "./oportunidades";
import { useState,useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Droppable } from "react-beautiful-dnd";
import api from '../../services/api';
import { useToast } from '../../components/toasts/toast';



import * as Icon from 'react-bootstrap-icons';

const Colunas = (props) =>{

    const {column,AtualizarLista,cargo}=props
    const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
    const [cards, setCards] = useState([]);
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(column.title);

    useEffect(() => {
    column.cards.sort((a,b)=>
    column.cardOrder.indexOf(a.idOportunidade) - column.cardOrder.indexOf(b.idOportunidade))
        setCards(column.cards)
    }, [column.cards,column.cardOrder]);


    const handleInputBlur = () => {

        if(inputValue === column.title)
        {
            setEditing(false);
            return;
        }else
        {

            api.put(`/api/estagios/${column.id}`, {

                Nome: inputValue
             }
              
            ).then(estagio => {

            }).catch(err => {
                console.log(err);
            })
        }

        setEditing(false);
    };


      const handleEliminarEstagio = () => {
        api.delete(`/api/estagios/${column.id}`)
        .then(estagio => {

            showSuccessToast("Coluna eliminada com sucesso!")
    
            AtualizarLista()
        }).catch(err => {
            showErrorToast("Esvazie a coluna antes de excluir")
        })
        console.log(column.id);
      };
    return(
        <>
            <Droppable droppableId={String(column.id)}>
                {(provided)=>(
                    <div {...provided.droppableProps} ref={provided.innerRef} className="column">
                        <div className="ignorarReadOnly">
                        <header style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                            type="text"
                            className={ `corDoInput ${(cargo === "0" &&  editing) || (cargo === "3" && editing) ? 'editing' : ''} ms-5`}
                            value={inputValue}
                            readOnly={cargo === "1" || cargo === "2" || cargo === "4" || cargo === "5" || !editing}
                            onClick={() => { setEditing(true);}}
                            onBlur={handleInputBlur}
                            onKeyDown={(event) => {if (event.key === 'Enter') {handleInputBlur();}}}
                            onChange={(event) => {setInputValue(event.target.value);}}
                            style={{ fontWeight: 'bold' }}
                            />
                            {cargo === "3" || cargo === "0" ? (
                            <Dropdown style={{ marginLeft: '8px' }}>
                             
                            <Dropdown.Toggle as={Icon.ThreeDots} id="dropdown-basic" />

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleEliminarEstagio}>Eliminar</Dropdown.Item>
                            </Dropdown.Menu>
                            </Dropdown>
                            ) : (null)}
                        </header>
                        </div>
                  
                    <ul className="card-list">
                        {cards && cards.length > 0 && cards.map((card,index)=>{
                            return(
                                <Oportunidade 
                                    key={card.idOportunidade}
                                    card={card}
                                    index={index}

                                />
                            )
                        })}
                    </ul>
                    <footer></footer>
                    {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </>

    )
}
export default Colunas;