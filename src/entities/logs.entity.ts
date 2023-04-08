import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { MyCrypto } from "../helpers/crypto";
import { transformsPTBRFormat } from "../util/date.util";
import Users from "./users.entity";

@Entity("logs")
export default class Logs {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;
  @Column({ transformer: MyCrypto })
  type: string;
  @CreateDateColumn()
  readonly createdAt: string;
  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  user: Users;
}
