import './Footer.css';

function Footer() {
  return (
    <div className='Footer'>
        <div className='container'>
            <div className='logo'>
                <h2>Payments <span>Links Store</span></h2>
                <p>Loja online para venda de produtos, sem cobrança de taxas e sem anúncios. Oferecemos uma experiência de compra transparente e focada apenas no que importa: os produtos que você deseja.</p>
            </div>
            <div className='footerLinks'>
              <div className='links contentStyle'>
                <h3>Navegar</h3>
                <a href="/">Home</a>
                <a href="/categorias">Categorias</a>
                <a href="/contato">Contato</a>
              </div>
              <div className='contact contentStyle'>
                  <h3>Contato</h3>
                  <a href="">Email</a>
                  <a href="">GitHub</a>
                  <a href="">Whatsapp</a>
              </div>
              {/* <div className='sobre contentStyle'>
                  <h3>Sobre</h3>
                  <a href="">Politica de venda</a>
                  <a href="">Como funciona ?</a>
              </div> */}
            </div>
        </div>
    </div>
  );
}

export default Footer;