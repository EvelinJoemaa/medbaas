import { PrimaryGeneratedColumn, Column, Entity, BaseEntity } from "typeorm";

// Entity dekoraator ütleb TypoeORMil kuidas sellest tabel teha ja millised väljad on olemas
@Entity()
export class Insurances extends BaseEntity{
    @PrimaryGeneratedColumn({type: "int" })
    insuranceID!: number;

    @Column({ type: "varchar", length: 50 })
    insuranceCompanyName!: string;

    @OneToMany((type) => Patient, (patient)=> patient.insurance)
    patients!: Patient[];
}