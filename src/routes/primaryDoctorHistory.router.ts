import express from "express";
import dataSource from "../datasource";
import {PrimaryDoctorHistory} from "../entities/PrimaryDoctorHistory";
import {Doctor} from "../entities/Doctor";
import {Patient} from "../entities/Patient";

const router = express.Router();

interface DocHistoryParams {
    startDate: number;
    doctorName: string;
    patientId: number;
    doctorId: number;
    endDate?: number;
}

interface UpdateDocHistoryParams {
    startDate: number;
    doctorName?: string;
    patientId: number;
    doctorId: number;
    endDate?: number;
}

router.get("/", async (req, res) => {
    try {
        // küsi perearsti ajalugu andmebaasist
        const docHistory = await dataSource.getRepository(PrimaryDoctorHistory).find({relations: ['patient', 'doctor']});

        if (await PrimaryDoctorHistory.count() === 0) {
            return res.status(404).json({error: "No doctor history currently exists!"});
        }

        // vasta ajaloo kogumikuga JSON formaadis
        return res.status(200).json({data: docHistory});
    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not fetch history!"});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const docHistory = await dataSource
            .getRepository(PrimaryDoctorHistory)
            .findOne({where: {startDate: parseInt(id)}, relations: ['patient', 'doctor']});

        if (!docHistory) {
            return res.status(404).json({message: `StartDate: ${id} does not exist!`});
        }

        return res.status(200).json({data: docHistory});
    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not fetch history!"});
    }
});

router.post("/", async (req, res) => {
    try {
        const {startDate, doctorName, doctorId, patientId, endDate} = req.body as DocHistoryParams;

        // validate & sanitize
        if (!startDate || !doctorName || !doctorId || !patientId) {
            return res
                .status(400)
                .json({error: "DocHistory has to have a valid startDate, doctorName, doctorId and patientId!"});
        }

        // Check if patient exists
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: patientId}});

        if (!patient) {
            return res.status(404).json({error: `PatientId: ${patientId} does not exist!`});
        }

        // Check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // Create new history
        const docHistory = new PrimaryDoctorHistory();
        docHistory.startDate = startDate;
        docHistory.doctorName = doctorName;
        docHistory.doctor = doctorId;
        docHistory.patient = patientId;
        docHistory.endDate = endDate;

        // Save to database
        const result = await docHistory.save();

        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not fetch history!"});
    }
});

router.put("/:id", async (req, res) => {
    try {

        const {id} = req.params;
        const {doctorName, doctorId, patientId, endDate} = req.body as UpdateDocHistoryParams;

        if (!doctorName?.trim() || !doctorId || !patientId) {
            return res
                .status(400)
                .json({error: "DocHistory has to have a valid doctorName, doctorId and patientId!"});
        }

        const docHistory = await dataSource
            .getRepository(PrimaryDoctorHistory)
            .findOne({where: {startDate: parseInt(id)}, relations: ['patient', 'doctor']});

        // validate & sanitize
        if (!docHistory) {
            return res.status(404).json({message: `StartDate: ${id} does not exist!`});
        }

        // Check if patient exists
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: patientId}});

        if (!patient) {
            return res.status(404).json({error: `PatientId: ${patientId} does not exist!`});
        }

        // Check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // Update history
        docHistory.doctorName = doctorName ?? docHistory.doctorName;
        docHistory.doctor = doctorId ?? docHistory.doctor;
        docHistory.patient = patientId ?? docHistory.patient;
        docHistory.endDate = endDate ?? docHistory.endDate;

        // Save to database
        const result = await docHistory.save();

        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not fetch history!"});
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const docHistory = await dataSource
            .getRepository(PrimaryDoctorHistory)
            .findOne({where: {startDate: parseInt(id)}, relations: ['patient', 'doctor']});

        if (!docHistory) {
            return res.status(404).json({error: `StartDate: ${id} does not exist!`});
        }

        const result = await PrimaryDoctorHistory.remove(docHistory);

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({data: req.params, result});
    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not update history!"});
    }
});

export default router;