import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";
import { Drug } from "./Drug";

@Entity()
export class Prescription extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    prescriptionID!: number;

    @Column({ type: "bigint" })
    datePrescribed!: number;

    @Column({ type: "int" })
    dosage!: number;

    @Column({ type: "int" })
    duration!: number;

    @Column({ type: "boolean" })
    refillable!: boolean;

    @Column({ type: "int", nullable: true })
    numberOfRefills!: number;

    @Column({ type: "int", nullable: true })
    refillSize!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    reason!: string;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: "patientID" })
    patientID!: Patient;

    @ManyToOne(() => Doctor)
    @JoinColumn({ name: "Id" })
    Id!: Doctor;

    @ManyToOne((type) => Drug, (drug)=> drug.prescriptions, {eager: true})
    drug!: Drug;

    @ManyToOne((type) => Patient, (patient)=> patient.prescriptions, {eager: true})
    patient!: Patient;

    @ManyToOne((type) => Doctor, (doctor)=> doctor.prescriptions, {eager: true})
    doctor!: Doctor;
}