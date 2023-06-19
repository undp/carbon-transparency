
import { AdaptationProperties } from "../dto/adaptation.properties";
import { AgricultureProperties } from "../dto/agriculture.properties";
import { CoBenefitsProperties } from "../dto/co.benefits";
import { NdcFinancing } from "../dto/ndc.financing";
import { NDCReports } from "../dto/ndc.reports";
import { SolarProperties } from "../dto/solar.properties";
import { NDCActionType } from "../enum/ndc.action.enum";
import { NDCStatus } from "../enum/ndc.status";
import { Sector } from "../enum/sector.enum";
import { TypeOfMitigation } from "../enum/typeofmitigation.enum";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NDCAction {

  @PrimaryColumn()
  id: string;

  @Column()
  programmeId: string;

  @Column({
    type: "enum",
    enum: NDCActionType,
    array: false,
  })
  action: NDCActionType;

  @Column()
  methodology: string;

  @Column({
    type: "enum",
    enum: TypeOfMitigation,
    array: false,
    nullable: true
  })
  typeOfMitigation: TypeOfMitigation;


  @Column({
    type: "jsonb",
    array: false,
    nullable: true
  })
  agricultureProperties?: AgricultureProperties;

  @Column({
    type: "jsonb",
    array: false,
    nullable: true
  })
  solarProperties?: SolarProperties;


  @Column({
    type: "jsonb",
    array: false,
    nullable: true
  })
  adaptationProperties: AdaptationProperties;

  
  @Column({
    type: "jsonb",
    array: false,
    nullable: true
  })
  ndcFinancing?: NdcFinancing;
  

  // @Column({
  //   type: "jsonb",
  //   array: false,
  // })
  // ndcReports?: NDCReports;


  @Column({
    type: "jsonb",
    array: false,
    nullable: true
  })
  coBenefitsProperties?: CoBenefitsProperties;

  @Column({ type: "bigint" })
  txTime: number;

  @Column({ type: "bigint" })
  createdTime: number;

  @Column({ nullable: true })
  constantVersion: string;

  @Column({ nullable: true })
  sector: Sector;

  @Column({ nullable: true })
  status: NDCStatus

  externalId: string;
}
