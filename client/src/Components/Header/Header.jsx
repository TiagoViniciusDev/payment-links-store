import { useEffect, useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom'
import api from '../../api/api';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { HiUserCircle } from "react-icons/hi"
import { BiSolidCategoryAlt } from "react-icons/bi";

function Header() {

  const navigate = useNavigate()

  const {user, setUser} = useContext(UserContext)

  // console.log(user)

  const [showAllCategories, setShowAllCategories] = useState(false)
  const [searchText, setSearchText] = useState()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState()

  function loginPage(){
    navigate("/entrar")
  }

  function profilePage(){
    navigate("/perfil")
  }

  function goHomePage(){
    navigate("/")
  }

  useEffect(() => {
    // const userInfo = sessionStorage.getItem('user')
    // setUser(JSON.parse(userInfo))
    if(user && user.length > 0){
      const userJSON = JSON.stringify(user)
      const userInfo = JSON.parse(sessionStorage.getItem('user'))
      userJSON.password = userInfo.password
      // console.log(userInfo)
      sessionStorage.setItem('user', userJSON)
    }
  },[user])

  function handleAllCategoriesBtn(){
    setShowAllCategories(!showAllCategories)
  }

  function search(e){
    e.preventDefault()
    setShowAllCategories(false)
    console.log(searchText)
    if(searchText == "" || searchText == undefined){
      navigate(`/buscar`)
    } else{
      navigate(`/buscar?search=${searchText}`)
    }
  }

  function goCategoryPage(categoria){
    setShowAllCategories(false)
    navigate(`/buscar?categoria=${categoria}`)
  }

  useEffect(() => {
    getAllCategories()
},[])

async function getAllCategories(){
    setLoading(true)

    const response = await api('GET', `/productCategories`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        setCategories(backendMsg.allCategories)
    } else{
        alert("Falha ao carregar categorias")
        setCategories()
    }
  }

  return (
    <header className='Header'>
        <div className='container'>
            <div className='headerTop'>
                <div className='logo' onClick={goHomePage}>
                    <h2>Payments <span>Links Store</span></h2>
                </div>
                  <form className='searchBar' onSubmit={(e) => {search(e)}}>
                      <input type="text" onChange={(e) => {setSearchText(e.target.value)}}/>
                      <button type='submit'><FaSearch /></button>
                  </form>
                  <div className='user'>
                      {user ? <div className='userImg' style={{backgroundImage: `url(${user.avatar})`}}></div> : <HiUserCircle />}
                      <div className='text' onClick={loginPage} style={user ? {display: 'none'} : {display: 'flex'}}>
                          <p>Minha Conta</p>
                          <p>Entrar / Cadastro</p>
                      </div>
                      <div className='text' onClick={profilePage} style={user ? {display: 'flex'} : {display: 'none'}}>
                          <p>Bem vindo</p>
                          <p>{user ? user.username : ""}</p>
                      </div>
                  </div>
            </div>
            <nav style={showAllCategories ? {alignItems: "start", justifyContent: "start", gap: "0.5em"} : {alignItems: "center"}}>
                {/* <BiSolidCategoryAlt onClick={handleAllCategoriesBtn}/> */}
                <div onClick={handleAllCategoriesBtn} className='mobileBtn'>
                  <BiSolidCategoryAlt />
                  <p style={showAllCategories ? {display: "block"} : {display: "none"}}>Todas as categorias</p>
                </div>
                <a onClick={handleAllCategoriesBtn}>{showAllCategories ? <IoMdClose /> : ""}Todas as Categorias</a>
                <a href="" style={showAllCategories ? {display: "none"} : {display: "block"}}>Home</a>
                <a href="" style={showAllCategories ? {display: "none"} : {display: "block"}}>Roupas</a>
                <a href="" style={showAllCategories ? {display: "none"} : {display: "block"}}>Eletrônicos</a>
                <a href="" style={showAllCategories ? {display: "none"} : {display: "block"}}>Casa</a>
            </nav>
            <div className='allCategories' style={showAllCategories ? {display: "flex"} : {display: "none"}}>
              {categories ? categories.map((item) => (
                <div key={item._id} className='category' onClick={() => {goCategoryPage(item.categoryName)}}>
                  <div className='categoryImg' style={{backgroundImage: `url(${item.img})`}}></div>
                  <p>{item.categoryName}</p>
                </div>
              ))
              : <p>Loading</p>}
            </div>
        </div>
    </header>
  );
}

export default Header;