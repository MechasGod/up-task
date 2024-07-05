import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from './layouts/main/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';

export const Router = () => {
  return (
    <div className="bg-slate-100">
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} index/>
            <Route path="/projects/create" element={<CreateProjectPage />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
