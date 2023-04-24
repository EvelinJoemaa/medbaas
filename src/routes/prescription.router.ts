import express from "express";
import dataSource from "../datasource";
import {Prescription} from "../entities/Prescription";
import {Drug} from "../entities/Drug";
import {Doctor} from "../entities/Doctor";
import {Patient} from "../entities/Patient";

const router = express.Router();

interface CreatePrescriptionsParams {
    datePrescribed: number;
    dosage: number;
    duration: number;
    refillable: boolean;
    numberOfRefills?: number;
    refillSize?: number;
    reason?: string;
    patientId: number;
    doctorId: number;
    drugId: number;
}

interface UpdatePrescriptionsParams {
    datePrescribed?: number;
    dosage?: number;
    duration?: number;
    refillable?: boolean;
    numberOfRefills?: number;
    refillSize?: number;
    reason?: string;
    patientId?: number;
    doctorId?: number;
    drugId?: number;
}

// get all prescriptions
router.get("/", async (req, res) => {
    try {
        // fetch all prescriptions from database
        const prescriptions = await dataSource
            .getRepository(Prescription)
            .find({relations: ['patient', 'doctor', 'drug']});

        // validate
        if (await Prescription.count() === 0) {
            return res.status(404).json({error: "No prescriptions currently exists!"});
        }

        // return prescriptions in JSON format
        return res.status(200).json({data: prescriptions});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch prescriptions!"});
    }
});

// get specific prescription
router.get("/:id", async (req, res) => {
    try {
        // get id from request
        const {id} = req.params;

        // fetch prescription from database
        const prescription = await dataSource
            .getRepository(Prescription)
            .findOne({where: {Id: parseInt(id)}, relations: ['patient', 'doctor', 'drug']});

        // validate
        if (!prescription) {
            return res.status(404).json({message: `PrescriptionId: ${id} does not exist!`});
        }

        // return prescription in JSON format
        return res.status(200).json({data: prescription});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch prescription!"});
    }
});

// create new prescription
router.post("/", async (req, res) => {
    try {
        // get data from request
        const {
            datePrescribed,
            dosage,
            duration,
            refillable,
            numberOfRefills,
            refillSize,
            reason,
            patientId,
            drugId,
            doctorId
        } = req.body as CreatePrescriptionsParams;

        // validate & sanitize
        if (!datePrescribed || !dosage || !duration || !refillable || reason?.trim() === "" || !patientId || !drugId || !doctorId) {
            return res
                .status(400)
                .json({error: "Prescription has to have a valid prescribe date, dosage, duration, refill status, patientId, drugId and doctorId!"});
        }

        // check if patient exists
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: patientId}});

        if (!patient) {
            return res.status(404).json({error: `PatientId: ${patientId} does not exist!`});
        }

        // check if drug exists
        const drug = await dataSource
            .getRepository(Drug)
            .findOne({where: {Id: drugId}});

        if (!drug) {
            return res.status(404).json({error: `DrugId: ${drugId} does not exist!`});
        }

        // check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // Create new prescription
        const prescription = new Prescription();
        prescription.datePrescribed = datePrescribed ?? 0;
        prescription.dosage = dosage ?? 0;
        prescription.duration = duration ?? 0;
        prescription.refillable = refillable;
        prescription.numberOfRefills = numberOfRefills ?? 0;
        prescription.refillSize = refillSize ?? 0;
        prescription.reason = reason?.trim() ?? "";
        prescription.patient = patient;
        prescription.doctor = doctor;
        prescription.drug = drug;

        // save to database
        const result = await prescription.save();

        // return created prescription in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not create new prescription!"});
    }
});

// update specific prescription
router.put("/:id", async (req, res) => {
    try {

        // get id from request
        const {id} = req.params;

        // get data from request
        const {
            datePrescribed,
            dosage,
            duration,
            refillable,
            numberOfRefills,
            refillSize,
            reason,
            patientId,
            doctorId,
            drugId
        } = req.body as UpdatePrescriptionsParams;

        // fetch prescription from database
        const prescription = await dataSource
            .getRepository(Prescription)
            .findOne({where: {Id: parseInt(id)}, relations: ['patient', 'doctor', 'drug']});

        // validate & sanitize
        if (!prescription) {
            return res.status(404).json({error: `PrescriptionId: ${id} does not exist!`});
        }

        if (datePrescribed === 0 || dosage === 0 || duration === 0 || numberOfRefills === 0 || refillSize === 0 || reason?.trim() === "") {
            return res
                .status(400)
                .json({error: "Prescription has to have a valid prescribe date, dosage, duration, refill status, patientId, drugId and doctorId!"});
        }

        // check if patient exists
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: patientId}});

        if (!patient) {
            return res.status(404).json({error: `PatientId: ${patientId} does not exist!`});
        }

        // check if drug exists
        const drug = await dataSource
            .getRepository(Drug)
            .findOne({where: {Id: drugId}});

        if (!drug) {
            return res.status(404).json({error: `DrugId: ${drugId} does not exist!`});
        }

        // check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // update prescription
        prescription.datePrescribed = datePrescribed ? datePrescribed : prescription.datePrescribed;
        prescription.dosage = dosage ? dosage : prescription.dosage;
        prescription.duration = duration ? duration : prescription.duration;
        prescription.refillable = refillable ? refillable : prescription.refillable;
        prescription.numberOfRefills = numberOfRefills ? numberOfRefills : prescription.numberOfRefills;
        prescription.refillSize = refillSize ? refillSize : prescription.refillSize;
        prescription.reason = reason ? reason.trim() : prescription.reason
        prescription.patient = patientId ? patient : prescription.patient;
        prescription.drug = drugId ? drug : prescription.drug;
        prescription.doctor = doctorId ? doctor : prescription.doctor;

        // save to database
        const result = await prescription.save();

        // return updated prescription in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not update prescription!"});
    }
})

// delete specific prescription
router.delete("/:id", async (req, res) => {
    try {
        // get id from request
        const {id} = req.params;

        // fetch prescription from database
        const prescription = await dataSource
            .getRepository(Prescription)
            .findOne({where: {Id: parseInt(id)}, relations: ['patient', 'doctor', 'drug']});

        // validate
        if (!prescription) {
            return res.status(404).json({error: `PrescriptionId: ${id} does not exist!`});
        }

        // remove prescription from database
        const result = await prescription.remove();

        // return deleted prescription in JSON format
        return res.status(200).json({data: req.params, result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not delete prescription!"});
    }
})

export default router;