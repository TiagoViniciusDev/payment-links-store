import './CategoriesAdm.css';
import api from '../../api/api'

import { useEffect, useState, useRef } from 'react';

import { CiImageOn } from "react-icons/ci";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

//Firebase
import { firebaseInit } from '../../firebase';
import {getStorage, uploadBytesResumable, getDownloadURL, ref} from 'firebase/storage'

function CategoriesAdm() {

    const user = sessionStorage.getItem('user')
    const userID = JSON.parse(user)._id

    const inputFileRef = useRef(null);

    const {setLoading} = useContext(UserContext)

    const [categories, setCategories] = useState()
    const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState();
    const [selectedImg, setSelectedImg] = useState([])
    const [categoryName, setCategoryName] = useState()
    const [showEditCategoryForm, setShowEditCategoryForm] = useState(false)

    const [urls, setUrls] = useState([])
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

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

      function handleImageClick(){
        inputFileRef.current.click();
      }

      function HiddenNewCategoryForm(e){
        e.preventDefault()
        setShowNewCategoryForm(false)
        setSelectedImg([])
      }

      function handleFileChange(e){
        // console.log(e.target.files[0])
        const files = Array.from(event.target.files);
        const imageUrl = files.map(file => URL.createObjectURL(file));
        setSelectedImg(imageUrl);
        setSelectedFiles(files)
      }

      function handleCheckboxChange(categoryId){
        // Se o item já estiver selecionado, desmarque-o, caso contrário, selecione-o
        setSelectedCategory((prevSelected) =>
          prevSelected === categoryId._id ? null : categoryId
        );
      };

      function newCategoryForm(){
        setShowEditCategoryForm(false)

        //Limpando qualquer arquivo selecionado previamente
        setSelectedFiles([])
        setSelectedImg([])

        setShowNewCategoryForm(true)
      }

      async function createCategory(e){
        e.preventDefault()

        if(!selectedImg || selectedImg.length === 0){
            return alert("Selecione a imagem da categoria")
        }

        setLoading(true)

        const uploadedUrls = await handleFileUpload();

        const body = {
            userID: userID,
            categoryName: categoryName,
            img: uploadedUrls[0]
        }

        const response = await api('POST', `/productCategories/newCategory`, body);
        const backendMsg = await response.json();
     
        setLoading(false)
        
        if(backendMsg.success == true){
            alert(backendMsg.msg)
            getAllCategories() //refresh
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
              const fileName = "CategoryImg" + " - " + file.name + " - " + new Date().getTime();
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

      async function deleteCategory() {

        if(!selectedCategory || selectedCategory.length == 0){
          return alert("Nenhuma categoria selecionada")
        }

        const text = `Deseja deletar a categoria selecionada? Essa ação é irrevessível`
        if(confirm(text) == true){
          setLoading(true)

          const body = {
            userID: userID,
            categoryID: selectedCategory
          }
      
          const response = await api('DELETE', `/productCategories/deleteById`, body);
          const backendMsg = await response.json();
      
          setLoading(false)
          
          if(backendMsg.success == true){
              alert(backendMsg.msg)
              getAllCategories() //refresh
          } else{
              alert(backendMsg.msg)
          }
        }
      }

  function editCategory(){
    if(!selectedCategory || selectedCategory.length == 0){
      return alert("Selecione uma categoria")
    } 

    setShowNewCategoryForm(false)

    //Limpando qualquer arquivo que já esteja previamente selecionado
    setSelectedFiles([])
    setSelectedImg([])

    setShowEditCategoryForm(true)
  }

  async function saveChanges(categoryID) {
    // alert("Mudanças salvas")

    setLoading(true)

    var uploadedUrls = undefined

    if(selectedImg || selectedImg.length > 0){ //Se tiver img faz upload
      uploadedUrls = await handleFileUpload();
    }

    const body = {
        userID: userID,
        categoryID: categoryID,
    }

    if(uploadedUrls !== undefined){
      body.img = uploadedUrls[0]
    }

    console.log(body)

    const response = await api('POST', `/productCategories/editCategory`, body);
    const backendMsg = await response.json();
  
    setLoading(false)
    
    if(backendMsg.success == true){
        alert(backendMsg.msg)
        getAllCategories() //refresh
    } else{
        alert(backendMsg.msg)
    }
  }


  return (
    <div className='CategoriesAdm admPage'>
        <div className='categoriesHeader'>
            <div className='options'>
                <button onClick={newCategoryForm}>Nova Categoria</button>
                <button onClick={editCategory}>Editar Selecionado</button>
                <button onClick={deleteCategory}>Deletar Selecionado</button>
            </div>
            <p>Total de 8 Categorias</p>
        </div>
        <div className='categoryNew' style={showNewCategoryForm ? {display: "flex"} : {display: "none"}}>
            <input type="file" ref={inputFileRef} accept='image/*' style={{ display: 'none' }} onChange={handleFileChange}/>
            <div className='uploadImg' onClick={handleImageClick}>
                <div className='selectImage' style={selectedImg && selectedImg.length > 0 ? {display: "none"} : {display: "flex"}}>
                    <CiImageOn />
                    <p>Clique aqui para selecionar a imagem</p>
                </div>
                <div className='seletedImg' style={selectedImg && selectedImg.length > 0 ? {display: "flex", borderRadius: "100%"} : {display: "none"}}>
                    <img src={selectedImg[0]} alt="imagem da categoria" title='clique para alterar a imagem'/>
                </div>
            </div>
            <div className='categoryData'>
                <h2>Nova Categoria</h2>
                <form onSubmit={createCategory}>
                    <input type="text" placeholder='Nome da categoria' onChange={(e) => {setCategoryName(e.target.value)}} required/>
                    <div className='btn'>
                        <button type='button' onClick={HiddenNewCategoryForm}>Cancelar</button>
                        <button type='submit'>Criar Categoria</button>
                    </div>
                </form>
            </div>
        </div>
        <div className='editCategory' style={selectedCategory && showEditCategoryForm ? {display: "flex"} : {display: "none"}}>
          {/* <input type="file" ref={inputFileRef} accept='image/*' style={{ display: 'none' }} onChange={handleFileChange}/> */}
          {selectedCategory ? <div className='editCategoryImg' style={ selectedImg && selectedImg.length > 0 ? {backgroundImage: `url(${selectedImg[0]})`} : {backgroundImage: `url(${selectedCategory.img})`}} onClick={handleImageClick}></div> : <p>Categoria não selecionada</p>}
          {selectedCategory ? 
            <div className='editCategoryInfo' key={selectedCategory._id}>
              <p>Editando categoria: <span>{selectedCategory.categoryName}</span></p>
              <input type="text" placeholder='Nome da categoria'defaultValue={selectedCategory.categoryName} />
              <div className='editCategoryOptions'>
                <button onClick={() => {setShowEditCategoryForm(false)}}>Cancelar</button>
                <button onClick={() => {saveChanges(selectedCategory._id)}}>Salvar Alterações</button>
              </div>
            </div>
          : <p>Categoria não selecionada</p>}
        </div>
        <div className='table'>
            <div className='tableHeader'>
                <div></div>
                <h2>Imagem da Categoria</h2>
                <h2>Nome da Categoria</h2>
            </div>
            {categories ? categories.map((item) => (
                <div className='category' key={item._id}>
                    <input type="checkbox" checked={selectedCategory === item} onChange={() => handleCheckboxChange(item)}/>
                    <div className='categoryImg' style={{backgroundImage: `url(${item.img})`}}></div>
                    <p>{item.categoryName}</p>
                </div>
            )) : <p>Loading</p>}
        </div>
    </div>
  );
}

export default CategoriesAdm;