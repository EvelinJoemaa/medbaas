import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Patient } from "./Patient";
import { Prescription } from "./Prescription";
import { OfficeVisit } from "./OfficeVisit";
import { HospitalAffiliation } from "./HospitalAffiliation";
import { PrimaryDoctorHistory } from "./PrimaryDoctorHistory";

@Entity()
export class Doctor extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    Id!: number;

    @Column({ type: "varchar", length: 50 })
    specialty!: string;

    @Column({ type: "int" })
    hospitals!: number;

    @Column({ type: "int" })
    phoneNumber!: number;

    @Column({type: "varchar"})
    address!: string;

    @OneToMany(() => Patient, patient => patient.doctor)
    patients!: Patient[];

    @OneToMany(() => Prescription, prescription => prescription.doctor)
    prescriptions!: Prescription[];

    @OneToMany(() => OfficeVisit, officeVisit => officeVisit.doctorId)
    officeVisits!: OfficeVisit[];

    @OneToMany(() => HospitalAffiliation, hospitalAffiliation => hospitalAffiliation.doctor)
    hospitalAffiliations!: HospitalAffiliation[];

    @OneToMany(() => PrimaryDoctorHistory, primaryDoctorHistory => primaryDoctorHistory.doctor)
    primaryDoctorHistories!: PrimaryDoctorHistory[];
}