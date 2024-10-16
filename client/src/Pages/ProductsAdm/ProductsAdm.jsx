import './ProductsAdm.css';
import api from '../../api/api'

import { useState, useEffect } from 'react';

import SellerNameByID from '../../Components/SellerNameByID/SellerNameByID';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function ProductsAdm() {

const user = sessionStorage.getItem('user')
const userID = JSON.parse(user)._id

const {setLoading} = useContext(UserContext)

const [allProducts, setAllProducts] = useState()
const [selectedProducts, setSelectedProducts] = useState([]);
 
 useEffect(() => {
    getAllProducts()
  },[])

  async function getAllProducts(){
    setLoading(true)

    const response = await api('GET', `/product/allProducts`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        setAllProducts(backendMsg.Products)
    } else{
        alert("Falha ao carregar usuários")
        setAllProducts()
    }
  }

  function handleCheckboxChange(id){
    setSelectedProducts((prevSelectedProducts) => {
        if (prevSelectedProducts.includes(id)) {
            // Se o ID já está selecionado, remove-o
            return prevSelectedProducts.filter((userId) => userId !== id)
        } else {
            // Se o ID não está selecionado, adiciona-o
            return [...prevSelectedProducts, id]
        }
    })
  }

  async function changeSelectedStatus(status){
    if(!selectedProducts || selectedProducts.length == 0){
        return alert("Não há produtos selecionados")
    }

    selectedProducts.map(async (produto) => {
        await changeProductStatus(produto, status)
    })

  }

  async function changeProductStatus(ProductID, status){

    const body = {
        userID: userID,
        productID: ProductID,
        status: status
    }

    setLoading(true)

    const response = await api('POST', `/product/changeStatus`, body);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        console.log("Status Alterado com sucesso")
    } else{
        console.log("Falha ao alterar status do produto")
    }

    getAllProducts()
  }

  async function deleteSeleted(){
    if(!selectedProducts || selectedProducts.length == 0){
        return alert("Não há produtos selecionados")
    }

    const text = `Deseja deletar ${selectedProducts.length} produto(s) ? Essa ação é irrevessível`
    if(confirm(text) == true){
        selectedProducts.map(async (produto) => {
            await deleteProduct(produto)
        })
    }
  }

  async function deleteProduct(id) {
    const body = {
        userID: userID,
        productID: id,
    }

    setLoading(true)

    const response = await api('DELETE', `/product/deleteProduct`, body);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        console.log("Produto deletado com sucesso")
    } else{
        console.log("Falha ao deletar produto")
    }

    getAllProducts()
  }
 
  return (
    <div className='ProductsAdm admPage'>
        <div className='optionsContainer'>
            <div className='options'>
                <button onClick={() => {changeSelectedStatus("Approved")}}>Aprovar Selecionados</button>
                <button onClick={() => {changeSelectedStatus("Reproved")}}>Reprovar Selecionados</button>
                <button onClick={deleteSeleted}>Deletar Selecionados</button>
            </div>
            <p>Total de 8 Produtos</p>
        </div>

        <div className='table'>
            <div className='tableHeader'>
                <div></div>
                <h2>Imagem</h2>
                <h2>Nome</h2>
                <h2>Categoria</h2>
                <h2>Status</h2>
                <h2>Vendedor</h2>
            </div>

            {allProducts ? allProducts.map((item) => (
                <div className='row' key={item._id}>
                    <input type="checkbox" checked={selectedProducts.includes(item._id)} onChange={() => handleCheckboxChange(item._id)}/>
                    <div className='rowImg' style={{backgroundImage: `url(${item.imgs[0]})`}}></div>
                    <p>{item.name}</p>
                    <p>{item.category}</p>
                    <p>{item.status}</p>
                    <SellerNameByID sellerID={item.userID}/>
                </div>
            )) : <p>Loading</p>}
        </div>
    </div>
  );
}

export default ProductsAdm;