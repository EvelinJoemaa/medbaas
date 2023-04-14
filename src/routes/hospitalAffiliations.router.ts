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

router.get("/:id", async (req, res) => {
    try {
        const { id }  = req.params;

        const affiliation = await dataSource
            .getRepository(HospitalAffiliations)
            .findOneBy({ dateOfAffiliation: parseInt(id) });

        if (!affiliation) {
            return res.status(404).json({ message: `Affiliation date: ${id} does not exist!` });
        }

        return res.status(200).json({ data: affiliation });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch affiliations!" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { dateOfAffiliation, doctorID, hospitalID } = req.body as AffiliationParams;

        // validate & sanitize
        if (!dateOfAffiliation || !doctorID || !hospitalID ) {
            return res
                .status(400)
                .json({ error: "Affiliation has to have a valid date, doctorID and hospitalID!" });
        }

        // create new affiliation with given parameters
        const affiliation = HospitalAffiliations.create({
            dateOfAffiliation: dateOfAffiliation ?? 0,
            doctorID: doctorID ?? 0,
            hospitalID: hospitalID ?? 0,
        });

        // save doctor to database
        const result = await dataSource.getRepository(HospitalAffiliations).save(affiliation);
        return res.status(200).json({ data: result });

    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch affiliations!" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { doctorID, hospitalID } = req.body as AffiliationParams;

        const affiliation = await dataSource
            .getRepository(HospitalAffiliations)
            .findOneBy({ dateOfAffiliation: parseInt(id) });

        // validate & sanitize
        if (!affiliation) {
            return res.status(404).json({ error: `Affiliation date: ${id} does not exist!` });
        }
        if ( !doctorID || !hospitalID ) {
            return res
                .status(400)
                .json({ error: "Affiliation has to have a valid date, doctorID and hospitalID!" });
        }

        affiliation.doctorID = doctorID ? doctorID : affiliation.doctorID;
        affiliation.hospitalID = hospitalID ? hospitalID : affiliation.hospitalID;

        //salvestame muudatused andmebaasi
        const result = await affiliation.save();

        // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update affiliations!" });
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const affiliation = await dataSource
            .getRepository(HospitalAffiliations)
            .findOneBy({ dateOfAffiliation: parseInt(id) });

        if (!affiliation) {
            return res.status(404).json({ error: `Affiliation date: ${id} does not exist!` });
        }

        const result = await HospitalAffiliations.remove(affiliation);

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update affiliations!" });
    }
});

export default router;