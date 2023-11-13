import "./style.css";
import { Offcanvas} from "react-bootstrap";
import Calendario from "../../components/calendario/calendario";

const CriarReuniaoOportunidade = ({ show, onHide, oportunidade }) => {

  return (
    <Offcanvas show={show} onHide={onHide} placement="start" style={{ width: "50%" }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Oportunidade: {oportunidade.Titulo} <br/> cliente: {oportunidade.NomeCliente}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h3>Escolha um dia e um intervalo de hora:</h3>
        <div className="col-12">
          <Calendario tipo={1} noportunidade={oportunidade.NOportunidade} />
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export { CriarReuniaoOportunidade };