import React, {lazy} from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"))
const Home = lazy(() => import("./pages/Home"))
const Chat = lazy(() => import("./pages/Chat"))
const Groups = lazy(() => import("./pages/Groups"))

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/groups" element={<Groups />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
