import { BrowserRouter, Routes,Route,Navigate  } from 'react-router-dom';
import Login from "./pages/login";
import Verify from "./pages/verify";
import Boards from "./pages/boards";
import Cards from "./pages/cards";
import Tasks from "./pages/tasks";
function App() {
  return (
    <BrowserRouter> 
        <Routes>
            <Route path='/auth/signup' element={<Login />}/>
            <Route path='/auth/signin' element={<Verify />}/>
            <Route path='/boards' element={<Boards />}/>
            <Route path='/boards/:boardId/cards' element={<Cards />}/>
            <Route path='/boards/:boardId/cards/:cardId/tasks' element={<Cards />}/>
            <Route path='/boards/:boardId/cards/:cardId/tasks/:taskId' element={<Tasks />}/>
            <Route path='*' element={<Navigate to ="/auth/signup" replace />}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
