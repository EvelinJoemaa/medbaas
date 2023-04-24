import express from "express";
import dataSource from "../datasource";
import {Drug} from "../entities/Drug";

const router = express.Router();

interface CreateDrugParams {
    drugName: string;
    drugPurpose: string;
    drugUse: string;
    sideEffects: string;
}

interface UpdateDrugParams {
    drugName?: string;
    drugPurpose?: string;
    drugUse?: string;
    sideEffects?: string;
}

// get all drugs
router.get("/", async (req, res) => {
    try {
        // find all drugs
        const drugs = await dataSource.getRepository(Drug).find();

        // validate if any drugs exist
        if (await Drug.count() === 0) {
            return res.status(404).json({error: "No drugs currently exists!"});
        }

        // return all drugs in json format
        return res.status(200).json({data: drugs});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch drugs!"});
    }
});

// get specific drug
router.get("/:id", async (req, res) => {
    try {
        // get drug id from request parameters
        const {id} = req.params;

        // find specific drug
        const drug = await dataSource
            .getRepository(Drug)
            .findOneBy({Id: parseInt(id)});

        // validate
        if (!drug) {
            return res.status(404).json({message: `DrugId: ${id} does not exist!`});
        }

        // return drug in json format
        return res.status(200).json({data: drug});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch drug!"});
    }
});

// create new drug
router.post("/", async (req, res) => {
    try {
        // get drug parameters from request body
        const {
            drugName,
            drugPurpose,
            drugUse,
            sideEffects
        } = req.body as CreateDrugParams;

        // validate & sanitize
        if (!drugName.trim() || !drugPurpose.trim() || !drugUse.trim() || !sideEffects.trim()) {
            return res
                .status(400)
                .json({error: "Drug has to have a valid name, purpose, use and side effects!"});
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

        // return drug in json format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not create new drug!"});
    }
});

// update specific drug
router.put("/:id", async (req, res) => {
    try {
        // get drug id from request parameters
        const {id} = req.params;

        // get drug parameters from request body
        const {
            drugName,
            drugPurpose,
            drugUse,
            sideEffects
        } = req.body as UpdateDrugParams;

        // find specific drug
        const drug = await dataSource
            .getRepository(Drug)
            .findOneBy({Id: parseInt(id)});

        // validate & sanitize
        if (!drug) {
            return res.status(404).json({error: `DrugId: ${id} does not exist!`});
        }
        if (drugName?.trim() === "" || drugPurpose?.trim() === "" || drugUse?.trim() === "" || sideEffects?.trim() === "") {
            return res
                .status(400)
                .json({error: "Drug has to have a valid name, purpose, use and side effects!"});
        }

        // update drug parameters
        drug.drugName = drugName ? drugName.trim() : drug.drugName;
        drug.drugPurpose = drugPurpose ? drugPurpose.trim() : drug.drugPurpose;
        drug.drugUse = drugUse ? drugUse.trim() : drug.drugUse;
        drug.sideEffects = sideEffects ? sideEffects.trim() : drug.sideEffects;

        // save drug to database
        const result = await drug.save();

        // return updated drug in json format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not update drug!"});
    }
});

// delete specific drug
router.delete("/:id", async (req, res) => {
    try {
        // get drug id from request parameters
        const {id} = req.params;

        // find specific drug
        const drug = await dataSource
            .getRepository(Drug)
            .findOneBy({Id: parseInt(id)});

        // validate
        if (!drug) {
            return res.status(404).json({error: `DrugId: ${id} does not exist!`});
        }

        // remove drug from database
        const result = await Drug.remove(drug);

        // return deleted drug in json format
        return res.status(200).json({data: req.params, result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not delete drug!"});
    }
});

export default router;