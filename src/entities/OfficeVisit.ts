import {Entity, BaseEntity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class OfficeVisits extends BaseEntity{
    @PrimaryColumn({ type: "int" })
    PatientID!: number;

    @PrimaryColumn({ type: "int" })
    DoctorID!: number;

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