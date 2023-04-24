import express from "express";
import dataSource from "../datasource";
import {OfficeVisit} from "../entities/OfficeVisit";
import {Patient} from "../entities/Patient";
import {Doctor} from "../entities/Doctor";

const router = express.Router();

interface CreateOfficeVisitsParams {
    patientId: number;
    doctorId: number;
    dateOfVisit: number;
    symptoms?: string;
    initialDiagnosis?: string;
    diagnosisStatus?: string;
    bloodPressure?: number;
    weight?: number;
    height?: number;
    diagnosis?: string;
}

interface UpdateOfficeVisitsParams {
    symptoms?: string;
    initialDiagnosis?: string;
    diagnosisStatus?: string;
    bloodPressure?: number;
    weight?: number;
    height?: number;
    diagnosis?: string;
}

// get all visits
router.get("/", async (req, res) => {
    try {
        // find all visits from database
        const visits = await dataSource
            .getRepository(OfficeVisit)
            .find({relations: ["patient", "doctor"]});

        // validate if visits exists
        if (await OfficeVisit.count() === 0) {
            return res.status(404).json({error: "No visits currently exists!"});
        }

        // return all visits
        return res.status(200).json({data: visits});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch visits!"});
    }
});

// get specific visit by patientId, doctorId and dateOfVisit
router.get("/:patientId/:doctorId/:dateOfVisit", async (req, res) => {
    try {
        // get parameters from request
        const {
            patientId,
            doctorId,
            dateOfVisit
        } = req.params;

        // find visit from database
        const visit = await dataSource
            .getRepository(OfficeVisit)
            .findOne({
                where: {
                    patientId: parseInt(patientId),
                    doctorId: parseInt(doctorId),
                    dateOfVisit: parseInt(dateOfVisit)
                },
                relations: ['patient', 'doctor']
            });

        // validate if visit exists
        if (!visit) {
            return res.status(404).json({message: `VisitId: ${patientId + doctorId + dateOfVisit} does not exist!`});
        }

        // return visit in JSON format
        return res.status(200).json({data: visit});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch visit!"});
    }
});

// create new visit
router.post("/", async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            dateOfVisit,
            symptoms,
            initialDiagnosis,
            diagnosisStatus,
            bloodPressure,
            weight,
            height,
            diagnosis,
        } = req.body as CreateOfficeVisitsParams;

        // validate & sanitize
        if (!patientId || !doctorId || !dateOfVisit || !symptoms?.trim() || !initialDiagnosis?.trim() || !diagnosisStatus?.trim() || bloodPressure === 0 || weight === 0 || height === 0 || !diagnosis?.trim()) {
            return res
                .status(400)
                .json({error: "Office visit has to have a valid patientId, doctorId, date of visit and other parameters!"});
        }

        // check if patientId exists
        const patient = await dataSource.getRepository(Patient).findOne({where: {Id: patientId}});
        if (!patient) {
            return res.status(404).json({error: `PatientId: ${patientId} does not exist!`});
        }

        // check if doctorId exists
        const doctor = await dataSource.getRepository(Doctor).findOne({where: {Id: doctorId}});
        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // check if visit already exists
        const visitExists = await dataSource.getRepository(OfficeVisit).findOne({where: {dateOfVisit: dateOfVisit,}});
        if (visitExists) {
            return res.status(409).json({error: `Visit already exists!`});
        }

        // create new drug with given parameters
        const visit = OfficeVisit.create({
            patientId: patientId ?? 0,
            doctorId: doctorId ?? 0,
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
        const result = await dataSource.getRepository(OfficeVisit).save(visit);

        // return saved visit in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not create new visit!"});
    }
});

// update specific visit
router.put("/:patientId/:doctorId/:dateOfVisit", async (req, res) => {
    try {
        // get parameters from request params
        const {
            patientId,
            doctorId,
            dateOfVisit
        } = req.params;

        // get parameters from request body
        const {
            symptoms,
            initialDiagnosis,
            diagnosisStatus,
            bloodPressure,
            weight,
            height,
            diagnosis
        } = req.body as UpdateOfficeVisitsParams;

        // find visit from database
        const visit = await dataSource
            .getRepository(OfficeVisit)
            .findOneBy({
                patientId: parseInt(patientId),
                doctorId: parseInt(doctorId),
                dateOfVisit: parseInt(dateOfVisit)
            });

        // validate & sanitize
        if (!visit) {
            return res.status(404).json({error: `VisitID: ${patientId + doctorId + dateOfVisit} does not exist!`});
        }
        if (!symptoms?.trim() || !initialDiagnosis?.trim() || !diagnosisStatus?.trim() || bloodPressure === 0 || weight === 0 || height === 0 || !diagnosis?.trim()) {
            return res
                .status(400)
                .json({error: "Office visit has to have a valid patientId, doctorId, date of visit and other parameters!"});
        }

        // update visit with given parameters
        visit.symptoms = symptoms ? symptoms.trim() : visit.symptoms;
        visit.initialDiagnosis = initialDiagnosis ? initialDiagnosis.trim() : visit.initialDiagnosis;
        visit.diagnosisStatus = diagnosisStatus ? diagnosisStatus.trim() : visit.diagnosisStatus;
        visit.bloodPressure = bloodPressure ? bloodPressure : visit.bloodPressure;
        visit.weight = weight ? weight : visit.weight;
        visit.height = height ? height : visit.height;
        visit.diagnosis = diagnosis ? diagnosis.trim() : visit.diagnosis;

        // save updated visit to database
        const result = await visit.save();

        // return updated visit in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not update visit!"});
    }
});

// delete specific visit
router.delete("/:patientId/:doctorId/:dateOfVisit", async (req, res) => {
    try {
        // get parameters from request
        const {
            patientId,
            doctorId,
            dateOfVisit
        } = req.params;

        // find visit from database
        const visit = await dataSource
            .getRepository(OfficeVisit)
            .findOneBy({
                patientId: parseInt(patientId),
                doctorId: parseInt(doctorId),
                dateOfVisit: parseInt(dateOfVisit)
            });

        // validate if visit exists
        if (!visit) {
            return res.status(404).json({error: `VisitId: ${patientId + doctorId + dateOfVisit} does not exist!`});
        }

        // delete visit from database
        const result = await OfficeVisit.remove(visit);

        // return deleted visit in JSON format
        return res.status(200).json({data: req.params, result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not update visits!"});
    }
});

export default router;