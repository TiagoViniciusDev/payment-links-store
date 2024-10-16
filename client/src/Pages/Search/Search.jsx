import './Search.css';
import api from '../../api/api'

import ProdutoContainer from '../../Components/ProdutoContainer/ProdutoContainer';

import { useEffect, useState } from 'react';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function Search() {

  const {setLoading} = useContext(UserContext)

  const [searchResult, setSearchResult] = useState()
  const [url, setUrl] = useState(window.location.href)


  useEffect(() => { //Capturando url da página e suas mudanças:
    const handleUrlChange = () => {
      setUrl(window.location.href);
    };

    // Captura mudanças na URL com popstate e hashchange
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Caso você use pushState ou replaceState, sobrescreva-os como mostrado antes
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleUrlChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleUrlChange();
    };

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const urlParts = url.split('/');
  const decodeURL3 = decodeURIComponent(urlParts[3])

  useEffect(() => { //Caregando produtos
    searchProducts()
  },[url])

  async function searchProducts(){
    setLoading(true)

    try {
      let query = "/product/allProducts"
      if(decodeURL3.includes("?")){
        query = `/product/allProducts?${decodeURL3.split("?")[1]}`
      }
      const response = await api('GET', `${query}`);
      const backendMsg = await response.json();
      
      if(backendMsg.success == true){
          setSearchResult(backendMsg.Products)
      } else{
          setSearchResult()
          alert("Falha ao carregar seus produtos")
      }
    } catch (error) {
      alert("Falha ao carregar produtos")
      console.log(error)
    }

    setLoading(false)
  }

  return (
    <div className='Search'>
        <div className='container'>
          <div className='productsContainer'>
            {searchResult && searchResult.length > 0 ? searchResult.map((produto) => (
                <ProdutoContainer key={produto._id} productID={produto._id} nome={produto.name} desc={produto.desc} img={produto.imgs[0]} price={produto.price}/>
              )) : searchResult && searchResult.length == 0 ? <p>Não há produtos</p> : <p>Loading</p>}
          </div>
        </div>
    </div>
  );
}

export default Search;