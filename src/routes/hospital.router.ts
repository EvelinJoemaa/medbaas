import express from "express";
import dataSource from "../datasource";
import {Hospital} from "../entities/Hospital";

const router = express.Router();

interface CreateHospitalParams {
    location: string;
    contactInformation: string;
}

interface UpdateHospitalParams {
    location?: string;
    contactInformation?: string;
}

// get all hospitals
router.get("/", async (req, res) => {
    try {
        // fetch all hospitals from database
        const hospitals = await dataSource.getRepository(Hospital).find();

        // validate if there are any hospitals
        if (await Hospital.count() === 0) {
            return res.status(404).json({error: "No hospitals currently exists!"});
        }

        // return all hospitals in json format
        return res.status(200).json({data: hospitals});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return error if something unexpected happens during database query
        return res.status(500).json({message: "Could not fetch hospitals!"});
    }
});

// get specific hospital
router.get("/:id", async (req, res) => {
    try {
        // get hospital id from request parameters
        const {id} = req.params;

        // ask specific hospital from database
        const hospital = await dataSource
            .getRepository(Hospital)
            .findOneBy({Id: parseInt(id)});

        // validate
        if (!hospital) {
            return res.status(404).json({message: `HospitalId: ${id} does not exist!`});
        }

        // return hospital in JSON format
        return res.status(200).json({data: hospital});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return error if something unexpected happens during database query
        return res.status(500).json({message: "Could not fetch hospital!"});
    }
});

// create new hospital
router.post("/", async (req, res) => {
    try {
        // get hospital parameters from request body
        const {
            location,
            contactInformation
        } = req.body as CreateHospitalParams;

        // validate & sanitize
        if (!location.trim() || !contactInformation.trim()) {
            return res
                .status(400)
                .json({error: "Hospital has to have a valid location and contact information!"});
        }

        // create new hospital with given parameters
        const hospital = Hospital.create({
            location: location.trim() ?? "",
            contactInformation: contactInformation.trim() ?? "",
        });

        // save hospital to database
        const result = await dataSource.getRepository(Hospital).save(hospital);

        // return created hospital in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return error if something unexpected happens during database query
        return res.status(500).json({message: "Could not create new hospital!"});
    }
});

// update specific hospital
router.put("/:id", async (req, res) => {
    try {
        // get hospital id from request parameters
        const {id} = req.params;

        // get hospital parameters from request body
        const {
            location,
            contactInformation
        } = req.body as UpdateHospitalParams;

        // ask specific hospital from database
        const hospital = await dataSource
            .getRepository(Hospital)
            .findOneBy({Id: parseInt(id)});

        // validate & sanitize
        if (!hospital) {
            return res.status(404).json({error: `HospitalId: ${id} does not exist!`});
        }
        if (location?.trim() === "" || contactInformation?.trim() === "") {
            return res
                .status(400)
                .json({error: "Hospital has to have a valid location and contact information!"});
        }

        // update hospital parameters
        hospital.location = location ? location.trim() : hospital.location;
        hospital.contactInformation = contactInformation ? contactInformation.trim() : hospital.contactInformation;

        // save hospital to database
        const result = await hospital.save();

        // return updated hospital in JSON format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return error if something unexpected happens during database query
        return res.status(500).json({message: "Could not update hospital!"});
    }
});

// delete specific hospital
router.delete("/:id", async (req, res) => {
    try {
        // get hospital id from request parameters
        const {id} = req.params;

        // ask specific hospital from database
        const hospital = await dataSource
            .getRepository(Hospital)
            .findOneBy({Id: parseInt(id)});

        // validate
        if (!hospital) {
            return res.status(404).json({error: `HospitalId: ${id} does not exist!`});
        }

        // remove hospital from database
        const result = await Hospital.remove(hospital);

        // return deleted hospital in JSON format
        return res.status(200).json({data: req.params, result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return error if something unexpected happens during database query
        return res.status(500).json({message: "Could not delete hospital!"});
    }
});

export default router;