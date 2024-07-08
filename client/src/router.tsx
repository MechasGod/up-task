import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from './layouts/main/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';
import { EditProjectPage } from './pages/EditProject';

export const Router = () => {
  return (
    <div className="bg-slate-100">
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} index/>
            <Route path="/projects/create" element={<CreateProjectPage />}/>
            <Route path="/projects/:projectId/edit" element={<EditProjectPage />}/>

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
