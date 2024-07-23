import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from './layouts/main/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';
import { EditProjectPage } from './pages/EditProject';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { AuthLayout } from './layouts/auth/AuthLayout';
import AuthLoginPage from './pages/Auth/AuthLogin';
import AuthSignupPage from './pages/Auth/AuthSignup';
import AuthConfirmAccPage from './pages/Auth/AuthConfirmAcc';


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
          <Route element={<AuthLayout/>}>
            <Route path="/auth/login" element={<AuthLoginPage />} />
            <Route path="/auth/signup" element={<AuthSignupPage />} />
            <Route path="/auth/confirm-account/:userId" element={<AuthConfirmAccPage />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
