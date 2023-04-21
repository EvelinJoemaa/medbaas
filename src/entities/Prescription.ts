import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Patient} from "./Patient";
import {Doctor} from "./Doctor";
import {Drug} from "./Drug";

@Entity()
export class Prescription extends BaseEntity {
    @PrimaryGeneratedColumn({type: "int"})
    Id!: number;

    @Column({type: "bigint"})
    datePrescribed!: number;

    @Column({type: "int"})
    dosage!: number;

    @Column({type: "int"})
    duration!: number;

    @Column({type: "boolean"})
    refillable!: boolean;

    @Column({type: "int", nullable: true})
    numberOfRefills!: number | undefined;

    @Column({type: "int", nullable: true})
    refillSize!: number | undefined;

    @Column({type: "varchar", length: 50, nullable: true})
    reason!: string | undefined;

    @ManyToOne(() => Patient, (Patient) => Patient.prescriptions, {eager: true})
    patient!: Patient;

    @ManyToOne(() => Drug, (Drug) => Drug.prescriptions, {eager: true})
    drug!: Drug;

    @ManyToOne(() => Doctor, (Doctor) => Doctor.prescriptions, {eager: true})
    doctor!: Doctor;
}