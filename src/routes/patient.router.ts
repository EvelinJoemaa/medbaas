import express from "express";
import {Patient} from "../entities/Patient";
import dataSource from "../datasource";
import {Insurance} from "../entities/Insurance";
import {Doctor} from "../entities/Doctor";

const router = express.Router();

interface PatientParams {
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

router.get("/", async (req, res) => {
    try {
        // küsi patsiente andmebaasist
        const patients = await dataSource.getRepository(Patient).find({relations: ['insurance', 'doctor']});

        if (await Patient.count() === 0) {
            return res.status(404).json({error: "No patients currently exists!"});
        }

        // vasta patsientide kogumikuga JSON formaadis
        return res.status(200).json({data: patients});
    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not fetch patients!"});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: parseInt(id)}, relations: ['insurance', 'doctor']});

        if (!patient) {
            return res.status(404).json({message: `PatientId: ${id} does not exist!`});
        }

        return res.status(200).json({data: patient});
    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not fetch patients!"});
    }
});

router.post("/", async (req, res) => {
    try {
        const {name, address, phoneNumber, email, insuranceHolderId, insuranceId, doctorId} = req.body as PatientParams;

        // validate & sanitize
        if (!name.trim() || !address.trim() || !phoneNumber) {
            return res
                .status(400)
                .json({error: "Patient has to have a valid name, address and phoneNumber!"});
        }

        // Check if insurance exists
        const insurance = await dataSource
            .getRepository(Insurance)
            .findOne({where: {Id: insuranceId}});

        if (!insurance) {
            return res.status(404).json({error: `InsuranceId: ${insuranceId} does not exist!`});
        }

        // Check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // Create new patient
        const patient = new Patient();
        patient.name = name;
        patient.address = address;
        patient.phoneNumber = phoneNumber;
        patient.email = email;
        patient.insuranceHolderId = insuranceHolderId;
        patient.insurance = insurance;
        patient.doctor = doctor;

        // Save to database
        const result = await patient.save();

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
            name,
            address,
            phoneNumber,
            email,
            insuranceHolderId,
            insuranceId,
            doctorId
        } = req.body as UpdatePatientParams;

        const patient = await dataSource
            .getRepository(Patient)
            .findOne({where: {Id: parseInt(id)}, relations: ['insurance', 'doctor']});

        // validate & sanitize
        if (!patient) {
            return res.status(404).json({error: `PatientId: ${id} does not exist!`});
        }

        patient.name = name ? name : patient.name;
        patient.address = address ? address : patient.address;
        patient.phoneNumber = phoneNumber ? phoneNumber : patient.phoneNumber;
        patient.email = email ? email : patient.email;
        patient.insuranceHolderId = insuranceHolderId ? insuranceHolderId : patient.insuranceHolderId;

        // Check if insurance exists
        const insurance = await dataSource
            .getRepository(Insurance)
            .findOne({where: {Id: insuranceId}});

        if (!insurance) {
            return res.status(404).json({error: `InsuranceId: ${insuranceId} does not exist!`});
        }

        // Check if doctor exists
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOne({where: {Id: doctorId}});

        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        patient.insurance = insurance;
        patient.doctor = doctor;

        // Save to database
        const result = await patient.save();

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

        const patient = await dataSource
            .getRepository(Patient)
            .findOneBy({Id: parseInt(id)});

        if (!patient) {
            return res.status(404).json({error: `PatientId: ${id} does not exist!`});
        }

        const result = await Patient.remove(patient);

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({data: req.params, result});
    } catch (error) {
        console.log("ERROR", {message: error});

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({message: "Could not update patients!"});
    }
});

export default router;