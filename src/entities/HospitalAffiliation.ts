import { Entity, BaseEntity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Doctor } from "./Doctor";
import { Hospital } from "./Hospital";

@Entity()
export class HospitalAffiliation extends BaseEntity{
    @PrimaryColumn({ type: "bigint" })
    dateOfAffiliation!: number;

    @Column({ type: "int" })
    Id!: number;

    @Column({ type: "int" })
    hospitalID!: number;

    @ManyToOne((type) => Hospital, (Hospital)=> Hospital.hospitalaffiliations, {eager: true})
    hospital!: Hospital;

    @ManyToOne((type) => Doctor, (Doctor)=> Doctor.hospitalaffiliations, {eager: true})
    doctor!: Doctor;
}