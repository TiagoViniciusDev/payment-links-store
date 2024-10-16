import Home from "./Pages/Home/Home.jsx"
import SingIn from "./Pages/SingIn/SingIn.jsx"
import SingUp from "./Pages/SingUp/SingUp.jsx"
import Profile from "./Pages/Profile/Profile.jsx"
import NewPost from "./Pages/newPost/NewPost.jsx"
import MyProducts from "./Pages/MyProducts/MyProducts.jsx"
import Product from "./Pages/Product/Product.jsx"
import Search from "./Pages/Search/Search.jsx"

import Layout from "./Components/Layout/Layout.jsx"
import LayoutAdmin from "./Components/LayoutAdmin/LayoutAdmin.jsx"
import ProductsAdm from "./Pages/ProductsAdm/ProductsAdm.jsx"
import CategoriesAdm from "./Pages/CategoriesAdm/CategoriesAdm.jsx"
import UsersAdm from "./Pages/UsersAdm/UsersAdm.jsx"
import BannersAdm from "./Pages/BannersAdm/BannersAdm.jsx"
import Loading from "./Components/Loading/Loading.jsx"

import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {

  return (
    <BrowserRouter>
      <Loading />
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path="/entrar" element={<SingIn />}/>
          <Route path="/registrar" element={<SingUp />}/>
          <Route path="/perfil" element={<Profile />}/>
          <Route path="/nova-postagem" element={<NewPost />}/>
          <Route path="/meus-produtos" element={<MyProducts />}/>
          <Route path="/produto/:id" element={<Product />}/>
          <Route path="/buscar" element={<Search />}/>
        </Route>

        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<ProductsAdm />}/>
          <Route path="categorias" element={<CategoriesAdm />}/>
          <Route path="usuários" element={<UsersAdm />}/>
          <Route path="banners" element={<BannersAdm />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
