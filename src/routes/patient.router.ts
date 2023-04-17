import express from "express";
import { Patient } from "../entities/Patient";
import dataSource from "../datasource";

const router = express.Router();
//
// interface PatientsParams {
//     name: string;
//     address: string;
//     phoneNumber: number;
//     email?: string;
//     insuranceHolderID?: number;
//     insuranceID: number;
//     doctorID: number;
// }
//
// interface UpdatePatientsParams {
//     name?: string;
//     address?: string;
//     phoneNumber?: number;
//     email?: string;
//     insuranceHolderID?: number;
//     insuranceID?: number;
//     doctorID?: number;
// }
//
// router.get("/", async (req, res) => {
//     try {
//         // küsi patsiente andmebaasist
//         const patients = await dataSource.getRepository(Patients).find({ relations: ['insuranceID', 'doctorID'] });
//
//         if (await Patients.count() === 0) {
//             return res.status(404).json({ error: "No patients currently exists!" });
//         }
//
//         // vasta patsientide kogumikuga JSON formaadis
//         return res.status(200).json({ data: patients });
//     } catch (error) {
//         console.log("ERROR", { message: error });
//
//         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
//         return res.status(500).json({ message: "Could not fetch patients!" });
//     }
// });
//
// router.get("/:id", async (req, res) => {
//     try {
//         const { id }  = req.params;
//
//         const patient = await dataSource
//             .getRepository(Patients)
//             .findOne({ where:{patientID: parseInt(id)}, relations: ['insuranceID', 'doctorID'] });
//
//         if (!patient) {
//             return res.status(404).json({ message: `PatientID: ${id} does not exist!` });
//         }
//
//         return res.status(200).json({ data: patient });
//     } catch (error) {
//         console.log("ERROR", { message: error });
//
//         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
//         return res.status(500).json({ message: "Could not fetch patients!" });
//     }
// });
//
// // router.post("/", async (req, res) => {
// //     try {
// //         const { name, address, phoneNumber, email, insuranceHolderID, insuranceID, doctorID } = req.body as PatientsParams;
// //
// //         // validate & sanitize
// //         if (!name.trim() || !address.trim() || !phoneNumber ) {
// //             return res
// //                 .status(400)
// //                 .json({ error: "Patient has to have a valid patientID, name, address and phoneNumber!" });
// //         }
// //
// //         // create new patient with given parameters
// //         const patient = Patients.create({
// //             name: name ?? "",
// //             address: address ?? "",
// //             phoneNumber: phoneNumber ?? 0,
// //             email: email ?? "",
// //             insuranceHolderID: insuranceHolderID ?? 0,
// //             insuranceID: insuranceID ?? 0,
// //             doctorID: doctorID ?? 0
// //         });
// //
// //         // save patient to database
// //         const result = await dataSource.getRepository(Patients).save(patient);
// //         return res.status(200).json({ data: result });
// //
// //     } catch (error) {
// //         console.log("ERROR", { message: error });
// //
// //         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
// //         return res.status(500).json({ message: "Could not fetch patients!" });
// //     }
// // });
// //
// // router.put("/:id", async (req, res) => {
// //     try {
// //
// //         const { id } = req.params;
// //         const { name, address, phoneNumber, email, insuranceHolderID, insuranceID, doctorID } = req.body as UpdatePatientsParams;
// //
// //         const patient = await dataSource
// //             .getRepository(Patients)
// //             .findOneBy({ patientID: parseInt(id) });
// //
// //         // validate & sanitize
// //         if (!patient) {
// //             return res.status(404).json({ error: `PatientID: ${id} does not exist!` });
// //         }
// //
// //         patient.name = name ? name : patient.name;
// //         patient.address = address ? address : patient.address;
// //         patient.phoneNumber = phoneNumber ? phoneNumber : patient.phoneNumber;
// //         patient.email = email ? email : patient.email;
// //         patient.insuranceHolderID = insuranceHolderID ? insuranceHolderID : patient.insuranceHolderID;
// //         patient.insuranceID = insuranceID ? insuranceID : patient.insuranceID;
// //         patient.doctorID = doctorID ? doctorID : patient.doctorID;
// //
// //         //salvestame muudatused andmebaasi
// //         const result = await patient.save();
// //
// //         // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
// //         return res.status(200).json({ data: result });
// //     } catch (error) {
// //         console.log("ERROR", { message: error });
// //
// //         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
// //         return res.status(500).json({ message: "Could not update patients!" });
// //     }
// // });
// //
// // router.delete("/:id", async(req, res) => {
// //     try {
// //         const { id } = req.params;
// //
// //         const patient = await dataSource
// //             .getRepository(Patients)
// //             .findOneBy({ patientID: parseInt(id) });
// //
// //         if (!patient) {
// //             return res.status(404).json({ error: `PatientID: ${id} does not exist!` });
// //         }
// //
// //         const result = await OfficeVisits.remove(patient);
// //
// //         // tagastame igaks juhuks kustutatud andmed
// //         return res.status(200).json({ data: req.params, result });
// //     } catch (error) {
// //         console.log("ERROR", { message: error });
// //
// //         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
// //         return res.status(500).json({ message: "Could not update patients!" });
// //     }
// // });
//
export default router;