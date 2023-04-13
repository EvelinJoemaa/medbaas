import express from "express";
import { Hospitals } from "../entities/Hospital";
import dataSource from "../datasource";

const router = express.Router();

interface HospitalParams {
    location: string;
    contactInformation: string;
}

router.get("/", async (req, res) => {
    try {
        // küsi haiglaid andmebaasist
        const hospitals = await dataSource.getRepository(Hospitals).find();

        if (await Hospitals.count() === 0) {
            return res.status(404).json({ error: "No hospitals currently exists!" });
        }

        // vasta haiglate kogumikuga JSON formaadis
        return res.status(200).json({ data: hospitals });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch hospitals!" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id }  = req.params;

        const hospital = await dataSource
            .getRepository(Hospitals)
            .findOneBy({ hospitalID: parseInt(id) });

        if (!hospital) {
            return res.status(404).json({ message: `HospitalID: ${id} does not exist!` });
        }

        return res.status(200).json({ data: hospital });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch hospitals!" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { location, contactInformation } = req.body as HospitalParams;

        // validate & sanitize
        if (!location.trim() || !contactInformation.trim()) {
            return res
                .status(400)
                .json({ error: "Hospital has to have a valid location and contact information!" });
        }

        // create new hospital with given parameters
        const hospital = Hospitals.create({
            location: location.trim() ?? "",
            contactInformation: contactInformation.trim() ?? "",
        });

        // save hospital to database
        const result = await dataSource.getRepository(Hospitals).save(hospital);
        return res.status(200).json({ data: result });

    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch hospitals!" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { location, contactInformation } = req.body as HospitalParams;

        const hospital = await dataSource
            .getRepository(Hospitals)
            .findOneBy({ hospitalID: parseInt(id) });

        // validate & sanitize
        if (!hospital) {
            return res.status(404).json({ error: `HospitalID: ${id} does not exist!` });
        }
        if (!location.trim() || !contactInformation.trim()) {
            return res
                .status(400)
                .json({ error: "Hospital has to have a valid location and contact information!" });
        }

        hospital.location = location ? location : hospital.location;
        hospital.contactInformation = contactInformation ? contactInformation : hospital.contactInformation;

        //salvestame muudatused andmebaasi
        const result = await hospital.save();

        // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update hospitals!" });
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const hospital = await dataSource
            .getRepository(Hospitals)
            .findOneBy({ hospitalID: parseInt(id) });

        if (!hospital) {
            return res.status(404).json({ error: `HospitalID: ${id} does not exist!` });
        }

        const result = await Hospitals.remove(hospital);

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update hospitals!" });
    }
});

export default router;