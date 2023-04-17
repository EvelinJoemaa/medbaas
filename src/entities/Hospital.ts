import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { HospitalAffiliation } from "./HospitalAffiliation";

@Entity()
export class Hospital extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    hospitalID!: number;

    @Column({ type: "varchar", length: 50 })
    location!: string;

    @Column({ type: "varchar", length: 50 })
    contactInformation!: string;

    @OneToMany((type) => HospitalAffiliation, (hospitalaffiliation)=> hospitalaffiliation.hospital)
    hospitalaffiliations!: HospitalAffiliation[];
}