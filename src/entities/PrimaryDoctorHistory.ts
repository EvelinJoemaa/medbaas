import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Patient} from "./Patient";
import {Doctor} from "./Doctor";

@Entity()
export class PrimaryDoctorHistory extends BaseEntity{
    @PrimaryColumn({ type: "datetime" })
    StartDate!: Date;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: "PatientID" })
    patient!: Patient;

    @ManyToOne(() => Doctor)
    @JoinColumn({ name: "DoctorID" })
    doctor!: Doctor;

    @Column({ type: "varchar", length: 50 })
    DoctorName!: string;

    @Column({ type: "datetime", nullable: true })
    EndDate!: Date;
}