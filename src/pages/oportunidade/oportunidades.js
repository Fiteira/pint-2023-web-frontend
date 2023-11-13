import "./style.css"
import { Draggable } from "react-beautiful-dnd"
import { useHistory } from 'react-router-dom';
import React from "react";

const Oportunidade = (props) =>{

    const {card,index} = props
    const history = useHistory();
    const handleCardClick = () => {
        const idOportunidade =  card.idOportunidade;
        history.push(`/oportunidades/${idOportunidade}`)
    };
    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
        const year = date.getFullYear();
      
        return `${day}/${month}/${year}`;
      }
     console.log(card);
    return(
        <>
         <Draggable draggableId={String(card.idOportunidade)} index={index}>
            {provided=>(
            <div className="shadow1">
                 <li className="card-item mt-2 text-start" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={handleCardClick}>
                    <div className="d-flex justify-content-between">
                        <b className="col-10">{card.nomeOportunidade}</b>
                        {card.Cargo === 1 ?  (<span className="col-2" style={{ backgroundColor: 'blue', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
                        ):(<span style={{ backgroundColor: 'green', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>)}
                        
                    </div>
                    
                    <div className="d-flex justify-content-between">
                        <span className="text-start">
                            {card.NomeCliente} 
                        </span>
                        <span className="text-end">
                           {formatDate(new Date(card.Data))}
                        </span>
                    </div>    
                </li>
            </div>
           
           )}
         </Draggable>
        </>

    )
}
export default Oportunidade;