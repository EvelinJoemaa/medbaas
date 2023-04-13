import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Patients} from "./Patient";
import {Doctors} from "./Doctor";

@Entity()
export class PrimaryDoctorHistory extends BaseEntity{
    @PrimaryColumn({ type: "datetime" })
    startDate!: Date;

    @ManyToOne(() => Patients)
    @JoinColumn({ name: "PatientID" })
    patient!: Patients;

    @ManyToOne(() => Doctors)
    @JoinColumn({ name: "DoctorID" })
    doctor!: Doctors;

    @Column({ type: "varchar", length: 50 })
    doctorName!: string;

    @Column({ type: "datetime", nullable: true })
    endDate!: Date;
}