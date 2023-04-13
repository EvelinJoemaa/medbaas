import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Patients} from "./Patient";
import {Doctors} from "./Doctor";

@Entity()
export class Prescriptions extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    prescriptionID!: number;

    @Column({ type: "datetime" })
    datePrescribed!: Date;

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

    @ManyToOne(() => Patients)
    @JoinColumn({ name: "PatientID" })
    patient!: Patients;

    @ManyToOne(() => Doctors)
    @JoinColumn({ name: "DoctorID" })
    doctor!: Doctors;
}