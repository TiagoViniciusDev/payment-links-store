import './Home.css';
import ProdutoContainer from '../../Components/ProdutoContainer/ProdutoContainer';
import Banner from '../../Components/Banner/Banner';
import api from '../../api/api'

import { GrTechnology } from "react-icons/gr";
import { GiSonicShoes } from "react-icons/gi";
import { FaRegClock } from "react-icons/fa";

import { useEffect, useState } from 'react';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Navigation} from 'swiper/modules';

function Home() {

  const {setLoading} = useContext(UserContext)

  const [products1, setProducts1] = useState([])
  const [products2, setProducts2] = useState([])
  const [products3, setProducts3] = useState([])

  async function getProductsByCategory(categoria){
    setLoading(true)

    const response = await api('GET', `/product/allProducts?status=Approved&categoria=${categoria}&amount=10`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        return backendMsg.Products
    } else{
        alert("Falha ao carregar produtos")
        return []
    }
  
  }

  async function getAllProducts(){
    setLoading(true)

    const response = await api('GET', `/product/allProducts?status=Approved&amount=10`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        return backendMsg.Products
    } else{
        alert("Falha ao carregar produtos")
        return []
    }
  }

  async function getData(){
    setProducts1(await getProductsByCategory('eletrônicos'))
    setProducts2(await getProductsByCategory('calçados'))
    setProducts3(await getAllProducts())
  }

  useEffect(() => {
    getData()
  },[])

  return (
    <div className='Home'>
      <div className='container'>
        <Banner />
      </div>
      <div className='melhoresAvaliados Section'>
          <div className='container'>
              <div className='title'>
                  <FaRegClock />
                  <h2>Adicionados Recentemente</h2>
              </div>
              <div className='produtosSlider'>
                <Swiper
                  spaceBetween={20}
                  slidesPerView="auto"
                  // autoplay={{
                  //     delay: 5000,
                  //     disableOnInteraction: false,
                  // }}
                  // loop={true}    
                  pagination={{ clickable: true }} // Habilita paginação
                  navigation={true} // Ativa os botões de navegação
                  scrollbar={{ draggable: true }}
                  modules={[Autoplay, Navigation]}
                  className="mySwiper"
                >
                  {products3 && products3.length > 0 ? products3.map((product) => (
                    <SwiperSlide key={product._id} style={{width: "fit-content"}}>
                      <ProdutoContainer productID={product._id} nome={product.name} desc={product.desc} price={product.price} img={product.imgs[0]}/>
                    </SwiperSlide>
                  )) : <p>LOADING...</p>}
                </Swiper>
              </div>
          </div>
      </div>

      <div className='eletronicos Section'>
          <div className='container'>
              <div className='title'>
                  <GrTechnology />
                  <h2>Eletrônicos</h2>
              </div>
              <div className='produtosSlider'>
                <Swiper
                  spaceBetween={20}
                  slidesPerView="auto"
                  // autoplay={{
                  //     delay: 2500,
                  //     disableOnInteraction: false,
                  // }}
                  // loop={true}
                  pagination={{ clickable: true }} // Habilita paginação
                  navigation={true} // Ativa os botões de navegação    
                  scrollbar={{ draggable: true }}
                  modules={[Autoplay, Navigation]}
                  className="mySwiper"
                >
                  {products1 && products1.length > 0 ? products1.map((product) => (
                    <SwiperSlide key={product._id} style={{width: "fit-content"}}>
                      <ProdutoContainer productID={product._id} nome={product.name} desc={product.desc} price={product.price} img={product.imgs[0]}/>
                    </SwiperSlide>
                  )) : <p>LOADING...</p>}
                </Swiper>
              </div>
          </div>
      </div>

      <div className='calcados Section'>
          <div className='container'>
              <div className='title'>
                  <GiSonicShoes />
                  <h2>Calçados</h2>
              </div>
              <div className='produtosSlider'>
                <Swiper
                  spaceBetween={20}
                  slidesPerView="auto"
                  // autoplay={{
                  //     delay: 2500,
                  //     disableOnInteraction: false,
                  // }}
                  // loop={true}
                  pagination={{ clickable: true }} // Habilita paginação
                  navigation={true} // Ativa os botões de navegação    
                  scrollbar={{ draggable: true }}
                  modules={[Autoplay, Navigation]}
                  className="mySwiper"
                >
                  {products2 && products2.length > 0 ? products2.map((product) => (
                    <SwiperSlide key={product._id} style={{width: "fit-content"}}>
                      <ProdutoContainer productID={product._id} nome={product.name} desc={product.desc} price={product.price} img={product.imgs[0]}/>
                    </SwiperSlide>
                  )) : <p>LOADING...</p>}
                </Swiper>
              </div>
          </div>
      </div>
    </div>
  );
}

export default Home;