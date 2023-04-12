import express from "express";
import dataSource from "./datasource";
import { Insurances } from "./entities/Insurance";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET - info päring (kõik kindlustused)
app.get("/api/insurances", async (req, res) => {
    try {
        // küsi kindlustused andmebaasist
        const insurances = await dataSource.getRepository(Insurances).find();

        // vasta kindlustuste kogumikuga JSON formaadis
        return res.status(200).json({ data: insurances });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch insurances" });
    }
});

// GET - info päring (üksik kindlustus)
app.get("/api/insurances/:id", async (req, res) => {
    try {
        const { id }  = req.params;

        const insurances = await dataSource
            .getRepository(Insurances)
            .findOneBy({ InsuranceID: parseInt(id) });

        return res.status(200).json({ data: insurances });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch insurances" });
    }
});

// POST - saadab kindlustuse infot
app.post("/api/insurances", async (req, res) => {
    try {
        const { InsuranceCompanyName } = req.body;

        // validate & sanitize
        if (!InsuranceCompanyName || InsuranceCompanyName === " ") {
            return res
                .status(400)
                .json({ error: "Insurance company has to have a valid name" });
        }

        // create new insurance company with given parameters
        const insurance = dataSource.getRepository(Insurances).create(req.body);

        // save insurance to database
        const result = await dataSource.getRepository(Insurances).save(insurance);
        return res.status(200).json({ data: result });

    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch insurances" });
    }
});

// PUT - uuendab kindlustuse infot
app.put("/api/insurances/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { InsuranceCompanyName } = req.body;

        // validate & sanitize
        if (!InsuranceCompanyName || InsuranceCompanyName === " ") {
            return res
                .status(400)
                .json({ error: "Insurance company has to have a valid name" });
        }

        const insurance = await dataSource
            .getRepository(Insurances)
            .findOneBy({ InsuranceID: parseInt(id) });

        if (!insurance) {
            return res.status(404).json({ error: "Insurance not found" });
        }

        dataSource.getRepository(Insurances).merge(insurance, req.body);

        //salvestame muudatused andmebaasi
        const result = await dataSource.getRepository(Insurances).save(insurance);

        // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update insurances" });
    }
});

// DELETE - kustutamine
app.delete("/api/insurances/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const insurance = await dataSource
            .getRepository(Insurances)
            .findOneBy({ InsuranceID: parseInt(id) });

        if (!insurance) {
            return res.status(404).json({ error: "Insurance not found" });
        }

        const result = await dataSource.getRepository(Insurances).remove(insurance);

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update insurances" });
    }
});

export default app;