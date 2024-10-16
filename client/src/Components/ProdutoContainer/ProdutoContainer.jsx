import './ProdutoContainer.css';
import { useNavigate } from 'react-router-dom';

function ProdutoContainer({productID, nome, desc, price, img}) {

  const navigate = useNavigate()

  function goProductPage(){
    navigate(`/produto/${productID}`)
  }

  function limitarTexto(texto, limite) { //Função que limita o texto sem cortar as palavras
    if (texto.length <= limite) {
        return texto;
    }
    
    let textoLimitado = texto.slice(0, limite + 1); // Pegue os caracteres até o limite + 1
    let ultimoEspaco = textoLimitado.lastIndexOf(' '); // Encontre o último espaço

    if (ultimoEspaco > 0) {
        return textoLimitado.slice(0, ultimoEspaco); // Retorne o texto até o último espaço
    }
    
    return texto.slice(0, limite); // Se não houver espaço, corte exatamente no limite
  }

  let textoLimitado = limitarTexto(desc, 110); //Número de caracteres
  let tituloLimitado = limitarTexto(nome, 70); //Número de caracteres

  return (
    <div className='ProdutoContainer' onClick={() => {goProductPage()}}>
        <div className='productHeader'>
          <div className='productImg' style={{backgroundImage: `url(${img})`}}></div>
          <p>{tituloLimitado}</p>
        </div>
        <div className='productFooter'>
          <p>{textoLimitado}</p>
          <h3 className='price'>R$ {price},00</h3>
        </div>
    </div>
  );
}

export default ProdutoContainer;