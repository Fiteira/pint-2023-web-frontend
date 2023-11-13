import React from 'react';
import minLogo from '../../assets/min-logo-softinsa.png';
import './style.css'
import { PersonFill } from 'react-bootstrap-icons';
function HeaderSemLogin (){
  
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
            <li className='nav-item'>
              <a className='nav-link text-light' href='/beneficios'>Benefícios</a>
            </li>
          </ul>
        </div>
        <div className="btn-group" role="group">
        <a href="/login" className="mx-2 text-light text-decoration-none d-flex align-items-center">

  <span className="h6 m-0">Iniciar sessão</span>
  <PersonFill className="mr-2" style={{ fontSize: '1.5rem' }} />
</a>
        </div>
      </div>  
    </nav>
    );
}

export default HeaderSemLogin;

