import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Insurances} from "./Insurance";
import {Doctors} from "./Doctor";

@Entity()
export class Patients extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    patientID!: number;

    @Column({ type: "varchar", length: 50 })
    name!: string;

    @Column({ type: "varchar", length: 50 })
    address!: string;

    @Column({ type: "int" })
    phoneNumber!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    email!: string;

    @ManyToOne(() => Insurances)
    @JoinColumn({ name: "InsuranceIFNumber" })
    insurance!: Insurances;

    @Column({ type: "int", nullable: true })
    insuranceHolderID!: number;

    @ManyToOne(() => Doctors)
    @JoinColumn({ name: "DoctorID" })
    doctor!: Doctors;
}