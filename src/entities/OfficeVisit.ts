import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Patients} from "./Patient";
import {Doctors} from "./Doctor";

@Entity()
export class OfficeVisits extends BaseEntity{
    @PrimaryColumn({ type: "int" })
    patientID!: number;
    @ManyToOne(() => Patients)
    @JoinColumn({ name: "patientID" })
    patient!: Patients;

    @PrimaryColumn({ type: "int" })
    doctorID!: number;
    @ManyToOne(() => Doctors)
    @JoinColumn({ name: "doctorID" })
    doctor!: Doctors;

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
    
    @ManyToOne((type) => Doctor, (Doctor)=> doctor.officevisits, {eager: true})
    doctor!: Doctor;

    @ManyToOne((type) => Patient, (Patient)=> patient.officevisits, {eager: true})
    patient!: Patient;
}