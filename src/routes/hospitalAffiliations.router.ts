import express from "express";
import { HospitalAffiliations } from "../entities/HospitalAffiliation";
import dataSource from "../datasource";

const router = express.Router();

interface AffiliationParams {
    dateOfAffiliation: number;
    doctorID: number;
    hospitalID: number;
}

router.get("/", async (req, res) => {
    try {
        // küsi kuuluvust andmebaasist
        const affiliations = await dataSource.getRepository(HospitalAffiliations).find();

        if (await HospitalAffiliations.count() === 0) {
            return res.status(404).json({ error: "No affiliations currently exists!" });
        }

        // vasta kuuluvuste kogumikuga JSON formaadis
        return res.status(200).json({ data: affiliations });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch affiliations!" });
    }
});
//
// router.get("/:id", async (req, res) => {
//     try {
//         const { dateOfAffiliation } = req.params;
//
//         const affiliation = await dataSource
//             .getRepository(HospitalAffiliations)
//             .query(`SELECT * FROM hospital_affiliations WHERE dateOfAffiliation = ${dateOfAffiliation}`);
//
//         if (!affiliation) {
//             return res.status(404).json({ message: `DoctorID: ${dateOfAffiliation} does not exist!` });
//         }
//
//         return res.status(200).json({ data: affiliation });
//     } catch (error) {
//         console.log("ERROR", { message: error });
//
//         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
//         return res.status(500).json({ message: "Could not fetch affiliations!" });
//     }
// });
//
// router.post("/", async (req, res) => {
//     try {
//         const { specialty, hospitals, phoneNumber, address } = req.body as DoctorParams;
//
//         // validate & sanitize
//         if (!specialty.trim() || !hospitals || !phoneNumber || !address.trim()) {
//             return res
//                 .status(400)
//                 .json({ error: "Doctor has to have a valid specialty, hospitals, phone number and address!" });
//         }
//
//         // create new doctor with given parameters
//         const doctor = Doctors.create({
//             specialty: specialty.trim() ?? "",
//             hospitals: hospitals ?? 0,
//             phoneNumber: phoneNumber ?? 0,
//             address: address ?? "",
//         });
//
//         // save doctor to database
//         const result = await dataSource.getRepository(Doctors).save(doctor);
//         return res.status(200).json({ data: result });
//
//     } catch (error) {
//         console.log("ERROR", { message: error });
//
//         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
//         return res.status(500).json({ message: "Could not fetch doctors!" });
//     }
// });
//
// router.put("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { specialty, hospitals, phoneNumber, address } = req.body as DoctorParams;
//
//         const doctor = await dataSource
//             .getRepository(Doctors)
//             .findOneBy({ doctorID: parseInt(id) });
//
//         // validate & sanitize
//         if (!doctor) {
//             return res.status(404).json({ error: `DoctorID: ${id} does not exist!` });
//         }
//         if (!specialty.trim() || !hospitals || !phoneNumber || !address.trim()) {
//             return res
//                 .status(400)
//                 .json({ error: "Doctor has to have a valid specialty, hospitals, phone number and address!" });
//         }
//
//         doctor.specialty = specialty ? specialty : doctor.specialty;
//         doctor.hospitals = hospitals ? hospitals : doctor.hospitals;
//         doctor.phoneNumber = phoneNumber ? phoneNumber : doctor.phoneNumber;
//         doctor.address = address ? address : doctor.address;
//
//         //salvestame muudatused andmebaasi
//         const result = await doctor.save();
//
//         // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
//         return res.status(200).json({ data: result });
//     } catch (error) {
//         console.log("ERROR", { message: error });
//
//         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
//         return res.status(500).json({ message: "Could not update doctors!" });
//     }
// });
//
// router.delete("/:id", async(req, res) => {
//     try {
//         const { id } = req.params;
//
//         const doctor = await dataSource
//             .getRepository(Doctors)
//             .findOneBy({ doctorID: parseInt(id) });
//
//         if (!doctor) {
//             return res.status(404).json({ error: `DoctorID: ${id} does not exist!` });
//         }
//
//         const result = await Doctors.remove(doctor);
//
//         // tagastame igaks juhuks kustutatud andmed
//         return res.status(200).json({ data: result });
//     } catch (error) {
//         console.log("ERROR", { message: error });
//
//         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
//         return res.status(500).json({ message: "Could not update doctors!" });
//     }
// });

export default router;