import express from "express";
import dataSource from "../datasource";
import {Patient} from "../entities/Patient";
import {Insurance} from "../entities/Insurance";
import {Doctor} from "../entities/Doctor";

const router = express.Router();

interface CreatePatientParams {
    name: string;
    address: string;
    phoneNumber: number;
    email?: string;
    insuranceHolderId?: number;
    insuranceId: number;
    doctorId: number;
}

interface UpdatePatientParams {
    name?: string;
    address?: string;
    phoneNumber?: number;
    email?: string;
    insuranceHolderId?: number;
    insuranceId?: number;
    doctorId?: number;
}

// get all patients
router.get("/", async (req, res) => {
    try {
        // find all patients from database
        const patients = await dataSource
            .getRepository(Patient)
            .find({relations: ['insurance', 'doctor']});

        // validate if patients exists
        if (await Patient.count() === 0) {
            return res.status(404).json({error: "No patients currently exists!"});
        }

        // return patients in JSON format
        return res.status(200).json({data: patients});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch patients!"});
    }
});

// get specific patient
router.get("/:id", async (req, res) => {
    try {
        // get patient id from request parameters
        const {id} = req.params;

        // find patient from database
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: parseInt(id)}, relations: ['insurance', 'doctor']});

        // validate if patient exists
        if (!patient) {
            return res.status(404).json({message: `PatientId: ${id} does not exist!`});
        }

        // return patient in JSON format
        return res.status(200).json({data: patient});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch patient!"});
    }
});

// create new patient
router.post("/", async (req, res) => {
    try {
        // get parameters from request body
        const {
            name,
            address,
            phoneNumber,
            email,
            insuranceHolderId,
            insuranceId,
            doctorId
        } = req.body as CreatePatientParams;

        // validate & sanitize
        if (!name.trim() || !address.trim() || !phoneNumber || email?.trim() === "" || insuranceHolderId === 0 || !insuranceId || !doctorId) {
            return res
                .status(400)
                .json({error: "Patient has to have a valid name, address, phoneNumber and other parameters!"});
        }

        // check if insurance exists
        const insurance = await dataSource
            .getRepository(Insurance)
            .findOne({where: {Id: insuranceId}});

        if (!insurance) {
            return res.status(404).json({error: `InsuranceId: ${insuranceId} does not exist!`});
        }

        // check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // check if insurance holder exists
        const insuranceHolder = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: insuranceHolderId}});

        if (!insuranceHolder) {
            return res.status(404).json({error: `InsuranceHolderId: ${insuranceHolderId} does not exist!`});
        }

        // create new patient
        const patient = new Patient();
        patient.name = name.trim();
        patient.address = address.trim();
        patient.phoneNumber = phoneNumber;
        patient.email = email?.trim();
        patient.insuranceHolderId = insuranceHolderId;
        patient.insurance = insurance;
        patient.doctor = doctor;

        // save to database
        const result = await patient.save();

        // return patient in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not create new patient!"});
    }
});

// update specific patient
router.put("/:id", async (req, res) => {
    try {
        // get patient id from request parameters
        const {id} = req.params;

        // get parameters from request body
        const {
            name,
            address,
            phoneNumber,
            email,
            insuranceHolderId,
            insuranceId,
            doctorId
        } = req.body as UpdatePatientParams;

        // find patient from database
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: parseInt(id)}, relations: ['insurance', 'doctor']});

        // validate & sanitize
        if (!patient) {
            return res.status(404).json({error: `PatientId: ${id} does not exist!`});
        }
        if (name?.trim() === "" || address?.trim() === "" || phoneNumber === 0 || email?.trim() === "") {
            return res.status(400).json({error: "Patient has to have a valid name, address, phoneNumber and other parameters!"});
        }

        // update patient
        patient.name = name ? name.trim() : patient.name;
        patient.address = address ? address.trim() : patient.address;
        patient.phoneNumber = phoneNumber ? phoneNumber : patient.phoneNumber;
        patient.email = email ? email.trim() : patient.email;

        // check if insurance exists
        const insurance = await dataSource
            .getRepository(Insurance)
            .findOne({where: {Id: insuranceId}});

        if (!insurance) {
            return res.status(404).json({error: `InsuranceId: ${insuranceId} does not exist!`});
        }

        // check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // check if insurance holder exists
        const insuranceHolder = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: insuranceHolderId}});

        if (!insuranceHolder) {
            return res.status(404).json({error: `InsuranceHolderId: ${insuranceHolderId} does not exist!`});
        }

        // update patient
        patient.insurance = insurance;
        patient.doctor = doctor;
        patient.insuranceHolderId = insuranceHolderId ? insuranceHolderId : patient.insuranceHolderId;

        // save to database
        const result = await patient.save();

        // return patient in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not update patient!"});
    }
})

// delete specific patient
router.delete("/:id", async (req, res) => {
    try {
        // get patient id from request parameters
        const {id} = req.params;

        // find patient from database
        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: parseInt(id)}, relations: ['insurance', 'doctor']});

        // validate
        if (!patient) {
            return res.status(404).json({error: `PatientId: ${id} does not exist!`});
        }

        // delete patient
        const result = await Patient.remove(patient);

        // return patient in JSON format
        return res.status(200).json({data: req.params, result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not delete patient!"});
    }
});

export default router;