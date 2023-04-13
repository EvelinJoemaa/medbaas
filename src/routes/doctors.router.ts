import express from "express";
import { Doctors } from "../entities/Doctor";
import dataSource from "../datasource";

const router = express.Router();

interface DoctorParams {
    specialty: string;
    hospitals: number;
    phoneNumber: number;
    address: string;
}

router.get("/", async (req, res) => {
    try {
        // küsi arste andmebaasist
        const doctors = await dataSource.getRepository(Doctors).find();

        if (await Doctors.count() === 0) {
            return res.status(404).json({ error: "No doctors currently exists!" });
        }

        // vasta arstide kogumikuga JSON formaadis
        return res.status(200).json({ data: doctors });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch doctors!" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id }  = req.params;

        const doctor = await dataSource
            .getRepository(Doctors)
            .findOneBy({ doctorID: parseInt(id) });

        if (!doctor) {
            return res.status(404).json({ message: `DoctorID: ${id} does not exist!` });
        }

        return res.status(200).json({ data: doctor });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch doctors!" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { specialty, hospitals, phoneNumber, address } = req.body as DoctorParams;

        // validate & sanitize
        if (!specialty.trim() || !hospitals || !phoneNumber || !address.trim()) {
            return res
                .status(400)
                .json({ error: "Doctor has to have a valid specialty, hospitals, phone number and address!" });
        }

        // create new doctor with given parameters
        const doctor = Doctors.create({
            specialty: specialty.trim() ?? "",
            hospitals: hospitals ?? 0,
            phoneNumber: phoneNumber ?? 0,
            address: address ?? "",
        });

        // save doctor to database
        const result = await dataSource.getRepository(Doctors).save(doctor);
        return res.status(200).json({ data: result });

    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch doctors!" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { specialty, hospitals, phoneNumber, address } = req.body as DoctorParams;

        const doctor = await dataSource
            .getRepository(Doctors)
            .findOneBy({ doctorID: parseInt(id) });

        // validate & sanitize
        if (!doctor) {
            return res.status(404).json({ error: `DoctorID: ${id} does not exist!` });
        }
        if (!specialty.trim() || !hospitals || !phoneNumber || !address.trim()) {
            return res
                .status(400)
                .json({ error: "Doctor has to have a valid specialty, hospitals, phone number and address!" });
        }

        doctor.specialty = specialty ? specialty : doctor.specialty;
        doctor.hospitals = hospitals ? hospitals : doctor.hospitals;
        doctor.phoneNumber = phoneNumber ? phoneNumber : doctor.phoneNumber;
        doctor.address = address ? address : doctor.address;

        //salvestame muudatused andmebaasi
        const result = await doctor.save();

        // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update doctors!" });
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const doctor = await dataSource
            .getRepository(Doctors)
            .findOneBy({ doctorID: parseInt(id) });

        if (!doctor) {
            return res.status(404).json({ error: `DoctorID: ${id} does not exist!` });
        }

        const result = await Doctors.remove(doctor);

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update doctors!" });
    }
});

export default router;