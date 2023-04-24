import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Patient} from "./Patient";

@Entity()
export class Insurance extends BaseEntity {
    @PrimaryGeneratedColumn({type: "int"})
    Id!: number;

    @Column({type: "varchar", length: 50})
    insuranceCompanyName!: string;

    @OneToMany(() => Patient, patient => patient.insurance)
    patients!: Patient[];
}