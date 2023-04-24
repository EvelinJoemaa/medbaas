import express from "express";
import dataSource from "../datasource";
import {HospitalAffiliation} from "../entities/HospitalAffiliation";
import {Doctor} from "../entities/Doctor";
import {Hospital} from "../entities/Hospital";

const router = express.Router();

interface CreateAffiliationParams {
    dateOfAffiliation: number;
    doctorId: number;
    hospitalId: number;
}

interface UpdateAffiliationParams {
    doctorId: number;
    hospitalId: number;
}

// get all affiliations
router.get("/", async (req, res) => {
    try {
        // find all affiliations
        const affiliations = await dataSource
            .getRepository(HospitalAffiliation)
            .find({relations: ["doctor", "hospital"]});

        // validate
        if (await HospitalAffiliation.count() === 0) {
            return res.status(404).json({error: "No affiliations currently exists!"});
        }

        // return all affiliations in json format
        return res.status(200).json({data: affiliations});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return error if something goes wrong with the database during the query
        return res.status(500).json({message: "Could not fetch affiliations!"});
    }
});

// get specific affiliation
router.get("/:date", async (req, res) => {
    try {
        // get date from request params
        const {date} = req.params;

        // find affiliation by date
        const affiliation = await dataSource
            .getRepository(HospitalAffiliation)
            .findOne({where: {dateOfAffiliation: parseInt(date)}, relations: ['doctor', 'hospital']});

        // validate
        if (!affiliation) {
            return res.status(404).json({message: `Affiliation date: ${date} does not exist!`});
        }

        // return affiliation in json format
        return res.status(200).json({data: affiliation});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return error if something goes wrong with the database during the query
        return res.status(500).json({message: "Could not fetch affiliation!"});
    }
});

// create new affiliation
router.post("/", async (req, res) => {
    try {
        // get params from request body
        const {
            dateOfAffiliation,
            doctorId,
            hospitalId
        } = req.body as CreateAffiliationParams;

        // validate & sanitize
        if (!dateOfAffiliation || !doctorId || !hospitalId) {
            return res
                .status(400)
                .json({error: "Affiliation has to have a valid date, doctorId and hospitalId!"});
        }

        // check if doctor exists
        const doctor = await dataSource.getRepository(Doctor).findOne({where: {Id: doctorId}});
        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // check if hospital exists
        const hospital = await dataSource.getRepository(Hospital).findOne({where: {Id: hospitalId}});
        if (!hospital) {
            return res.status(404).json({error: `HospitalId: ${hospitalId} does not exist!`});
        }

        // create new affiliation
        const affiliation = new HospitalAffiliation();
        affiliation.dateOfAffiliation = dateOfAffiliation ?? 0;
        affiliation.doctor = doctor;
        affiliation.hospital = hospital;

        // save doctor to database
        const result = await affiliation.save();

        // return created affiliation in json format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return error if something goes wrong with the database during the query
        return res.status(500).json({message: "Could not create new affiliation!"});
    }
});

// update specific affiliation
router.put("/:date", async (req, res) => {
    try {
        // get date from request params
        const {date} = req.params;

        // get params from request body
        const {
            doctorId,
            hospitalId
        } = req.body as UpdateAffiliationParams;

        // find affiliation by date
        const affiliation = await dataSource
            .getRepository(HospitalAffiliation)
            .findOneBy({dateOfAffiliation: parseInt(date)});

        // validate & sanitize
        if (!affiliation) {
            return res.status(404).json({error: `Affiliation date: ${date} does not exist!`});
        }

        // check if doctor exists
        const doctor = await dataSource.getRepository(Doctor).findOne({where: {Id: doctorId}});
        if (!doctor) {
            return res.status(404).json({error: `DoctorId: ${doctorId} does not exist!`});
        }

        // check if hospital exists
        const hospital = await dataSource.getRepository(Hospital).findOne({where: {Id: hospitalId}});
        if (!hospital) {
            return res.status(404).json({error: `HospitalId: ${hospitalId} does not exist!`});
        }

        // update affiliation
        affiliation.doctor = doctor ? doctor : affiliation.doctor;
        affiliation.hospital = hospital ? hospital : affiliation.hospital;

        // save to database
        const result = await affiliation.save();

        // return updated affiliation in json format
        return res.status(200).json({data: result});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return error if something goes wrong with the database during the query
        return res.status(500).json({message: "Could not update affiliation!"});
    }
});

router.delete("/:date", async (req, res) => {
    try {
        // get date from request params
        const {date} = req.params;

        // find affiliation by date
        const affiliation = await dataSource
            .getRepository(HospitalAffiliation)
            // .findOneBy({dateOfAffiliation: parseInt(date)});
            .findOne({where: {dateOfAffiliation: parseInt(date)}, relations: ['doctor', 'hospital']});

        // validate
        if (!affiliation) {
            return res.status(404).json({error: `Affiliation date: ${date} does not exist!`});
        }

        // remove affiliation from database
        await HospitalAffiliation.remove(affiliation);

        // return deleted affiliation in json format
        return res.status(200).json({data: req.params, affiliation});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return error if something goes wrong with the database during the query
        return res.status(500).json({message: "Could not delete affiliation!"});
    }
});

export default router;