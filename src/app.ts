import express from "express";
import doctorsRouter from "./routes/doctors.router";
import drugsRouter from "./routes/drugs.router";
import hospitalsRouter from "./routes/hospitals.router";
import hospitalAffiliationsRouter from "./routes/hospitalAffiliations.router";
import insurancesRouter from "./routes/insurances.router";
import officeVisitsRouter from "./routes/officeVisits.router";
import patientsRouter from "./routes/patients.router";
import prescriptionsRouter from "./routes/prescriptions.router";
import primaryDoctorHistoryRouter from "./routes/primaryDoctorHistory.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/doctors", doctorsRouter);
app.use("/api/drugs", drugsRouter);
app.use("/api/hospitals", hospitalsRouter);
app.use("/api/hospitalAffiliations", hospitalAffiliationsRouter);
app.use("/api/insurances", insurancesRouter);
app.use("/api/officeVisits", officeVisitsRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/prescriptions", prescriptionsRouter);
app.use("/api/primaryDoctorHistory", primaryDoctorHistoryRouter);

export default app;