import './NewPost.css';
import api from '../../api/api'

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import { CiImageOn } from "react-icons/ci";
import { IoIosRemoveCircle } from "react-icons/io";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

import { firebaseInit } from '../../firebase';
import {getStorage, uploadBytesResumable, getDownloadURL, ref} from 'firebase/storage'

function NewPost() {

  const navigate = useNavigate()
  const inputFileRef = useRef(null);

  const { user, setLoading } = useContext(UserContext)

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState('')
  const [allCategories, setAllCategories] = useState([])

  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [urls, setUrls] = useState([])

  useEffect(() => {
    getAllCategories()
  },[])


  async function getAllCategories(){
    setLoading(true)

    const response = await api('GET', '/productCategories');
    const backendMsg = await response.json();

    
    if(backendMsg.success == true){
        setAllCategories(backendMsg.allCategories)
    } else{
        alert("Falha ao carregar categorias")
        setAllCategories([])
    }

    setLoading(false)
  
  }

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)

    if(!selectedImages || selectedImages.length === 0){
      setLoading(false)
      return alert("Selecione as imagens do seu produto")
    }

    if(selectedImages.length > 4){
      setLoading(false)
      return alert("Você pode escolher no máximo 4 imagens")
    }

    const uploadedUrls = await handleFileUpload();

    const dataObj = {
        userID: user._id,
        name: title,
        desc: desc,
        price: price,
        category: category,
        imgs: uploadedUrls
    }

    const response = await api('POST', '/product/newProduct', dataObj)
    const backendMsg = await response.json()

    if(backendMsg.success === false){
      return alert(backendMsg.msg)
    } else{
      alert("Produto publicado com sucesso")
      navigate("/meus-produtos")
    }

    setLoading(false)

  }

  function handleImageClick(){
    inputFileRef.current.click();
  }

  async function handleFileChange(e){
    setSelectedImages([])
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prevImages => [...prevImages, ...imageUrls]);

    setSelectedFiles([])
    setSelectedFiles(files)
  }

  async function handleFileUpload() {
    try {
      setFileUploadError(false);
  
      const uploadPromises = selectedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage(firebaseInit);
          const fileName = "Product" + " - " + file.name + " - " + new Date().getTime();
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


  function cancel(e){
    e.preventDefault()
    navigate('/perfil')
  }

  function removeImg(indexToRemove){
    let newArray = selectedFiles.filter((_, index) => index !== indexToRemove);
    let newArray2 = selectedImages.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(newArray)
    setSelectedImages(newArray2)
  }

  return (
    <div className='NewPost'>
        <div className='container'>
            <h1>Nova Postagem</h1>
            <div className='postContainer'>
                <div className='uploadImgs'>
                    <div className='uploadInfo' onClick={handleImageClick} style={selectedImages && selectedImages.length > 0 ? {display: "none"} : {display: "flex"}}>
                        <CiImageOn />
                        <p>Clique aqui para selecionar as imagens</p>
                        <p>Recomendamos imagens com proporção 1:1 (1080x1080)</p>
                    </div>
                    <div className='selectedImgsContainer' style={selectedImages && selectedImages.length > 0 ? {display: "block"} : {display: "none"}}>
                      <div className='selectedImgs'>
                          {selectedImages && selectedImages.length > 0 ? (selectedImages.map((imageUrl, index) => (
                            <div className='imgContainer' key={index} title='Remover' onClick={() => removeImg(index)}>
                              <IoIosRemoveCircle />
                              <img 
                                src={imageUrl} 
                                alt={`Selected ${index}`} 
                                style={{ width: "150px", height: "auto" }} 
                              />
                            </div>
                            ))
                            ) : (
                            <div className='noSelectedImgs'>
                                <p>Falha ao carregar imagens</p>
                            </div>)
                          }
                      </div>
                    </div>
                    <input type="file" ref={inputFileRef} accept='image/*' multiple style={{ display: 'none' }} onChange={handleFileChange}/>
                </div>
                <form className='postForm' onSubmit={handleSubmit}>
                    <input type="text" placeholder='Titúlo' required onChange={(e) => setTitle(e.target.value)}/>
                    <textarea placeholder='Descrição' required minLength="200" onChange={(e) => setDesc(e.target.value)}></textarea>
                    <input type="number" placeholder='Preço' required onChange={(e) => setPrice(e.target.value)}/>
                    <select onChange={(e) => setCategory(e.target.value)} defaultValue="undefined">
                        <option value="undefined" disabled>Selecione a categoria</option>
                        {allCategories ? allCategories.map((categoria) => (
                          <option key={categoria._id} value={categoria.categoryName}>{categoria.categoryName}</option>
                        )) : ""}
                    </select>
                    <div className='buttons'>
                        <button onClick={cancel}>Cancelar</button>
                        <button type='submit'>Publicar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default NewPost;