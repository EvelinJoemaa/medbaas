import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Insurance} from "./Insurance";
import {Doctor} from "./Doctor";

@Entity()
export class Patients extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    PatientID!: number;

    @Column({ type: "varchar", length: 50 })
    Name!: string;

    @Column({ type: "varchar", length: 50 })
    Address!: string;

    @Column({ type: "int" })
    PhoneNumber!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    Email!: string;

    @ManyToOne(() => Insurance)
    @JoinColumn({ name: "InsuranceIFNumber" })
    insurance!: Insurance;

    @Column({ type: "int", nullable: true })
    InsuranceHolderID!: number;

    @ManyToOne(() => Doctor)
    @JoinColumn({ name: "DoctorID" })
    doctor!: Doctor;
}