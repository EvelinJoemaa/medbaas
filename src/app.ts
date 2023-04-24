import express from "express";
import doctorsRouter from "./routes/doctor.router";
import drugsRouter from "./routes/drug.router";
import hospitalsRouter from "./routes/hospital.router";
import hospitalAffiliationsRouter from "./routes/hospitalAffiliation.router";
import insurancesRouter from "./routes/insurance.router";
import officeVisitsRouter from "./routes/officeVisit.router";
import patientsRouter from "./routes/patient.router";
import prescriptionsRouter from "./routes/prescription.router";
import primaryDoctorHistoryRouter from "./routes/primaryDoctorHistory.router";

const app = express();

// Add Swagger UI
const swaggerUi = require('swagger-ui-express');
const yamlJs = require('yamljs');
const swaggerDocument = yamlJs.load('./swagger.yml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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