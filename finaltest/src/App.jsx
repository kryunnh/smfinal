
import { Route, Routes } from 'react-router-dom'
import './App.css'

import List from './pages/list'
import Korean from './pages/Korean'
import Chinese from './pages/Chinese'
import Western from './pages/Western'
import Popular from './pages/Popular'
import Challenge from './pages/Challenge'
import Japanese from './pages/Japanese'
import ListDetail from './pages/ListDetail'
import Home from './pages/Home'
import Layout from './component/Layout'
import Header from './header-footer/header'
import Footer from './header-footer/footer'
import Register from '../public/login/Register'
import Login from '../public/login/Login'


function App() {
  
  return (
      <Routes>
        <Route path="/" element={
          <>
          <Header/>
          <Home />
          <Footer/>
          </>
          }/>
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>}/>
        
       


        { <Route path='/' element={<Layout />}>
        <Route path="List" element={<List />} />
        <Route path="List/:id" element={<ListDetail/>}/> 
        <Route path="Korean" element={<Korean />} />
        <Route path="Japanese" element={<Japanese />} />
        <Route path="Chinese" element={<Chinese />} />
        <Route path="Western" element={<Western />} />
        <Route path="Popular" element={<Popular />} />
        <Route path="Challenge" element={<Challenge />} />
        </Route> }
      </Routes>
  )
}

export default App
