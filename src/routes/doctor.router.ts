import express from "express";
import dataSource from "../datasource";
import {Doctor} from "../entities/Doctor";

const router = express.Router();

interface CreateDoctorParams {
    specialty: string;
    hospitals: number;
    phoneNumber: number;
    address: string;
}

interface UpdateDoctorParams {
    specialty?: string;
    hospitals?: number;
    phoneNumber?: number;
    address?: string;
}

// get all doctors
router.get("/", async (req, res) => {
    try {
        // ask doctors from database
        const doctors = await dataSource.getRepository(Doctor).find();

        // if no doctors exists, return 404 error
        if (await Doctor.count() === 0) {
            return res.status(404).json({error: "No doctors currently exists!"});
        }

        // return doctors in JSON format
        return res.status(200).json({data: doctors});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch doctors!"});
    }
});

// get specific doctor
router.get("/:id", async (req, res) => {
    try {
        // get doctor id from request parameters
        const {id} = req.params;

        // ask specific doctor from database
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOneBy({Id: parseInt(id)});

        // validate
        if (!doctor) {
            return res.status(404).json({message: `DoctorId: ${id} does not exist!`});
        }

        // return doctor in JSON format
        return res.status(200).json({data: doctor});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch doctor!"});
    }
});

// create new doctor
router.post("/", async (req, res) => {
    try {
        // get parameters from request body
        const {
            specialty,
            hospitals,
            phoneNumber,
            address
        } = req.body as CreateDoctorParams;

        // validate & sanitize
        if (!specialty.trim() || !hospitals || !phoneNumber || !address.trim()) {
            return res
                .status(400)
                .json({error: "Doctor has to have a valid specialty, hospitals, phone number and address!"});
        }

        // create new doctor with given parameters
        const doctor = Doctor.create({
            specialty: specialty.trim() ?? "",
            hospitals: hospitals ?? 0,
            phoneNumber: phoneNumber ?? 0,
            address: address.trim() ?? "",
        });

        // save doctor to database
        const result = await dataSource.getRepository(Doctor).save(doctor);
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not create new doctor!"});
    }
});

// update specific doctor
router.put("/:id", async (req, res) => {
    try {
        // get doctor id from request parameters
        const {id} = req.params;

        // get parameters from request body
        const {
            specialty,
            hospitals,
            phoneNumber,
            address
        } = req.body as UpdateDoctorParams;

        // ask specific doctor from database
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOneBy({Id: parseInt(id)});

        // validate & sanitize
        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${id} does not exist!`});
        }
        if (specialty?.trim() === "" || hospitals === 0 || phoneNumber === 0 || address?.trim() === "") {
            return res
                .status(400)
                .json({error: "Doctor has to have a valid specialty, hospitals, phone number and address!"});
        }

        // update doctor with given parameters
        doctor.specialty = specialty ? specialty?.trim() : doctor.specialty;
        doctor.hospitals = hospitals ? hospitals : doctor.hospitals;
        doctor.phoneNumber = phoneNumber ? phoneNumber : doctor.phoneNumber;
        doctor.address = address ? address?.trim() : doctor.address;

        // save doctor to database
        const result = await doctor.save();

        // return updated doctor in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not update doctor!"});
    }
});

// delete specific doctor
router.delete("/:id", async (req, res) => {
    try {
        // get doctor id from request parameters
        const {id} = req.params;

        // ask specific doctor from database
        const doctor = await dataSource
            .getRepository(Doctor)
            .findOneBy({Id: parseInt(id)});

        // validate
        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${id} does not exist!`});
        }

        // remove doctor from database
        const result = await Doctor.remove(doctor);

        // return removed doctor in JSON format
        return res.status(200).json({data: req.params, result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not delete doctor!"});
    }
});

export default router;