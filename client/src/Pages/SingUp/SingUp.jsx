import './SingUp.css';
import api from '../../api/api'
import GoogleAuth from '../../Components/GoogleAuth/GoogleAuth';

import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react';
// import OAuth from '../../components/OAuth/OAuth';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function SingUp() {

  const navigate = useNavigate()

  const {setLoading} = useContext(UserContext)

  const [userName, setUserName] = useState()
  const [userEmail, setUserEmail] = useState()
  const [userPassword, setUserPassword] = useState()
  const [error, setError] = useState()

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)

    if(!userName){
      alert('Nome não definido')
      return
    }

    if(!userEmail){
      alert('Email não definido')
      return
    }

    if(!userPassword){
      alert('Senha não definida')
      return
    }

    try {
      const requestBody = {
        username: userName,
        email: userEmail,
        password: userPassword
      }
  
      const response = await api("POST", "/user/singup", requestBody)
      const backendMsg = await response.json()
      
      if(backendMsg.success === false){
        setError(backendMsg.msg)
        setLoading(false)
        alert("ERRO")
        return
      }
  
      setError(null)
      alert("Usuário criado com sucesso")
      navigate("/entrar")
    } catch (error) {
      console.log(error)
      alert("Erro ao fazer registro")
      setError(true)
    }

    setLoading(false)

  }

  return (
    <div className='Sing'>
      <div className='container'>
        <div className='text'>
            <div className='icon'>
              <img src="./icon-singup.png" alt="" />
            </div>
            <p>Novo Cliente</p>
            <p>Criar uma conta é fácil!</p>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="text" name='name' placeholder='Nome de usuário' onChange={(e) => {setUserName(e.target.value)}}/>
            <input type="email" name='email' placeholder='Email' autoComplete='email' onChange={(e) => {setUserEmail(e.target.value)}}/>
            <input type="password" name='password' placeholder='Senha' autoComplete="current-password" onChange={(e) => {setUserPassword(e.target.value)}}/>
            <button type='submit'>Resgistra-se</button>
            <GoogleAuth btnTitle="Entrar com o Google"/>
            {/* <button>Registre-se com Google</button> */}
            {/* <OAuth /> */}
          </form>
          <div className='anotherForm'>
            <p>Já tem uma conta? <Link to="/entrar">Entrar</Link></p>
            <p className='errorMsg' style={error ? {display: 'block'} : {display: "none"}}>{error}</p>
          </div>
      </div>
    </div>
  );
}

export default SingUp;