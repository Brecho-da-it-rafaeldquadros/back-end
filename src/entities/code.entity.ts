import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { MyCrypto } from "../helpers/crypto";
import { transformsPTBRFormat } from "../util/date.util";
import Users from "./users.entity";

@Entity("code")
export default class Code {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;
  @Column({ transformer: MyCrypto, nullable: true })
  codeSMS: string;
  @Column({ transformer: MyCrypto, nullable: true })
  codeEmail: string;
  @OneToOne(() => Users, (user) => user.code, { onDelete: "CASCADE" })
  @JoinColumn()
  user: Users;
  @CreateDateColumn()
  createdAt: string;
  @Column({ transformer: MyCrypto })
  validAt: string;
}
