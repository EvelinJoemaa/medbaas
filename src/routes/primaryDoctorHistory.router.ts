import express from "express";
import { PrimaryDoctorHistory} from "../entities/PrimaryDoctorHistory";
import dataSource from "../datasource";

const router = express.Router();

interface DocHistoryParams {
    startDate: number;
    patientID: number;
    doctorID: number;
    doctorName: string;
    endDate?: number;
}

interface UpdateDocHistoryParams {
    startDate: number;
    patientID: number;
    doctorID: number;
    doctorName?: string;
    endDate?: number;
}

router.get("/", async (req, res) => {
    try {
        // küsi perearsti ajalugu andmebaasist
        const docHistory = await dataSource.getRepository(PrimaryDoctorHistory).find({ relations: ['patientID', 'doctorID'] });

        if (await PrimaryDoctorHistory.count() === 0) {
            return res.status(404).json({ error: "No doctor history currently exists!" });
        }

        // vasta ajaloo kogumikuga JSON formaadis
        return res.status(200).json({ data: docHistory });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch history!" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id }  = req.params;

        const docHistory = await dataSource
            .getRepository(PrimaryDoctorHistory)
            .findOne({ where:{startDate: parseInt(id)}, relations: ['patientID', 'doctorID'] });

        if (!docHistory) {
            return res.status(404).json({ message: `StartDate: ${id} does not exist!` });
        }

        return res.status(200).json({ data: docHistory });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch history!" });
    }
});

// router.post("/", async (req, res) => {
//     try {
//         const { startDate, patientID, doctorID, doctorName, endDate } = req.body as DocHistoryParams;
//
//         // validate & sanitize
//         if ( !startDate || !patientID || !doctorID || !doctorName.trim()) {
//             return res
//                 .status(400)
//                 .json({ error: `History has to have a valid ${req.params}` });
//         }
//
//         // create new patient with given parameters
//         const docHistory = PrimaryDoctorHistory.create({
//             startDate: startDate ?? 0,
//             patientID: patientID ?? 0,
//             doctorID: doctorID ?? 0,
//             doctorName: doctorName ?? "",
//             endDate: endDate ?? 0,
//         });
//
//         // save history to database
//         const result = await dataSource.getRepository(Patients).save(docHistory);
//         return res.status(200).json({ data: result });
//
//     } catch (error) {
//         console.log("ERROR", { message: error });
//
//         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
//         return res.status(500).json({ message: "Could not fetch history!" });
//     }
// });
//
// router.put("/:id", async (req, res) => {
//     try {
//
//         const { id } = req.params;
//         const { patientID, doctorID, doctorName, endDate } = req.body as UpdateDocHistoryParams;
//
//         const docHistory = await dataSource
//             .getRepository(PrimaryDoctorHistory)
//             .findOne({ where:{startDate: parseInt(id)}, relations: ['patientID', 'doctorID'] });
//
//         // validate & sanitize
//         if (!docHistory) {
//             return res.status(404).json({ error: `StartDate: ${id} does not exist!` });
//         }
//
//         docHistory.patientID = patientID ? patientID : docHistory.patientID;
//         docHistory.doctorID = doctorID ? doctorID : docHistory.doctorID;
//         docHistory.doctorName = doctorName ? doctorName : docHistory.doctorName;
//         docHistory.endDate = endDate ? endDate : docHistory.endDate;
//
//         //salvestame muudatused andmebaasi
//         const result = await docHistory.save();
//
//         // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
//         return res.status(200).json({ data: result });
//     } catch (error) {
//         console.log("ERROR", { message: error });
//
//         // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
//         return res.status(500).json({ message: "Could not update history!" });
//     }
// });

router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const docHistory = await dataSource
            .getRepository(PrimaryDoctorHistory)
            .findOne({ where:{startDate: parseInt(id)}, relations: ['patientID', 'doctorID'] });

        if (!docHistory) {
            return res.status(404).json({ error: `StartDate: ${id} does not exist!` });
        }

        const result = await PrimaryDoctorHistory.remove(docHistory);

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: req.params, result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update history!" });
    }
});

export default router;