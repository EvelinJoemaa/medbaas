import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Patient} from "./Patient";
import {Doctor} from "./Doctor";

@Entity()
export class Prescriptions extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    PrescriptionID!: number;

    @Column({ type: "datetime" })
    DatePrescribed!: Date;

    @Column({ type: "int" })
    Dosage!: number;

    @Column({ type: "int" })
    Duration!: number;

    @Column({ type: "boolean" })
    Refillable!: boolean;

    @Column({ type: "int", nullable: true })
    NumberOfRefills!: number;

    @Column({ type: "int", nullable: true })
    RefillSize!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    Reason!: string;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: "PatientID" })
    patient!: Patient;

    @ManyToOne(() => Doctor)
    @JoinColumn({ name: "DoctorID" })
    doctor!: Doctor;
}