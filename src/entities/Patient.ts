import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { Insurance } from "./Insurance";
import { Doctor } from "./Doctor";
import { PrimaryDoctorHistory } from "./PrimaryDoctorHistory";
import { Prescription } from "./Prescription";
import { OfficeVisit } from "./OfficeVisit";

@Entity()
export class Patient extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    patientID!: number;

    @Column({ type: "varchar", length: 50 })
    name!: string;

    @Column({ type: "varchar", length: 50 })
    address!: string;

    @Column({ type: "int" })
    phoneNumber!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    email!: string;

    // @ManyToOne(() => Insurance)
    // @JoinColumn({ name: "insuranceID" })
    // insuranceID!: Insurance;

    @Column({ type: "int", nullable: true })
    insuranceHolderID!: number;

    // @ManyToOne(() => Doctor)
    // @JoinColumn({ name: "doctorID" })
    // doctorID!: Doctor;

    @OneToMany((type) => PrimaryDoctorHistory, (primarydoctorhistory)=> primarydoctorhistory.patient)
    primarydoctorhistorys!: PrimaryDoctorHistory[];

    @OneToMany((type) => Prescription, (prescription)=> prescription.patient)
    prescriptions!: Prescription[];

    @OneToMany((type) => OfficeVisit, (officevisit)=> officevisit.patient)
    officevisits!: OfficeVisit[];

    @ManyToOne((type) => Doctor, (Doctor)=> Doctor.patients, {eager: true})
    doctor!: Doctor;

    @ManyToOne((type) => Insurance, (Insurance)=> Insurance.patients, {eager: true})
    insurance!: Insurance;
}