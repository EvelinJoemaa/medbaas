import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import {Insurance} from "./Insurance";
import {Doctor} from "./Doctor";
import {PrimaryDoctorHistory} from "./PrimaryDoctorHistory";
import {Prescription} from "./Prescription";
import {OfficeVisit} from "./OfficeVisit";

@Entity()
export class Patient extends BaseEntity {
    @PrimaryGeneratedColumn({type: "int"})
    Id!: number;

    @Column({type: "varchar", length: 50})
    name!: string;

    @Column({type: "varchar", length: 50})
    address!: string;

    @Column({type: "bigint"})
    phoneNumber!: number;

    @Column({type: "varchar", length: 50, nullable: true})
    email!: string | undefined;

    @Column({type: "int", nullable: true})
    insuranceHolderId!: number | undefined;

    @ManyToOne(() => Insurance, insurance => insurance.patients)
    insurance!: Insurance;

    @ManyToOne(() => Doctor, doctor => doctor.patients)
    doctor!: Doctor;

    @OneToMany(() => PrimaryDoctorHistory, primaryDoctorHistory => primaryDoctorHistory.patient)
    primaryDoctorHistories!: PrimaryDoctorHistory[];

    @OneToMany(() => Prescription, prescription => prescription.patient)
    prescriptions!: Prescription[];

    @OneToMany(() => OfficeVisit, officeVisit => officeVisit.patientId)
    officeVisits!: OfficeVisit[];
}