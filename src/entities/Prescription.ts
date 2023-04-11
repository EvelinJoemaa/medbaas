import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

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

    @Column({ type: "int" })
    PatientID!: number;

    @Column({ type: "int" })
    DoctorID!: number;
}