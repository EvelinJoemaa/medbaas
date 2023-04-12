import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Patient} from "./Patient";
import {Doctor} from "./Doctor";

@Entity()
export class OfficeVisits extends BaseEntity{
    @PrimaryColumn({ type: "int" })
    PatientID!: number;
    @ManyToOne(() => Patient)
    @JoinColumn({ name: "PatientID" })
    patient!: Patient;

    @PrimaryColumn({ type: "int" })
    DoctorID!: number;
    @ManyToOne(() => Doctor)
    @JoinColumn({ name: "DoctorID" })
    doctor!: Doctor;

    @PrimaryColumn({ type: "datetime" })
    DateOfVisit!: Date;

    @Column({ type: "varchar", length: 50, nullable: true })
    Symptoms!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    InitialDiagnosis!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    DiagnosisStatus!: string;

    @Column({ type: "int", nullable: true })
    BloodPressure!: number;

    @Column({ type: "int", nullable: true })
    Weight!: number;

    @Column({ type: "int", nullable: true })
    Height!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    Diagnosis!: string;
}