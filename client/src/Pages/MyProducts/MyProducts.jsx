import './MyProducts.css';
import api from '../../api/api'
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

import { DataGrid } from '@mui/x-data-grid';
import { Container, Typography } from '@mui/material';

function MyProducts() {

  const navigate = useNavigate()
  const user = sessionStorage.getItem('user')
  const userID = JSON.parse(user)._id

  const {setLoading} = useContext(UserContext)

  const [myProductsData, setMyProductsData] = useState([])
  const [rows, setRows] = useState()
  const [selectionModel, setSelectionModel] = useState([]);

  useEffect(() => {
    getMyProducts()
  },[])

  async function getMyProducts(){
    setLoading(true)

    const dataObj = {
        userID: userID
    };

    const response = await api('POST', '/product/myProducts', dataObj);
    const backendMsg = await response.json();
    
    if(backendMsg.success == true){
        setMyProductsData(backendMsg.products)

        const rowsData = []
        backendMsg.products.map((product) => {
          rowsData.push(
            { id: product._id, col1: product.imgs[0], col2: product.name, col3: product.category, col4: product.status }
          )
        })
        setRows(rowsData)
    } else{
        setMyProductsData([])
        alert("Falha ao carregar seus produtos")
    }

    setLoading(false)
  }

  async function handleDelete(produtoID){
    setLoading(true)
      try {
        const dataObj = {
          userID: userID,
          productID: produtoID
        };
  
        const response = await api('DELETE', '/product/deleteProduct', dataObj);
        const backendMsg = await response.json();
        
        if(backendMsg.success == true){
            alert("Produto deletado com sucesso")
            getMyProducts()
        } else{
            alert("Erro ao tentar deletar produto")
        }

      } catch (error) {
        alert("Erro ao tentar deletar produto")
      }

    setLoading(false)
  }
  
  const columns = [
    { field: 'col1', headerName: 'imagem', width: 140, renderCell: (params) => (
      <img
        src={params.value}
        alt="product"
        style={{ width: 100, height: 100, margin: '0.5em 0'}}
      />
    )},
    { field: 'col2', headerName: 'Titulo', width: 600 },
    { field: 'col3', headerName: 'Categoria', width: 150 },
    // { field: 'col4', headerName: 'Status', width: 150 }
    {
      field: 'col4',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => {
        let statusText;
        switch (params.value) {
          case 'Approved':
            statusText = <p>Aprovado</p>;
            break;
          case 'Reproved':
            statusText = <p>Reprovado</p>;
            break;
          case 'Pending':
            statusText = <p>Pendente</p>;
            break;
          default:
            statusText = <p>Erro</p>;
        }
        return statusText;
      },
    },
  ];

  async function deleteItems(){

    if(selectionModel.length <= 0){
      return alert('Não há itens selecionados')
    }  
  
    const userConfirmed = confirm(`Deletar ${selectionModel.length} produtos? Essa ação é irrevessível`)

    if (userConfirmed) {
      selectionModel.map(async (item) => {
        await handleDelete(item)
      })
    }
  }

  return (
    <div className='MyProducts'>
        <div className='container'>
            <div className='options'>
              <button onClick={() => {navigate("/nova-postagem")}}>Adicionar Produto</button>
              <button onClick={deleteItems}>Deletar Selecionados</button>
            </div>
            <div className='tableContainer' style={{width: '100%', color: 'white'}}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                // onSelectionModelChange={handleSelectionModelChange}
                // selectionModel={selectionModel}
                onRowSelectionModelChange={(newRowSelectionModel) => { //Pegando itens selecionados
                  setSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={selectionModel}
                getRowHeight={() => 120} //altura da linha
                sx={{
                  '& .MuiDataGrid-cell': {
                    color: 'white', //Cor texto linha
                  },
                  '& .MuiDataGrid-row': {
                    backgroundColor: '#333', // Cor de fundo das linhas
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#444', // Cor de fundo do cabeçalho
                    color: 'black', // Cor do texto do cabeçalho
                  },
                  '& .MuiCheckbox-root': {
                    color: 'white !important', // Cor da caixa de seleção
                  },
                  '& .MuiTablePagination-root': {
                    color: 'white', // Cor do texto "Rows per page:"
                  },
                  '& .MuiTablePagination-selectLabel': {
                    color: 'white', // Cor do texto "Rows per page:"
                  },
                  '& .MuiTablePagination-input': {
                    color: 'white', // Cor do texto dentro do dropdown
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white', // Cor dos ícones, como as setas de paginação e o ícone de seleção de linhas
                  },
                  '& .MuiTablePagination-selectIcon': {
                    color: 'white', // Cor do ícone de seleção do dropdown de "Rows per page"
                  },
                }}
              />
            </div>
            {/* </div> */}
        </div>
    </div>
  );
}

export default MyProducts;