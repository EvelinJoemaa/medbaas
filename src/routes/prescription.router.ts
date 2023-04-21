import express from "express";
import {Prescription} from "../entities/Prescription";
import dataSource from "../datasource";
import {Drug} from "../entities/Drug";
import {Doctor} from "../entities/Doctor";
import {Patient} from "../entities/Patient";

const router = express.Router();

interface PrescriptionsParams {
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

router.get("/", async (req, res) => {
    try {
        // küsi retsepte andmebaasist
        const prescriptions = await dataSource.getRepository(Prescription).find({relations: ['patient', 'doctor', 'drug']});

        if (await Prescription.count() === 0) {
            return res.status(404).json({error: "No prescriptions currently exists!"});
        }

        // vasta retseptide kogumikuga JSON formaadis
        return res.status(200).json({data: prescriptions});
    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not fetch prescriptions!"});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const prescription = await dataSource
            .getRepository(Prescription)
            .findOne({where: {Id: parseInt(id)}, relations: ['patient', 'doctor', 'drug']});

        if (!prescription) {
            return res.status(404).json({message: `PrescriptionId: ${id} does not exist!`});
        }

        return res.status(200).json({data: prescription});
    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not fetch patients!"});
    }
});

router.post("/", async (req, res) => {
    try {
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
        } = req.body as PrescriptionsParams;

        // validate & sanitize
        if (!datePrescribed || !dosage || !duration || !refillable || !patientId || !drugId || !doctorId) {
            return res
                .status(400)
                .json({error: "Prescription has to have a valid prescribe date, dosage, duration, refill status, patientId, drugId and doctorId!"});
        }

        // Check if patient exists
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: patientId}});

        if (!patient) {
            return res.status(404).json({error: `PatientId: ${patientId} does not exist!`});
        }

        // Check if drug exists
        const drug = await dataSource
            .getRepository(Drug)
            .findOne({where: {Id: drugId}});

        if (!drug) {
            return res.status(404).json({error: `DrugId: ${drugId} does not exist!`});
        }

        // Check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // Create new prescription
        const prescription = new Prescription();
        prescription.datePrescribed = datePrescribed;
        prescription.dosage = dosage;
        prescription.duration = duration;
        prescription.refillable = refillable;
        prescription.numberOfRefills = numberOfRefills;
        prescription.refillSize = refillSize;
        prescription.reason = reason;
        prescription.patient = patient;
        prescription.doctor = doctor;
        prescription.drug = drug;

        // Save to database
        const result = await prescription.save();

        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not fetch patients!"});
    }
});

router.put("/:id", async (req, res) => {
    try {

        const {id} = req.params;
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

        const prescription = await dataSource
            .getRepository(Prescription)
            .findOne({where: {Id: parseInt(id)}, relations: ['patient', 'doctor', 'drug']});

        // validate & sanitize
        if (!prescription) {
            return res.status(404).json({error: `PrescriptionId: ${id} does not exist!`});
        }

        // Check if patient exists
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: patientId}});

        if (!patient) {
            return res.status(404).json({error: `PatientId: ${patientId} does not exist!`});
        }

        // Check if drug exists
        const drug = await dataSource
            .getRepository(Drug)
            .findOne({where: {Id: drugId}});

        if (!drug) {
            return res.status(404).json({error: `DrugId: ${drugId} does not exist!`});
        }

        // Check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // Update prescription
        prescription.datePrescribed = datePrescribed ? datePrescribed : prescription.datePrescribed;
        prescription.dosage = dosage ? dosage : prescription.dosage;
        prescription.duration = duration ? duration : prescription.duration;
        prescription.refillable = refillable ? refillable : prescription.refillable;
        prescription.numberOfRefills = numberOfRefills ? numberOfRefills : prescription.numberOfRefills;
        prescription.refillSize = refillSize ? refillSize : prescription.refillSize;
        prescription.reason = reason ? reason : prescription.reason
        prescription.patient = patientId ? patient : prescription.patient;
        prescription.drug = drugId ? drug : prescription.drug;
        prescription.doctor = doctorId ? doctor : prescription.doctor;

        // Save to database
        const result = await prescription.save();

        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not fetch patients!"});
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const prescription = await dataSource
            .getRepository(Prescription)
            .findOne({where: {Id: parseInt(id)}, relations: ['patient', 'doctor', 'drug']});

        if (!prescription) {
            return res.status(404).json({error: `PrescriptionId: ${id} does not exist!`});
        }

        const result = await prescription.remove();

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({data: req.params, result});
    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not update prescriptions!"});
    }
})

export default router;