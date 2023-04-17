import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany } from "typeorm";
import { Patient } from "./Patient";

// Entity dekoraator ütleb TypoeORMil kuidas sellest tabel teha ja millised väljad on olemas
@Entity()
export class Insurance extends BaseEntity{
    @PrimaryGeneratedColumn({type: "int" })
    insuranceID!: number;

    @Column({ type: "varchar", length: 50 })
    insuranceCompanyName!: string;

    @OneToMany((type) => Patient, (patient)=> patient.insurance)
    patients!: Patient[];
}