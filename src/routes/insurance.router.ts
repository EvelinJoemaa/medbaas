import express from "express";
import dataSource from "../datasource";
import {Insurance} from "../entities/Insurance";

const router = express.Router();

interface CreateInsuranceParams {
    insuranceCompanyName: string;
}

interface UpdateInsuranceParams {
    insuranceCompanyName?: string;
}

// get all insurances
router.get("/", async (req, res) => {
    try {
        // find all insurances
        const insurances = await dataSource.getRepository(Insurance).find();

        // validate if insurances exists
        if (await Insurance.count() === 0) {
            return res.status(404).json({error: "No insurances currently exists!"});
        }

        // return insurances in json format
        return res.status(200).json({data: insurances});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch insurances!"});
    }
});

// get specific insurance
router.get("/:id", async (req, res) => {
    try {
        // get insurance id from request parameters
        const {id} = req.params;

        // get insurance from database
        const insurance = await dataSource
            .getRepository(Insurance)
            .findOneBy({Id: parseInt(id)});

        // validate if insurance exists
        if (!insurance) {
            return res.status(404).json({message: `InsuranceId: ${id} does not exist!`});
        }

        // return insurance in json format
        return res.status(200).json({data: insurance});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch insurance!"});
    }
});

// create new insurance
router.post("/", async (req, res) => {
    try {
        // get insurance parameters from request body
        const {insuranceCompanyName} = req.body as CreateInsuranceParams;

        // validate & sanitize
        if (!insuranceCompanyName.trim()) {
            return res
                .status(400)
                .json({error: "Insurance company has to have a valid name!"});
        }

        // create new insurance company with given parameters
        const insurance = Insurance.create({
            insuranceCompanyName: insuranceCompanyName.trim() ?? ""
        });

        // save insurance to database
        const result = await dataSource.getRepository(Insurance).save(insurance);

        // return insurance in json format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not create new insurance!"});
    }
});

// update specific insurance
router.put("/:id", async (req, res) => {
    try {
        // get insurance id from request parameters
        const {id} = req.params;

        // get insurance parameters from request body
        const {insuranceCompanyName} = req.body as UpdateInsuranceParams;

        // get insurance from database
        const insurance = await dataSource
            .getRepository(Insurance)
            .findOneBy({Id: parseInt(id)});

        // validate
        if (!insurance) {
            return res.status(404).json({error: `InsuranceId: ${id} does not exist!`});
        }

        // validate & sanitize
        if (!insuranceCompanyName?.trim()) {
            return res
                .status(400)
                .json({error: "Insurance company has to have a valid name!"});
        }

        // update insurance with given parameters
        insurance.insuranceCompanyName = insuranceCompanyName.trim() ?? "";

        // save insurance to database
        const result = await dataSource.getRepository(Insurance).save(insurance);

        // return insurance in json format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not update insurance!"});
    }
});

// delete specific insurance
router.delete("/:id", async (req, res) => {
    try {
        // get insurance id from request parameters
        const {id} = req.params;

        // get insurance from database
        const insurance = await dataSource
            .getRepository(Insurance)
            .findOneBy({Id: parseInt(id)});

        // validate
        if (!insurance) {
            return res.status(404).json({error: `InsuranceId: ${id} does not exist!`});
        }

        // delete insurance from database
        const result = await dataSource.getRepository(Insurance).remove(insurance);

        // return insurance in json format
        return res.status(200).json({data: req.params, result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not delete insurance!"});
    }
});

export default router;