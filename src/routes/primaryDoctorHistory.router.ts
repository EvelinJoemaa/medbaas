import express from "express";
import dataSource from "../datasource";
import {PrimaryDoctorHistory} from "../entities/PrimaryDoctorHistory";
import {Doctor} from "../entities/Doctor";
import {Patient} from "../entities/Patient";

const router = express.Router();

interface CreateDocHistoryParams {
    startDate: number;
    doctorName: string;
    patientId: number;
    doctorId: number;
    endDate?: number;
}

interface UpdateDocHistoryParams {
    doctorName?: string;
    patientId?: number;
    doctorId?: number;
    endDate?: number;
}

// get all doctor histories
router.get("/", async (req, res) => {
    try {
        // find all doctor histories
        const docHistory = await dataSource
            .getRepository(PrimaryDoctorHistory)
            .find({relations: ['patient', 'doctor']});

        // validate if any doctor histories exist
        if (await PrimaryDoctorHistory.count() === 0) {
            return res.status(404).json({error: "No doctor history currently exists!"});
        }

        // return all doctor histories in JSON format
        return res.status(200).json({data: docHistory});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch histories!"});
    }
});

// get specific doctor history
router.get("/:id", async (req, res) => {
    try {
        // get id from request
        const {id} = req.params;

        // find doctor history by id
        const docHistory = await dataSource
            .getRepository(PrimaryDoctorHistory)
            .findOne({where: {startDate: parseInt(id)}, relations: ['patient', 'doctor']});

        // validate if doctor history exists
        if (!docHistory) {
            return res.status(404).json({message: `StartDate: ${id} does not exist!`});
        }

        // return doctor history in JSON format
        return res.status(200).json({data: docHistory});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch history!"});
    }
});

// create new doctor history
router.post("/", async (req, res) => {
    try {
        // get data from request
        const {
            startDate,
            doctorName,
            doctorId,
            patientId,
            endDate
        } = req.body as CreateDocHistoryParams;

        // validate & sanitize
        if (!startDate || startDate === 0 || !doctorName.trim() || !doctorId || !patientId || endDate === 0 || endDate && endDate < startDate) {
            return res
                .status(400)
                .json({error: "DocHistory has to have a valid startDate, doctorName, doctorId and patientId!"});
        }

        // check if patient exists
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: patientId}});

        if (!patient) {
            return res.status(404).json({error: `PatientId: ${patientId} does not exist!`});
        }

        // check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // create new history
        const docHistory = new PrimaryDoctorHistory();
        docHistory.startDate = startDate;
        docHistory.doctorName = doctorName.trim();
        docHistory.doctor = doctor;
        docHistory.patient = patient;
        docHistory.endDate = endDate;

        // save to database
        const result = await docHistory.save();

        // return created history in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not create new history!"});
    }
});

// update specific doctor history
router.put("/:id", async (req, res) => {
    try {
        // get id from request
        const {id} = req.params;

        // get data from request
        const {
            doctorName,
            doctorId,
            patientId,
            endDate
        } = req.body as UpdateDocHistoryParams;

        // validate & sanitize
        if (!doctorName?.trim() || endDate === 0 || endDate && endDate < parseInt(id)) {
            return res
                .status(400)
                .json({error: "DocHistory has to have a valid doctorName, doctorId, patientId and endDate!"});
        }

        // find doctor history by id
        const docHistory = await dataSource
            .getRepository(PrimaryDoctorHistory)
            .findOne({where: {startDate: parseInt(id)}, relations: ['patient', 'doctor']});

        // validate
        if (!docHistory) {
            return res.status(404).json({message: `StartDate: ${id} does not exist!`});
        }

        // check if patient exists
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: patientId}});

        if (!patient) {
            return res.status(404).json({error: `PatientId: ${patientId} does not exist!`});
        }

        // check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // update history
        docHistory.doctorName = doctorName?.trim();
        docHistory.doctor = doctor;
        docHistory.patient = patient;
        docHistory.endDate = endDate ?? 0;

        // save to database
        const result = await docHistory.save();

        // return updated history in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not update history!"});
    }
})

// delete specific doctor history
router.delete("/:id", async (req, res) => {
    try {
        // get id from request
        const {id} = req.params;

        // find doctor history by id
        const docHistory = await dataSource
            .getRepository(PrimaryDoctorHistory)
            .findOne({where: {startDate: parseInt(id)}, relations: ['patient', 'doctor']});

        // validate
        if (!docHistory) {
            return res.status(404).json({error: `StartDate: ${id} does not exist!`});
        }

        // delete from database
        const result = await PrimaryDoctorHistory.remove(docHistory);

        // return deleted history in JSON format
        return res.status(200).json({data: req.params, result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not delete history!"});
    }
});

export default router;