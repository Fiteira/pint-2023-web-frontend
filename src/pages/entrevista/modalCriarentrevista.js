import "./style.css";
import { Offcanvas} from "react-bootstrap";
import Calendario from "../../components/calendario/calendario";

const CriarEntrevista = ({ show, onHide, candidatura }) => {
  return (
    <Offcanvas show={show} onHide={onHide} placement="start" style={{ width: "50%" }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{candidatura.NomeUsuario} para {candidatura.NomeVaga}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h3>Escolha um dia e um intervalo de hora:</h3>
        <div className="col-12">
          <Calendario tipo={0} candidatura={candidatura} />
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export { CriarEntrevista };