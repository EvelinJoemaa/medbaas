import {Entity, BaseEntity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class PrimaryDoctorHistory extends BaseEntity{
    @PrimaryColumn({ type: "datetime" })
    StartDate!: Date;

    @Column({ type: "int" })
    PatientID!: number;

    @Column({ type: "int" })
    DoctorID!: number;

    @Column({ type: "varchar", length: 50 })
    DoctorName!: string;

    @Column({ type: "datetime", nullable: true })
    EndDate!: Date;
}