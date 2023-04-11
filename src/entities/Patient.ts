import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

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

    @Column({ type: "int" })
    InsuranceIDNumber!: number;

    @Column({ type: "int", nullable: true })
    InsuranceHolderID!: number;

    @Column({ type: "int" })
    DoctorID!: number;
}
