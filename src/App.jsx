import 'normalize.css'
import './styles/global.css'
import './styles/border.css'
import './styles/base.css'

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'


import Guide from './components/Guide/index.jsx'
import Account from './components/Account/index.jsx'
import Login from './components/Account/Login.jsx'
import Register from './components/Account/Register.jsx'
import Home from './components/Home/index.jsx'
import Search from './components/Search/index.jsx'
import SearchList from './components/SearchList/index.jsx'
import Detail from './components/Detail/index.jsx'
import Category from './components/Category/index.jsx'
import Cart from './components/Cart/index.jsx'
import Order from './components/Order/index.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element:<Guide/>
  },
  {
    path: '/account',
    element: <Account/>,
    children: [
      {
        path: '/account/login',
        element: <Login/>
      },
      {
        path: '/account/register',
        element: <Register/>
      },
    ]
  },
  {
    path: '/home',
    element:<Home />
  },
  {
    path: '/search/:shopId',
    element:<Search />
  },
  {
    path: '/searchList/:shopId/:keyword',
    element:<SearchList />
  },
  {
    path: '/detail/:id',
    element:<Detail />
  },
  {
    path: '/category',
    element:<Category />
  },
  {
    path: '/cart',
    element:<Cart />
  },
  {
    path: '/order/:orderId',
    element:<Order />
  },
  {
    path: '*',
    element:<Home />
  },
])


function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
