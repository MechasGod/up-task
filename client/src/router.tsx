import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from './layouts/main/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';
import { EditProjectPage } from './pages/EditProject';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';

export const Router = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} index/>
            <Route path="/projects/create" element={<CreateProjectPage />}/>
            <Route path="/projects/:projectId/edit" element={<EditProjectPage />}/>
            <Route path="/projects/:projectId" element={<ProjectDetailsPage />}/>

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
