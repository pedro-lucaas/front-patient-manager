import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import HomeDashboard from "../layout/HomeDashboard/HomeDashboard";
import SignDashboard from "../layout/SignDashboard/SignDashboard";
import Schedule from "../pages/Schedule/Schedule";
import { EditPatient, NewPatient } from "../pages/PatientForm";
import { Profile } from "../pages/Profile";
import { Login } from "../pages/Sign";
import { MedicalRecords } from "../pages/MedicalRecords";
import { MedicalRecord } from "../pages/MedicalRecord";
import routes from "./routes";
import { Home } from "../pages/Home";

export default function Router() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeDashboard children={
                    <Outlet />
                } />}>
                    <Route path={routes.HOME} element={<Home />} />
                    <Route path={routes.PROFILE} element={<Profile />} />
                    <Route path={routes.SCHEDULE} element={<Schedule />} />
                    <Route path={routes.MEDICAL_RECORDS} element={<MedicalRecords />} />
                    <Route path={routes.MEDICAL_RECORD} element={<MedicalRecord />} />
                    <Route path={routes.NEWPATIENT} element={<NewPatient />} />
                    <Route path={routes.PATIENT} element={<EditPatient />} />
                </Route>
                <Route path={"*"} element={<Navigate to={routes.SCHEDULE} />} />
                <Route path="/" element={<SignDashboard children={<Outlet />} />}>
                    <Route path={routes.LOGIN} element={<Login />} />
                </Route>
            </Routes>
        </>
    );
}
