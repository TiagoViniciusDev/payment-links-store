import Home from "./Pages/Home/Home"
import SingIn from "./Pages/SingIn/SingIn"
import SingUp from "./Pages/SingUp/SingUp"
import Profile from "./Pages/Profile/Profile"
import NewPost from "./Pages/newPost/NewPost"
import MyProducts from "./Pages/MyProducts/MyProducts"
import Product from "./Pages/Product/Product"
import Search from "./Pages/Search/Search"

import LayoutAdmin from "./Components/LayoutAdmin/LayoutAdmin"
import ProductsAdm from "./Pages/ProductsAdm/ProductsAdm"
import CategoriesAdm from "./Pages/CategoriesAdm/CategoriesAdm"
import UsersAdm from "./Pages/UsersAdm/UsersAdm"
import BannersAdm from "./Pages/BannersAdm/BannersAdm"
import Loading from "./Components/Loading/Loading"

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from "./Components/Layout/Layout"

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
