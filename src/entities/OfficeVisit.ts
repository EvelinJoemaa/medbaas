import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";

@Entity()
export class OfficeVisit extends BaseEntity{
    @PrimaryColumn({ type: "int" })
    patientID!: number;
    @ManyToOne(() => Patient)
    @JoinColumn({ name: "patientID" })
    patient!: Patient;

    @PrimaryColumn({ type: "int" })
    doctorID!: number;
    @ManyToOne(() => Doctor)
    @JoinColumn({ name: "Id" })
    doctor!: Doctor;

    @PrimaryColumn({ type: "bigint" })
    dateOfVisit!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    symptoms!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    initialDiagnosis!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    diagnosisStatus!: string;

    @Column({ type: "int", nullable: true })
    bloodPressure!: number;

    @Column({ type: "int", nullable: true })
    weight!: number;

    @Column({ type: "int", nullable: true })
    height!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    diagnosis!: string;

    // @ManyToOne((type) => Doctor, (Doctor)=> Doctor.officevisits, {eager: true})
    // doctor!: Doctor;
    //
    // @ManyToOne((type) => Patient, (Patient)=> Patient.officevisits, {eager: true})
    // patient!: Patient;
}