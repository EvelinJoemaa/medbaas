import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";

@Entity()
export class PrimaryDoctorHistory extends BaseEntity{
    @PrimaryColumn({ type: "bigint" })
    startDate!: number;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: "patientID" })
    patientID!: Patient;

    @ManyToOne(() => Doctor)
    @JoinColumn({ name: "Id" })
    Id!: Doctor;

    @Column({ type: "varchar", length: 50 })
    doctorName!: string;

    @Column({ type: "bigint", nullable: true })
    endDate!: number;

    @ManyToOne((type) => Doctor, (Doctor)=> Doctor.primarydoctorhistorys, {eager: true})
    doctor!: Doctor;

    @ManyToOne((type) => Patient, (Patient)=> Patient.primarydoctorhistorys, {eager: true})
    patient!: Patient;
}