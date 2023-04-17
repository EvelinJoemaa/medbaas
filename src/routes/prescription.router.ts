import express from "express";
import { Prescription} from "../entities/Prescription";
import dataSource from "../datasource";

const router = express.Router();
//
// interface PrescriptionsParams {
//     dosage: number;
//     duration: number;
//     refillable: boolean;
//     numberOfRefills?: number;
//     refillSize?: number;
//     reason?: string;
//     patientID: number;
//     doctorID: number;
//     datePrescribed: number;
// }
//
// interface UpdatePrescriptionsParams {
//     dosage?: number;
//     duration?: number;
//     refillable?: boolean;
//     numberOfRefills?: number;
//     refillSize?: number;
//     reason?: string;
//     patientID?: number;
//     doctorID?: number;
//     datePrescribed?: number;
// }
//
// router.get("/", async (req, res) => {
//     try {
//         // küsi retsepte andmebaasist
//         const prescriptions = await dataSource.getRepository(Prescriptions).find({ relations: ['patientID', 'doctorID'] });
//
//         if (await Prescriptions.count() === 0) {
//             return res.status(404).json({ error: "No prescriptions currently exists!" });
//         }
//
//         // vasta retseptide kogumikuga JSON formaadis
//         return res.status(200).json({ data: prescriptions });
//     } catch (error) {
//         console.log("ERROR", { message: error });
//
//         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
//         return res.status(500).json({ message: "Could not fetch prescriptions!" });
//     }
// });
//
// router.get("/:id", async (req, res) => {
//     try {
//         const { id }  = req.params;
//
//         const prescription = await dataSource
//             .getRepository(Prescriptions)
//             .findOne({ where:{prescriptionID: parseInt(id)}, relations: ['patientID', 'doctorID'] });
//
//         if (!prescription) {
//             return res.status(404).json({ message: `PrescriptionID: ${id} does not exist!` });
//         }
//
//         return res.status(200).json({ data: prescription });
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
// //         const { dosage, duration, refillable, numberOfRefills, refillSize, reason, patientID, doctorID, datePrescribed } = req.body as PrescriptionsParams;
// //
// //         // validate & sanitize
// //         if (!dosage || !duration || !refillable || !patientID || !doctorID || !datePrescribed) {
// //             return res
// //                 .status(400)
// //                 .json({ error: "Prescription has to have a valid dosage, duration, refillable, patientID, doctorID and datePrescribed!" });
// //         }
// //
// //         // create new patient with given parameters
// //         const prescription = Prescriptions.create({
// //             dosage: dosage ?? 0,
// //             duration: duration ?? 0,
// //             refillable: refillable ?? false,
// //             numberOfRefills: numberOfRefills ?? 0,
// //             refillSize: refillSize ?? 0,
// //             reason: reason ?? "",
// //             patientID: patientID ?? 0,
// //             doctorID: doctorID ?? 0,
// //             datePrescribed: datePrescribed ?? 0,
// //         });
// //
// //         // save patient to database
// //         const result = await dataSource.getRepository(Prescriptions).save(prescription);
// //         return res.status(200).json({ data: result });
// //
// //     } catch (error) {
// //         console.log("ERROR", { message: error });
// //
// //         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
// //         return res.status(500).json({ message: "Could not fetch prescriptions!" });
// //     }
// // });
// //
// // router.put("/:id", async (req, res) => {
// //     try {
// //
// //         const { id } = req.params;
// //         const { dosage, duration, refillable, numberOfRefills, refillSize, reason, patientID, doctorID, datePrescribed } = req.body as UpdatePrescriptionsParams;
// //
// //         const prescription = await dataSource
// //             .getRepository(Prescriptions)
// //             .findOneBy({ prescriptionID: parseInt(id) });
// //
// //         // validate & sanitize
// //         if (!prescription) {
// //             return res.status(404).json({ error: `PrescriptionID: ${id} does not exist!` });
// //         }
// //
// //         prescription.dosage = dosage ? dosage : prescription.dosage;
// //         prescription.duration = duration ? duration : prescription.duration;
// //         prescription.refillable = refillable ? refillable : prescription.refillable;
// //         prescription.numberOfRefills = numberOfRefills ? numberOfRefills : prescription.numberOfRefills;
// //         prescription.refillSize = refillSize ? refillSize : prescription.refillSize;
// //         prescription.reason = reason ? reason : prescription.reason;
// //         prescription.patientID = patientID ? patientID : prescription.patientID;
// //         prescription.doctorID = doctorID ? doctorID : prescription.doctorID;
// //         prescription.datePrescribed = datePrescribed ? datePrescribed : prescription.datePrescribed;
// //
// //         //salvestame muudatused andmebaasi
// //         const result = await prescription.save();
// //
// //         // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
// //         return res.status(200).json({ data: result });
// //     } catch (error) {
// //         console.log("ERROR", { message: error });
// //
// //         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
// //         return res.status(500).json({ message: "Could not update prescriptions!" });
// //     }
// // });
// //
// router.delete("/:id", async(req, res) => {
//     try {
//         const { id } = req.params;
//
//         const prescription = await dataSource
//             .getRepository(Prescriptions)
//             .findOne({ where:{prescriptionID: parseInt(id)}, relations: ['patientID', 'doctorID'] });
//
//         if (!prescription) {
//             return res.status(404).json({ error: `PrescriptionID: ${id} does not exist!` });
//         }
//
//         const result = await Prescriptions.remove(prescription);
//
//         // tagastame igaks juhuks kustutatud andmed
//         return res.status(200).json({ data: req.params, result });
//     } catch (error) {
//         console.log("ERROR", { message: error });
//
//         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
//         return res.status(500).json({ message: "Could not update prescriptions!" });
//     }
// });
//
export default router;