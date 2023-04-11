import { DataSource } from "typeorm";
import { config } from "./config";
import { Doctors } from "./entities/Doctor";
import { Drugs } from "./entities/Drug";
import { Hospitals } from "./entities/Hospital";
import { HospitalAffiliations } from "./entities/HospitalAffiliation";
import { Insurances } from "./entities/Insurance";
import { OfficeVisits } from "./entities/OfficeVisit";
import { Patients } from "./entities/Patient";
import { Prescriptions } from "./entities/Prescription";
import { PrimaryDoctorHistory} from "./entities/PrimaryDoctorHistory";

// andmebaasiühenduse konfguratsioon
const defaultDataSource = new DataSource({
    type: "mysql",
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.db,
    entities: [Doctors, Drugs, Hospitals, HospitalAffiliations, Insurances, OfficeVisits, Patients, Prescriptions, PrimaryDoctorHistory],
    synchronize: true,
});

// kontrollime üle kas andmebaasi ühendust on võimalik luua
defaultDataSource
    .initialize()
    .then(() => {
        console.log("Database initialized...");
    })
    .catch((err) => {
        console.log("Error initializing database", err);
    });

export default defaultDataSource;