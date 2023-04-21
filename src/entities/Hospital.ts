import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {HospitalAffiliation} from "./HospitalAffiliation";

@Entity()
export class Hospital extends BaseEntity {
    @PrimaryGeneratedColumn({type: "int"})
    Id!: number;

    @Column({type: "varchar", length: 50})
    location!: string;

    @Column({type: "varchar", length: 50})
    contactInformation!: string;

    @OneToMany(() => HospitalAffiliation, hospitalAffiliation => hospitalAffiliation.hospital)
    hospitalAffiliations!: HospitalAffiliation[];
}