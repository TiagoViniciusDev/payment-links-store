import './Dashboard.css';

function Dashboard() {
  return (
    <div className='Dashboard'>
        <div className='dashboardItem'>
            <h2>Usuários: 468</h2>
            <ul className='itemInfo'>
                <li>Última semana: 45</li>
                <li>Último mês: 31</li>
            </ul>
        </div>
        <div className='dashboardItem'>
            <h2>Produtos Pendentes: 18</h2>
            <ul className='itemInfo'>
                <li>18 Produtos estão aguardando aprovação</li>
            </ul>
        </div>

        <div className='dashboardItem'>
            <h2>Categorias: 7</h2>
            <ul className='itemInfo'>
                <li>7 Categorias cadastradas</li>
            </ul>
        </div>
    </div>
  );
}

export default Dashboard;