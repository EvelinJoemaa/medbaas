import express from "express";
import { OfficeVisits} from "../entities/OfficeVisit";
import dataSource from "../datasource";

const router = express.Router();

interface OfficeVisitsParams {
    patientID: number;
    doctorID: number;
    dateOfVisit: number;
    symptoms?: string;
    initialDiagnosis?: string;
    diagnosisStatus?: string;
    bloodPressure?: number;
    weight?: number;
    height?: number;
    diagnosis?: string;
}

router.get("/", async (req, res) => {
    try {
        // küsi visiiti andmebaasist
        const visits = await dataSource.getRepository(OfficeVisits).find();

        if (await OfficeVisits.count() === 0) {
            return res.status(404).json({ error: "No visits currently exists!" });
        }

        // vasta visiidi kogumikuga JSON formaadis
        return res.status(200).json({ data: visits });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch visits!" });
    }
});

router.get("/:patientID/:doctorID/:dateOfVisit", async (req, res) => {
    try {
        const { patientID, doctorID, dateOfVisit }  = req.params;

        const visit = await dataSource
            .getRepository(OfficeVisits)
            .findOneBy({ patientID: parseInt(patientID), doctorID: parseInt(doctorID), dateOfVisit: parseInt(dateOfVisit) });

        if (!visit) {
            return res.status(404).json({ message: `VisitID: ${patientID + doctorID + dateOfVisit} does not exist!` });
        }

        return res.status(200).json({ data: visit });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch visits!" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { patientID, doctorID, dateOfVisit, symptoms, initialDiagnosis, diagnosisStatus, bloodPressure, weight, height, diagnosis,  } = req.body as OfficeVisitsParams;

        // validate & sanitize
        if (!patientID || !doctorID || !dateOfVisit) {
            return res
                .status(400)
                .json({ error: "Office visit has to have a valid patientID, doctorID and date of visit!" });
        }

        // create new drug with given parameters
        const visit = OfficeVisits.create({
            patientID: patientID ?? 0,
            doctorID: doctorID ?? 0,
            dateOfVisit: dateOfVisit ?? 0,
            symptoms: symptoms?.trim() ?? "",
            initialDiagnosis: initialDiagnosis?.trim() ?? "",
            diagnosisStatus: diagnosisStatus?.trim() ?? "",
            bloodPressure: bloodPressure ?? 0,
            weight: weight ?? 0,
            height: height ?? 0,
            diagnosis: diagnosis?.trim() ?? "",
        });

        // save visit to database
        const result = await dataSource.getRepository(OfficeVisits).save(visit);
        return res.status(200).json({ data: result });

    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch visits!" });
    }
});

router.put("/:patientID/:doctorID/:dateOfVisit", async (req, res) => {
    try {

        const { patientID, doctorID, dateOfVisit } = req.params;
        const { symptoms, initialDiagnosis, diagnosisStatus, bloodPressure, weight, height, diagnosis } = req.body as OfficeVisitsParams;

        const visit = await dataSource
            .getRepository(OfficeVisits)
            .findOneBy({ patientID: parseInt(patientID), doctorID: parseInt(doctorID), dateOfVisit: parseInt(dateOfVisit) });

        // validate & sanitize
        if (!visit) {
            return res.status(404).json({ error: `VisitID: ${patientID + doctorID + dateOfVisit} does not exist!` });
        }

        visit.symptoms = symptoms ? symptoms : visit.symptoms;
        visit.initialDiagnosis = initialDiagnosis ? initialDiagnosis : visit.initialDiagnosis;
        visit.diagnosisStatus = diagnosisStatus ? diagnosisStatus : visit.diagnosisStatus;
        visit.bloodPressure = bloodPressure ? bloodPressure : visit.bloodPressure;
        visit.weight = weight ? weight : visit.weight;
        visit.height = height ? height : visit.height;
        visit.diagnosis = diagnosis ? diagnosis : visit.diagnosis;

        //salvestame muudatused andmebaasi
        const result = await visit.save();

        // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update visits!" });
    }
});

router.delete("/:patientID/:doctorID/:dateOfVisit", async(req, res) => {
    try {
        const { patientID, doctorID, dateOfVisit } = req.params;

        const visit = await dataSource
            .getRepository(OfficeVisits)
            .findOneBy({ patientID: parseInt(patientID), doctorID: parseInt(doctorID), dateOfVisit: parseInt(dateOfVisit) });

        if (!visit) {
            return res.status(404).json({ error: `VisitID: ${patientID + doctorID + dateOfVisit} does not exist!` });
        }

        const result = await OfficeVisits.remove(visit);

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: req.params, result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update visits!" });
    }
});

export default router;