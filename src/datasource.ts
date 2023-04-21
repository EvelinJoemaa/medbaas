import {DataSource} from "typeorm";
import {config} from "./config";
import {Doctor} from "./entities/Doctor";
import {Drug} from "./entities/Drug";
import {Hospital} from "./entities/Hospital";
import {HospitalAffiliation} from "./entities/HospitalAffiliation";
import {Insurance} from "./entities/Insurance";
import {OfficeVisit} from "./entities/OfficeVisit";
import {Patient} from "./entities/Patient";
import {Prescription} from "./entities/Prescription";
import {PrimaryDoctorHistory} from "./entities/PrimaryDoctorHistory";

// andmebaasiühenduse konfguratsioon
const defaultDataSource = new DataSource({
    type: "mysql",
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.db,
    entities: [Doctor, Drug, Hospital, HospitalAffiliation, Insurance, OfficeVisit, Patient, Prescription, PrimaryDoctorHistory],
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