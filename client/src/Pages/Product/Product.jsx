import './Product.css';
import api from '../../api/api'

import { useState, useEffect } from 'react';

import { FaStar } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

//Stripe - Pagamentos
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Product() {

  const url = window.location.href;
  const urlParts = url.split('/');

  const {setLoading} = useContext(UserContext)

  const [productData, setProductData] = useState()
  const [sellerName, setSellerName] = useState()
  const [mainImg, setMainImg] = useState()

  async function getProductData(){
    setLoading(true)

    const response = await api('GET', `/product/productByID/${urlParts[4]}`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        setProductData(backendMsg.Product)
        getSellerName(backendMsg.Product.userID)
    } else{
        alert("Falha ao carregar informações do produto")
        setProductData()
    }
  }

  async function getSellerName(sellerID) {
    setLoading(true)

    const response = await api('GET', `/user/nameById/${sellerID}`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        setSellerName(backendMsg.username)
    } else{
        alert("Falha ao carregar informações do vendedor")
        setSellerName()
    }
  }

  function changeMainImg(imgURL){
    setMainImg(imgURL)
  }

  useEffect(() => {
    getProductData()
  },[])

  async function checkout(){
    setLoading(true)
    try {

      const body = {
        paymentMethod: 'card',
        price: productData.price*100, 
        name: productData.name, 
        imageUrl: productData.imgs[0],
        quantity: 1
      }
      
      const response = await api('POST', `/stripe/create-checkout-session`, body);
      const session = await response.json();
  
      const stripe = await stripePromise;
      stripe.redirectToCheckout({ sessionId: session.id });
  
    } catch (error) {
      console.log(error)
      alert("Falha ao direcionar usuário para pagina de pagamento, tente novamente mais tarde")
    }

    setLoading(false)
  }

  return (
    <div className='Product'>
        <div className='container'>
          {productData ? 
            <div>
              <div className='div1'>
                <div className='productImgs'>
                  <div className='sideImgs'>
                    {productData.imgs.map((img) => (
                      <div className='img' key={img} style={{backgroundImage: `url(${img})`}} onClick={() => {changeMainImg(img)}}></div>
                    ))}
                  </div>
                  <div className='mainImg' style={mainImg ? {backgroundImage: `url(${mainImg})`} : {backgroundImage: `url(${productData.imgs[0]})`}}></div>
                </div>
                <div className='productInfo'>
                  <h1>{productData.name}</h1>
                  {sellerName ? <p>Vendido por: {sellerName}</p> : <p></p>}
                  <div className='feedback'>
                    <p>5,0</p>
                    <div className='starsIcon'>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                  </div>
                  <p className='price'>R$ {productData.price}</p>
                  <div className='buttons'>
                    <a /*href={productData.paymentLink}*/ onClick={checkout}>
                      <FaShoppingCart />
                      Comprar
                    </a>
                  </div>
                  <p className='category'>Categoria : <span>{productData.category}</span></p>
                </div>
              </div>

              <div className='div2'>
                <div className='desc'>
                  <h2>Descrição</h2>
                  <p>{productData.desc}</p>
                </div>
              </div>
            </div>
           : <h2>Loading...</h2>}

           <div className='comments'>
            <h2>Comentários</h2>
            <p>Sem comentários</p>
           </div>
        </div>
    </div>
  );
}

export default Product;