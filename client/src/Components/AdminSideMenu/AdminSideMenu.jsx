import './AdminSideMenu.css';
import { useEffect } from 'react';

import { BiSolidCategory } from "react-icons/bi";
import { FiBox } from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function AdminSideMenu() {
  
  const {user, setUser} = useContext(UserContext)

  return (
    <div className='AdminSideMenu'>
        <div className='user'>
            <div className='userImg' style={user ? {backgroundImage: `url(${user.avatar})`} : {}}></div>
            <h2>Tiago Vinicius</h2>
        </div>
        <a href='/admin' className='item'>
            <FiBox />
            <p>Produtos</p>
        </a>
        <a href='/admin/categorias' className='item'>
            <BiSolidCategory />
            <p>Categorias</p>
        </a>
        <a href='/admin/usuários' className='item'>
            <FaUsersCog />
            <p>Usuários</p>
        </a>
        <a href='/admin/banners' className='item'>
            <FaRegImage />
            <p>Banners</p>
        </a>
    </div>
  );
}

export default AdminSideMenu;