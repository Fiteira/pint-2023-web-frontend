import React, { useState } from "react";
import Calendario from "../../components/calendario/calendario";


const ShowCalendario = () => {
  const events = useState([]);
  

  const cargo = localStorage.getItem('Cargo');

  return <div className="mt-6 container">
  <div className="row col-md-12 justify-content-center">
    <div className="col-md-7">
    {cargo === "1" ? (<Calendario events={events} i bloquearEventos={true} />) 
    : (<Calendario events={events} i tipo={2} />)}
      
    </div>
  </div>
</div>
};

export { ShowCalendario };
