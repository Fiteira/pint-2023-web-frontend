import React, { useState } from 'react';
import Alert  from '../../components/alerts/alerts';
import minLogo from '../../assets/min-logo-softinsa.png';
import './style.css'
import '../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'

function HeaderUtilizador() {

  const NomeUtilizador = localStorage.getItem('NomeUtilizador');
  const Foto = localStorage.getItem('Foto');
  
  const [showMensagem, setShowMensagem] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const logout = () =>{
    setShowMensagem(true);
    localStorage.clear();
    window.location.href = '/';
  }

    return (
      <nav className='navbar navbar-expand-lg p-3 mb-3 border-bottom navbar-primary bg-custom-primary fixed-top navbar-hidden'>
      <div className="container d-flex justify-content-between align-items-center">
        <a className="navbar-nav" href="/">
          <img src={minLogo} className="logo" alt='logoSoftinsa'/>
        </a>
        <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon'></span>
      </button>
        <div className='collapse navbar-collapse justify-content-center' id='navbarNav'>
          <ul className='navbar-nav text-light'>
            <li className='nav-item active'>
              <a className='nav-link text-light' href='/'>Página Inicial</a>
            </li>
            <li className="nav-item dropdown ">
                <a className='nav-link text-light' href='/vagas'>Vagas</a>
            </li>
            <li className="nav-item">
                <a className='nav-link text-light' href='/criarIdeia'>Ideias</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link text-light' href='/oportunidades'>Oportunidades</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link text-light' href='/beneficios'>Benefícios</a>
            </li>
          </ul>
        </div>
        <div className="btn-group">
          <div className='collapse navbar-collapse justify-content-end  text-light' id='navbarNav'>
            {NomeUtilizador} &nbsp;&nbsp;
          </div>
          <div className="dropdown text-end ">
            <div className="d-block text-light text-decoration-none dropdown-toggle show" data-bs-toggle="dropdown" role="button" aria-expanded="false">
              <img src={Foto} alt="mdo" width="32" height="32" className="rounded-circle"/>
            </div>
            <ul className="dropdown-menu text-small dropdown-menu-end " >
              <li><a className="dropdown-item" href="/calendario">Calendário</a></li>
              <li><a className="dropdown-item" href="/perfil">Perfil</a></li>
              <li><hr className="dropdown-divider"/></li>
              <li><a className="dropdown-item" onClick={() => setShowAlert(true)}>Sair</a></li>
            </ul>
          </div>
        </div> 
      </div>  
      <Alert
          show={showAlert}
          onHide={handleCloseAlert}
          nome="Terminar Sessão"
          textbody = "Pretende terminar a sua sessão?"
          click={logout}
          mensagem="Foi feito o logout com sucesso"
          enviadoComSucesso={showMensagem}
          />  
    </nav>
   
    );

}

export default HeaderUtilizador ;