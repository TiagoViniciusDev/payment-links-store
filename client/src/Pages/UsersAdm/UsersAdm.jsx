import { useEffect, useState } from 'react';
import './UsersAdm.css';
import api from '../../api/api'

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function UsersAdm() {

  const {setLoading} = useContext(UserContext)

  const [error, setError] = useState({ value: false, msg: undefined })
  const [allUsers, setAllUsers] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])

  const user = sessionStorage.getItem('user')

  // console.log(selectedUsers)

 useEffect(() => {
    getAllUsers()
 },[])

 async function getAllUsers(){
    try {
      setLoading(true)

      let id = JSON.parse(user)._id

      const body = {
        userID: id
      }

      const response = await api('POST', `/user/allUsers`, body);
      const backendMsg = await response.json();
  
      setLoading(false)

      if(backendMsg.success == true){
          setError({ value: false, msg: undefined })
          setAllUsers(backendMsg.users)
      } else{
          setError({ value: true, msg: backendMsg.msg })
          setAllUsers()
      }
    } catch (error) {
      setError({ value: true, msg: "Falha ao fazer requisição" })
    }
  }


  function handleCheckboxChange(id){
    setSelectedUsers((prevSelectedUsers) => {
        if (prevSelectedUsers.includes(id)) {
            // Se o ID já está selecionado, remove-o
            return prevSelectedUsers.filter((userId) => userId !== id)
        } else {
            // Se o ID não está selecionado, adiciona-o
            return [...prevSelectedUsers, id]
        }
    })
  }

  async function deleteSeletedUsers(){
    if(!selectedUsers || selectedUsers.length == 0){
      return alert("Não há usuários selecionados")
    }

    const text = `Deseja deletar ${selectedUsers.length} usuários ? Essa ação é irrevessível`
    if(confirm(text) == true){
      await selectedUsers.map(async (selectedUserID) => {
        console.log(selectedUserID)
        await deleteUser(selectedUserID)
      })

      getAllUsers() //refresh
    }


  }

  async function deleteUser(productID){
    try {

      setLoading(true)

      const body = {
        userID: JSON.parse(user)._id,
        deleteID: productID
      }

      const response = await api('DELETE', `/user/delete`, body);
      const backendMsg = await response.json();
  
      setLoading(false)
      
      if(backendMsg.success == true){
          console.log("Usuário deletado com sucesso")
      } else{
          console.log(backendMsg.msg)
      }

      getAllUsers() //refresh

    } catch (error) {
      console.log("Falha ao fazer requisição")
    }
  }

  return (
    <div className='UsersAdm admPage'>
        <div className='optionsContainer'>
            <div className='options'>
                <button onClick={deleteSeletedUsers}>Deletar Selecionados</button>
            </div>
            <p>Total de 52 Usuários</p>
        </div>

        <div className='table'>
            <div className='tableHeader'>
                <div></div>
                <h2>Imagem</h2>
                <h2>Nome</h2>
                <h2>Tipo</h2>
            </div>

            {allUsers ? allUsers.map((item) => (
                <div className='row' key={item._id}>
                    <input type="checkbox" checked={selectedUsers.includes(item._id)} onChange={() => handleCheckboxChange(item._id)}/>
                    <div className='rowImg'></div>
                    <p>{item.username}</p>
                    <p>{item.role}</p>
                </div>
            )) : error.value ? <p>{error.msg}</p> : <p>Loading</p>}
        </div>
    </div>
  );
}

export default UsersAdm;