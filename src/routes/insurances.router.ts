import express from "express";
import { Insurances } from "../entities/Insurance";
import dataSource from "../datasource";

const router = express.Router();

// GET - info päring (kõik kindlustused)
router.get("/", async (req, res) => {
    try {
        // küsi kindlustused andmebaasist
        const insurances = await dataSource.getRepository(Insurances).find();

        if (await Insurances.count() === 0) {
            return res.status(404).json({ error: "No insurances currently exists!" });
        }

        // vasta kindlustuste kogumikuga JSON formaadis
        return res.status(200).json({ data: insurances });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch insurances!" });
    }
});

// GET - info päring (üksik kindlustus)
router.get("/:id", async (req, res) => {
    try {
        const { id }  = req.params;

        const insurance = await dataSource
            .getRepository(Insurances)
            .findOneBy({ insuranceID: parseInt(id) });

        if (!insurance) {
            return res.status(404).json({ message: `InsuranceID: ${id} does not exist!` });
        }

        return res.status(200).json({ data: insurance });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch insurances!" });
    }
});

// POST - saadab kindlustuse infot
router.post("/", async (req, res) => {
    try {
        const { insuranceCompanyName } = req.body;

        // validate & sanitize
        if (!insuranceCompanyName.trim()) {
            return res
                .status(400)
                .json({ error: "Insurance company has to have a valid name!" });
        }

        // create new insurance company with given parameters
        const insurance = dataSource.getRepository(Insurances).create(req.body);

        // save insurance to database
        const result = await dataSource.getRepository(Insurances).save(insurance);
        return res.status(200).json({ data: result });

    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch insurances!" });
    }
});

// PUT - uuendab kindlustuse infot
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { insuranceCompanyName } = req.body;

        const insurance = await dataSource
            .getRepository(Insurances)
            .findOneBy({ insuranceID: parseInt(id) });

        // validate & sanitize
        if (!insurance) {
            return res.status(404).json({ error: `InsuranceID: ${id} does not exist!` });
        }

        if (!insuranceCompanyName.trim()) {
            return res
                .status(400)
                .json({ error: "Insurance company has to have a valid name!" });
        }

        dataSource.getRepository(Insurances).merge(insurance, req.body);

        //salvestame muudatused andmebaasi
        const result = await dataSource.getRepository(Insurances).save(insurance);

        // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update insurances!" });
    }
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const insurance = await dataSource
            .getRepository(Insurances)
            .findOneBy({ insuranceID: parseInt(id) });

        if (!insurance) {
            return res.status(404).json({ error: `InsuranceID: ${id} does not exist!` });
        }

        const result = await dataSource.getRepository(Insurances).remove(insurance);

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update insurances!" });
    }
});

export default router;