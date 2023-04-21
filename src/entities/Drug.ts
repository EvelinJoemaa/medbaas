import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Prescription} from "./Prescription";

@Entity()
export class Drug extends BaseEntity {
    @PrimaryGeneratedColumn({type: "int"})
    Id!: number;

    @Column({type: "varchar", length: 50})
    drugName!: string;

    @Column({type: "varchar", length: 50})
    drugPurpose!: string;

    @Column({type: "varchar", length: 50})
    drugUse!: string;

    @Column({ type: "varchar", length: 50 })
    sideEffects!: string;

    @OneToMany(() => Prescription, prescription => prescription.drug)
    prescriptions!: Prescription[];
}