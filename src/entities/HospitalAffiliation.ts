import {Entity, BaseEntity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class HospitalAffiliations extends BaseEntity{
    @PrimaryColumn({ type: "bigint" })
    dateOfAffiliation!: number;

    @Column({ type: "int" })
    doctorID!: number;

    @Column({ type: "int" })
    hospitalID!: number;

    @ManyToOne((type) => Hospital, (Hospital)=> hospital.hospitalaffiliations, {eager: true})
    hospital!: Hospital;

    @ManyToOne((type) => Doctor, (Doctor)=> doctor.hospitalaffiliations, {eager: true})
    doctor!: Doctor;
}