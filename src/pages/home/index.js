import React, {useEffect, useState} from "react";
import logoSoftinsa from "../../assets/logo-softinsa-branco.png";
import fundo from "../../assets/fundo.jpg";
import vagas from "../../assets/vagas.jpeg";
import oportunidades from "../../assets/oportunidades.jpeg";
import ideias from "../../assets/ideias.jpg";
import beneficios from "../../assets/beneficios.jpg";
import { Link, useHistory } from "react-router-dom";
import $ from 'jquery'; // Importe o jQuery
import { Helmet } from "react-helmet";
import "./style.css";





const HomePage = () => {


  const history = useHistory();
  useEffect(() => {
    const carouselWidth = $(".carousel-inner")[0].scrollWidth;
    const cardWidth = $(".carousel-item").width();
    let scrollPosition = 0;

    const moveCarouselNext = () => {
      if (scrollPosition < carouselWidth - cardWidth * 4) {
        scrollPosition += cardWidth;
      } else {
        scrollPosition = 0;
      }
      $("#carouselExampleControls .carousel-inner").animate(
        { scrollLeft: scrollPosition },
        600
      );
    };

    const moveCarouselPrev = () => {
      if (scrollPosition > 0) {
        scrollPosition -= cardWidth;
      } else {
        scrollPosition = carouselWidth - cardWidth * 4;
      }
      $("#carouselExampleControls .carousel-inner").animate(
        { scrollLeft: scrollPosition },
        600
      );
    };

    // Movimento automático após 5 segundos
    const interval = setInterval(moveCarouselNext, 5000);

    $("#carouselExampleControls .carousel-control-next").on("click", function () {
      moveCarouselNext();
      clearInterval(interval); // Reinicia o intervalo após o clique
    });

    $("#carouselExampleControls .carousel-control-prev").on("click", function () {
      moveCarouselPrev();
      clearInterval(interval); // Reinicia o intervalo após o clique
    });

    // Limpa o intervalo quando o componente é desmontado
    return () => {
      clearInterval(interval);
    };
  }, []);

  const [validacao, setValidacao] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      setValidacao(true);
    } else {
      setValidacao(false);
    }
  }, []);



  return (
    <div className="mt-5">
      <div
        className="row"
        id="fundo"
        style={{ backgroundImage: `url(${fundo})`, backgroundSize: 'cover' }}
      >
        <div className="col-md-6">
          <img src={logoSoftinsa} alt="logoSoftinsa" id="logoSoftinsa" className="w-50" />
        </div>
        <div className="col-md-6 px-5 text-light">
          <h1 className="mb-4">Bem-vindo à Softinsa</h1>
          <p className="mb-4">
           A Softinsa, uma subsidiária da IBM, é especialista em serviços de consultoria, gestão e desenvolvimento de aplicações. Com 25 anos de história e experiência no mercado português, conta atualmente com uma equipa de mais de 700 profissionais, distribuídos por Lisboa, pelos Centros de Inovação de Tomar, Viseu, Fundão, Portalegre e Vila Real
          </p>
          {validacao ? (
          <>
          <Link to="/login" className="btn btn-primary me-3">
            Iniciar sessão
          </Link>
          <Link to="/registar" className="btn btn-secondary">
            Registrar
          </Link>
          </>):null
          }
          
        </div>
      </div>

      <div className="mt-5">
        <div>
        <Helmet>
          {/* Include jQuery */}
          <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          {/* Include Bootstrap jQuery plugins */}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.5.0/js/bootstrap.bundle.min.js"></script>
        </Helmet>
        
        {/* Carousel */}
        <div id="custom-carousel">
        <div id="carouselExampleControls" className="carousel" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="card card-custom mb-3 mx-2 shadow-lg" onClick={() => (history.push("/vagas"))}>
                <img src={vagas} className="card-img-top image-fluid" alt="Imagem 1" />
                <div className="card-body">
                  <h5 className="card-title">Vagas</h5>
                  <p className="card-text">Descubra oportunidades de carreira emocionantes disponíveis.</p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card card-custom mb-3 mx-2 shadow-lg" onClick={() => (history.push("/beneficios") )}>
                <img src={beneficios} className="card-img-top image-fluid" alt="Imagem 2" />
                <div className="card-body">
                  <h5 className="card-title">Benefícios</h5>
                  <p className="card-text">Explore os benefícios exclusivos oferecidos.</p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card card-custom mb-3 mx-2 shadow-lg" onClick={() => validacao ? history.push('/login') :(history.push("/criarIdeia"))}>
              
                <img src={ideias} className="card-img-top image-fluid" alt="Imagem 3" />
                <div className="card-body">
                  <h5 className="card-title">Ideias</h5>
                  <p className="card-text">Compartilhe suas ideias inovadoras e criativas.</p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card card-custom mb-3 mx-2 shadow-lg" onClick={() => validacao ? history.push('/login') : (history.push("/oportunidades"))}>
                <img src={oportunidades} className="card-img-top image-fluid" alt="Imagem 4" />
                <div className="card-body">
                  <h5 className="card-title">Oportunidades</h5>
                  <p className="card-text">
                    Crie e gerencie oportunidades de negócio, de forma fácil e dinâmica.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Carousel controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export { HomePage };
