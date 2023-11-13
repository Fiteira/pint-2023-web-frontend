import './App.css';
import api from './services/api';
import React, { useEffect, useState,useCallback } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
//import PrivateRoute from './Route/privateRoute';
import HeaderSemLogin  from './components/header/headerVisitante';

import HeaderUtilizador  from './components/header/headerUtilizador';
import HeaderAdministrador  from './components/header/headerAdministrador';
import HeaderRH  from './components/header/headerRH';
import HeaderGestorIdeias from './components/header/headerGestorIdeias';
import HeaderGestorVendas from './components/header/headerGestorVendas';

import PrivateRoute from './Route/privateRoute';

import { HomePage  } from './pages/home';
import  LoginPage    from './pages/login/index';
import { RegistoPage } from './pages/registar/index'
import { InserirPass } from './pages/registar/inserirPass'
import { RecuperarPass } from './pages/registar/recuperarPass'
import { ValidarEmail } from './pages/registar/validaremail'
import { BeneficiosPage } from './pages/beneficios/index'
import { Vagas } from './pages/vagas/index'
import { Vaga } from './pages/vagas/vaga.js'
import { Ideias } from './pages/ideias/index'
import { Ideia } from './pages/ideias/ideia'
import { CriarIdeia } from './pages/ideias/criarIdeia'
import { CriarVaga } from './pages/vagas/criarVaga'
import { EditarVaga } from './pages/vagas/editarVaga'
import { ProfilePage } from './pages/perfil/index'
import { Dashboard } from './pages/candidaturas/dashboard'
import { Candidatura } from './pages/candidaturas/vercandidatura';
import { Usuarios } from './pages/usuarios/index';
import { Usuario } from './pages/usuarios/usuario.js';
import { CriarUsuario } from './pages/usuarios/criarusuario.js';
import { Entrevista } from './pages/entrevista/entrevista';
import { Oportunidade } from './pages/oportunidade';
import { ShowCalendario } from './pages/calendario/index';
import { PageOportunidade } from './pages/oportunidade/pageOportunidade';
import { Reporting } from './pages/reporting';

import {isMobile} from 'react-device-detect';

function App() {

  const [header, setHeader] = useState(<HeaderSemLogin/>);
  const [carregando, setCarregando] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [cargo, setCargo] = useState(null);
 //teste
const handleModalClose = () => {
  setShowModal(false);
};
  const verificarAutenticacao = useCallback( async () => {

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/api/checktoken');  
         
        const cargo = response.data.message.NCargo;
       // console.log(cargo);

       setCargo(cargo);

        // 0 administrador
        // 1 utilizador externo
        // 2 utilizador interno
        // 3 gestor de vendas (oportunidades)
        // 4 gestor de ideias
        // 5 RH

        const headersPorCargo = {
          0: <HeaderAdministrador />,   
          1: <HeaderUtilizador />,      
          2: <HeaderUtilizador />,     
          3: <HeaderGestorVendas />,      
          4: <HeaderGestorIdeias />, 
          5: <HeaderRH />,     
          default: <HeaderSemLogin />,
        };

        const header = headersPorCargo[cargo] || headersPorCargo.default;

        setHeader(header);

       // console.log(response.data.message);

        localStorage.setItem('NomeUtilizador', response.data.message.Nome);
        localStorage.setItem('IDUtilizador', response.data.message.NUsuario);
        localStorage.setItem('Foto', response.data.message.Foto);
        localStorage.setItem('Cargo', response.data.message.NCargo);
        
        if (!isAuthenticated) {
          setIsAuthenticated(true);
        }
        
      } catch (error) {

        console.log(error);
        setHeader(<HeaderSemLogin />);
        if (isAuthenticated) {
          setIsAuthenticated(false);
        }

        localStorage.clear();

      }
    } else {
      setHeader(<HeaderSemLogin />);
      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
    }

    setCarregando(false);
  }, [isAuthenticated]);

  var token = localStorage.getItem('token');
  var IDUtilizador = localStorage.getItem('IDUtilizador');
  

  useEffect(() => {
    verificarAutenticacao();
  }, [token,IDUtilizador,verificarAutenticacao]);


  return (
    <>
    {carregando ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
        </div>
      ) :(
      <div className="App" >
      {isMobile && (
  <Modal show={showModal} onHide={handleModalClose}>
  <Modal.Header closeButton>
    <Modal.Title>Aplicação Mobile</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <p>
  Bem-vindo ao nosso site! Baixe nossa aplicação neste{" "}
  <a href="https://onedrive.live.com/download?resid=40AA262652400D9A%21219840&authkey=!AEqT-rijHkQzBSg">link</a> 
  {" "}para uma experiência mobile incrível. Acesso rápido, recursos exclusivos. Aproveite ao máximo!
</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleModalClose}>
      Ok
    </Button>
  </Modal.Footer>
</Modal>
)}
      {carregando ? <div></div> : header}
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          
          <Route path="/login">
            <LoginPage verificarAutenticacao={verificarAutenticacao} />
          </Route>
          <Route path="/inserirpass" component={InserirPass}/>
          <Route path="/recuperarpass" component={RecuperarPass}/>  
          <Route path="/registar" component={RegistoPage} verificarAutenticacao={verificarAutenticacao} />
          <Route path="/validaremail" component={ValidarEmail}/>

          <Route path="/beneficios" component={BeneficiosPage}/>
            
          <Route path="/vagas/:nvaga" component={Vaga} /> 
          <Route path="/vagas" >
            <Vagas cargo={cargo} />  
          </Route> 

          <PrivateRoute path="/criarVaga" isAuthenticated={isAuthenticated} component={CriarVaga} />
          <PrivateRoute path="/vagaseditar/:nvaga" isAuthenticated={isAuthenticated} component={EditarVaga}/>

          <PrivateRoute path="/ideias/:nideia" isAuthenticated={isAuthenticated} component={Ideia} />
          <Route path="/criarIdeia" component={CriarIdeia}/>
          <PrivateRoute path="/ideias" isAuthenticated={isAuthenticated} component={Ideias} />

          <PrivateRoute path="/candidaturas/:ncand" isAuthenticated={isAuthenticated} component={ Candidatura }/>
          <PrivateRoute path="/dashboard" isAuthenticated={isAuthenticated} component={Dashboard}/>
          
          <PrivateRoute path="/utilizadores/:nuser" isAuthenticated={isAuthenticated} component={Usuario}/>
          <PrivateRoute path="/utilizadores" isAuthenticated={isAuthenticated} component={Usuarios}/>
          <PrivateRoute path="/criarutilizador" isAuthenticated={isAuthenticated} component={CriarUsuario}/> 


          <PrivateRoute path="/entrevistas/:nentre" isAuthenticated={isAuthenticated} component={Entrevista}/>  
          
          <PrivateRoute path="/perfil" isAuthenticated={isAuthenticated} component={ProfilePage}/>
          <PrivateRoute path="/calendario" isAuthenticated={isAuthenticated} component={ShowCalendario}/>

          <PrivateRoute path="/oportunidades/:nOportunidade" isAuthenticated={isAuthenticated} component={PageOportunidade} /> 
          <PrivateRoute path="/oportunidades" isAuthenticated={isAuthenticated} component={Oportunidade} />

          <PrivateRoute path="/reporting" isAuthenticated={isAuthenticated} component={Reporting} /> 

        </Switch>
      </Router>
      </div>
    )}  
    </>
  );
}

export default App;
