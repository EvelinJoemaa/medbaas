import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne} from "typeorm";
import {Patient} from "./Patient";
import {Doctor} from "./Doctor";

@Entity()
export class PrimaryDoctorHistory extends BaseEntity {
    @PrimaryColumn({type: "bigint"})
    startDate!: number;

    @Column({type: "varchar", length: 50})
    doctorName!: string;

    @Column({type: "bigint", nullable: true})
    endDate!: number | undefined;

    @ManyToOne(() => Patient, (Patient) => Patient.primaryDoctorHistories, {
        eager: true,
        onDelete: "CASCADE",
        cascade: true
    })
    patient!: Patient
    //patient!: number | undefined;

    @ManyToOne(() => Doctor, (Doctor) => Doctor.primaryDoctorHistories, {
        eager: true,
        onDelete: "CASCADE",
        cascade: true
    })
    doctor!: Doctor
    //doctor!: number | undefined;
}