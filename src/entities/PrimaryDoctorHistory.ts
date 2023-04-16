import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Patients} from "./Patient";
import {Doctors} from "./Doctor";

@Entity()
export class PrimaryDoctorHistory extends BaseEntity{
    @PrimaryColumn({ type: "bigint" })
    startDate!: number;

    @ManyToOne(() => Patients)
    @JoinColumn({ name: "patientID" })
    patientID!: Patients;

    @ManyToOne(() => Doctors)
    @JoinColumn({ name: "doctorID" })
    doctorID!: Doctors;

    @Column({ type: "varchar", length: 50 })
    doctorName!: string;

    @Column({ type: "bigint", nullable: true })
    endDate!: number;

    @ManyToOne((type) => Doctor, (Doctor)=> doctor.primarydoctorhistorys, {eager: true})
    doctor!: Doctor;

    @ManyToOne((type) => Patient, (Patient)=> patient.primarydoctorhistorys, {eager: true})
    patient!: Patient;
}