import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import api from '../../api/api'

import { FaEyeSlash, FaEye } from "react-icons/fa";
import { MdFormatListBulleted } from "react-icons/md";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { RiImageEditFill } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

import { firebaseInit } from '../../firebase';
import {getStorage, uploadBytesResumable, getDownloadURL, ref} from 'firebase/storage'

function Profile() {

  const navigate = useNavigate()
  const inputFileRef = useRef(null);

  const {user, setUser, setLoading} = useContext(UserContext)
  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userData, setUserData] = useState()

  const [selectedImg, setSelectedImg] = useState([])
  const [urls, setUrls] = useState([])
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const userInfo = JSON.parse(sessionStorage.getItem('user'))

  useEffect(() => {
    if(!userInfo){return navigate('/')}
    getUserData(userInfo._id)
    setUser(userInfo)
    setUsername(userInfo.username)
    setEmail(userInfo.email)
    setPassword(userInfo.password)
  },[])

  function logout(){
    console.log("LOGOUT")
    sessionStorage.removeItem('user')
    setUser()
    // document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; //Deletando cookie
    // Cookies.remove('access_token');
    navigate('/')
  }

  async function getUserData(userID) {
    setLoading(true)

    const body = {
        userID: userID
    }

    const response = await api('POST', `/user/userById/${userID}`, body);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        setUserData(backendMsg.user)
        setUser(backendMsg.user)
    } else{
        alert(backendMsg.msg)
        return 
    }
  }

  function handleImageClick(){
    inputFileRef.current.click();
  }

  function handleFileChange(e){
    // console.log(e.target.files[0])
    const files = Array.from(event.target.files);
    const imageUrl = files.map(file => URL.createObjectURL(file));
    setSelectedImg(imageUrl);
    setSelectedFiles(files)
  }

  function cancel(){
    setSelectedImg([])
    setUsername(user.username)
    setPassword(user.password)
  }

  async function updateUser(e){
    e.preventDefault()

    setLoading(true)

    const body = {
      userID: userInfo._id,
      username: username,
      password: password
  }

    if(selectedFiles && selectedFiles.length > 0){
      const uploadedUrls = await handleFileUpload();
      body.avatar = await uploadedUrls[0]
    }

    console.log(body)

    const response = await api('PUT', `/user/update`, body);
    const backendMsg = await response.json();
 
    setLoading(false)
    
    if(backendMsg.success == true){
        getUserData(userInfo._id) //refresh
        alert(backendMsg.msg)
        setUser(backendMsg.updatedUser)
    } else{
        alert(backendMsg.msg)
    }
  }

  async function handleFileUpload() {
    try {
      setFileUploadError(false);
  
      const uploadPromises = selectedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage(firebaseInit);
          const fileName = "Profile" + " - " + file.name + " - " + new Date().getTime();
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
  
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setFilePerc(Math.round(progress));
            },
            (error) => {
              setFileUploadError(true);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      });
  
      const downloadURLs = await Promise.all(uploadPromises);
  
      setUrls((prevUrls) => [...prevUrls, ...downloadURLs]);
  
      return downloadURLs; // Retorna as URLs para uso externo
    } catch (error) {
      console.error("Erro ao fazer upload dos arquivos:", error);
    }
  }

  return (
    <div className='Profile'>
        <div className='container'>
            <div className='div1'>
                <div className='profileImgContainer'>
                    <RiImageEditFill />
                    <input type="file" ref={inputFileRef} accept='image/*' style={{ display: 'none' }} onChange={handleFileChange}/>
                    <img src={selectedImg && selectedImg.length > 0 ? selectedImg[0] : userData ? userData.avatar : "./profileImg.png"} alt="user" className='profileImg' title='Mudar imagem' onClick={handleImageClick}/>
                </div>
                <div className='profileInfo'>
                    <input type="text" placeholder='Nome de usuário' defaultValue={userData ? userData.username : ""} onChange={(e) => {setUsername(e.target.value)}}/>
                    <input type="email" placeholder='Email' value={email} disabled/>
                    <div className='password'>
                        <input type={showPassword ? 'text' : 'password'} placeholder='Alterar Senha' onChange={(e) => {setPassword(e.target.value)}}/>
                        <FaEyeSlash style={showPassword ? {display: 'none'} : {display: 'block'}} onClick={() => {setShowPassword(true)}} title='Mostrar'/>
                        <FaEye style={showPassword ? {display: 'block'} : {display: 'none'}} onClick={() => {setShowPassword(false)}} title='Esconder'/>
                    </div>
                    <div className='buttons'>
                        <button onClick={updateUser}>Salvar Alterações</button>
                        <button onClick={cancel}>Cancelar</button>
                        <button onClick={logout}>Sair</button>
                    </div>
                </div>
            </div>
            <div className='div2'>
                <div className='adminPanel' onClick={() => {navigate('/admin')}} style={user && user.role == "admin" ? {display: "flex"} : {display: "none"}}>
                    <MdAdminPanelSettings />
                    <div className='text'>
                        <p>Painel do administrador</p>
                        <p>Gerenciar e moderar conteúdo do site</p>
                    </div>
                </div>
                <div className='myAds' onClick={() => {navigate('/meus-produtos')}}>
                    <MdFormatListBulleted />
                    <div className='text'>
                        <p>Meus Anúncios</p>
                        <p>Lista com todos os meus produtos anúnciados</p>
                    </div>
                </div>
                <div className='newAd' onClick={() => {navigate('/nova-postagem')}}>
                    <MdFormatListBulletedAdd />
                    <div className='text'>
                        <p>Novo Anúncio</p>
                        <p>Publicar novo anúncio de produto</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Profile;