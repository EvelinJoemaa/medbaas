import express from "express";
import { Drug } from "../entities/Drug";
import dataSource from "../datasource";

const router = express.Router();

interface DrugParams {
    drugName: string;
    drugPurpose: string;
    drugUse: string;
    sideEffects: string;
}

router.get("/", async (req, res) => {
    try {
        // küsi ravimit andmebaasist
        const drugs = await dataSource.getRepository(Drug).find();

        if (await Drug.count() === 0) {
            return res.status(404).json({ error: "No drugs currently exists!" });
        }

        // vasta ravimite kogumikuga JSON formaadis
        return res.status(200).json({ data: drugs });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch drugs!" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id }  = req.params;

        const drug = await dataSource
            .getRepository(Drug)
            .findOneBy({ drugID: parseInt(id) });

        if (!drug) {
            return res.status(404).json({ message: `DrugID: ${id} does not exist!` });
        }

        return res.status(200).json({ data: drug });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch drugs!" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { drugName, drugPurpose, drugUse, sideEffects } = req.body as DrugParams;

        // validate & sanitize
        if (!drugName.trim() || !drugPurpose.trim() || !drugUse.trim() || !sideEffects.trim()) {
            return res
                .status(400)
                .json({ error: "Drug has to have a valid name, purpose, use and side effects!" });
        }

        // create new drug with given parameters
        const drug = Drug.create({
            drugName: drugName.trim() ?? "",
            drugPurpose: drugPurpose.trim() ?? "",
            drugUse: drugUse.trim() ?? "",
            sideEffects: sideEffects.trim() ?? "",
        });

        // save drug to database
        const result = await dataSource.getRepository(Drug).save(drug);
        return res.status(200).json({ data: result });

    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch drugs!" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { drugName, drugPurpose, drugUse, sideEffects } = req.body as DrugParams;

        const drug = await dataSource
            .getRepository(Drug)
            .findOneBy({ drugID: parseInt(id) });

        // validate & sanitize
        if (!drug) {
            return res.status(404).json({ error: `DrugID: ${id} does not exist!` });
        }
        if (!drugName.trim() || !drugPurpose.trim() || !drugUse.trim() || !sideEffects.trim()) {
            return res
                .status(400)
                .json({ error: "Drug has to have a valid name, purpose, use and side effects!" });
        }

        drug.drugName = drugName ? drugName : drug.drugName;
        drug.drugPurpose = drugPurpose ? drugPurpose : drug.drugPurpose;
        drug.drugUse = drugUse ? drugUse : drug.drugUse;
        drug.sideEffects = sideEffects ? sideEffects : drug.sideEffects;

        //salvestame muudatused andmebaasi
        const result = await drug.save();

        // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update drugs!" });
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const drug = await dataSource
            .getRepository(Drug)
            .findOneBy({ drugID: parseInt(id) });

        if (!drug) {
            return res.status(404).json({ error: `DrugID: ${id} does not exist!` });
        }

        const result = await Drug.remove(drug);

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: req.params, result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update drugs!" });
    }
});

export default router;