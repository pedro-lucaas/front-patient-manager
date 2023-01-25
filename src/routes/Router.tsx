import { BrowserRouter, Route, Routes, LayoutRouteProps, Outlet } from "react-router-dom";
import { ConfigProvider } from "../context/ConfigProvider";
import HomeDashboard from "../layout/HomeDashboard/HomeDashboard";
import SignDashboard from "../layout/SignDashboard/SignDashboard";
import EditPatient from "../pages/Patients/EditPatient";
import ListPatients from "../pages/Patients/ListPatients";
import NewPatient from "../pages/Patients/NewPatient";
import Profile from "../pages/Profile/Profile";
import Schedule from "../pages/Schedule/Schedule";
import Login from "../pages/Sign/Login";
import routes from "./routes";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeDashboard children={
                    <ConfigProvider>
                        <Outlet />
                    </ConfigProvider>
                } />}>
                    <Route path={routes.HOME} element={<div>home</div>} />
                    <Route path={routes.PROFILE} element={<Profile />} />
                    <Route path={routes.SCHEDULE} element={<Schedule />} />
                    <Route path={routes.PATIENTS} element={<ListPatients />} />
                    <Route path={routes.NEWPATIENT} element={<NewPatient />} />
                    <Route path={routes.PATIENT} element={<EditPatient />} />
                </Route>
                <Route path="/" element={<SignDashboard children={<Outlet />} />}>
                    <Route path={routes.LOGIN} element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
