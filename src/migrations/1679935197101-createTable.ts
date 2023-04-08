import { MigrationInterface, QueryRunner } from "typeorm";

export class createTable1679935197101 implements MigrationInterface {
    name = 'createTable1679935197101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codeSMS" character varying, "codeEmail" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "validAt" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_76c04a353b3639752b096e75ec" UNIQUE ("userId"), CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bankData" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cpf" character varying, "accountNumber" character varying, "agency" character varying, "pix" character varying, "userId" uuid, CONSTRAINT "REL_fc59b65937d6d051bb801e7c64" UNIQUE ("userId"), CONSTRAINT "PK_bc53f116030926907ea7bf1b508" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "validAt" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "validAt" character varying NOT NULL, "deliveryStowageAt" character varying NOT NULL, "deliveryMethodCode" character varying NOT NULL, "companyAddress" character varying NOT NULL, "trackingCode" character varying NOT NULL DEFAULT 'AGUARDANDO RASTREIO', "companyTrackingAreaLink" character varying NOT NULL DEFAULT 'AGUARDANDO RASTREIO', "status" character varying NOT NULL DEFAULT 'AGUARDANDO PAGAMENTO', "method" character varying, "methodType" character varying, "address" character varying NOT NULL, "paymentURL" character varying, "simpleProducts" text NOT NULL, "priceAll" double precision NOT NULL, "priceTransport" double precision NOT NULL, "priceProducts" double precision NOT NULL, "paymentId" character varying, "preferenceId" character varying, "userId" uuid, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "color" character varying NOT NULL, "size" character varying NOT NULL, "launchTime" character varying NOT NULL, "priceAll" double precision NOT NULL, "priceSeller" double precision NOT NULL, "priceService" double precision NOT NULL, "percentageService" double precision, "isSale" boolean NOT NULL DEFAULT false, "salePrice" character varying, "status" character varying NOT NULL DEFAULT 'Disponivel', "image_1" character varying, "image_2" character varying, "image_3" character varying, "cartId" uuid, "userId" uuid, "orderId" uuid, "categoryId" uuid, "brandId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "sizeTable" character varying NOT NULL, CONSTRAINT "UQ_5f468ae5696f07da025138e38f7" UNIQUE ("name"), CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT false, "shoeSize" character varying NOT NULL, "clothingSize" character varying NOT NULL, "handBagSize" character varying NOT NULL, "color" character varying NOT NULL, "categoryId" uuid, "brandId" uuid, "userId" uuid, CONSTRAINT "REL_eb2de5fbaa61832e982f53d971" UNIQUE ("userId"), CONSTRAINT "PK_17f8855e4145192bbabd91a51be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "update" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "json" character varying NOT NULL, "isConfirmedPhone" boolean, "isConfirmedEmail" boolean, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "validAt" character varying NOT NULL, "alterUserId" uuid, "solicitationUserId" uuid, CONSTRAINT "REL_901cceeb151df7c3d5220d94ca" UNIQUE ("alterUserId"), CONSTRAINT "PK_575f77a0576d6293bc1cb752847" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "authorizationLevel" integer NOT NULL DEFAULT '3', "isActive" boolean NOT NULL DEFAULT false, "isConfirmedPhone" boolean NOT NULL DEFAULT false, "isConfirmedEmail" boolean NOT NULL DEFAULT false, "isTermsAccepted" boolean NOT NULL DEFAULT false, "isSolicitationCode" boolean NOT NULL DEFAULT true, "lastUserIdUpdated" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "isSameTown" boolean NOT NULL DEFAULT false, "isDefault" boolean NOT NULL DEFAULT false, "isCompanyAddress" boolean NOT NULL DEFAULT false, "cep" character varying NOT NULL, "street" character varying NOT NULL, "number" character varying NOT NULL, "city" character varying NOT NULL, "uf" character varying NOT NULL, "neighborhood" character varying NOT NULL, "complement" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "logs" ADD CONSTRAINT "FK_a1196a1956403417fe3a0343390" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "code" ADD CONSTRAINT "FK_76c04a353b3639752b096e75ec4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bankData" ADD CONSTRAINT "FK_fc59b65937d6d051bb801e7c64e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_7a637e662f7c4b3a85001c53dfd" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_261f1322902ba3b21cf883ccddd" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preferences" ADD CONSTRAINT "FK_dffde865022fc6b7f12e397d910" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preferences" ADD CONSTRAINT "FK_f3057d15cc08fb8f4ffb16c161d" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preferences" ADD CONSTRAINT "FK_eb2de5fbaa61832e982f53d9716" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "update" ADD CONSTRAINT "FK_901cceeb151df7c3d5220d94ca9" FOREIGN KEY ("alterUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "update" ADD CONSTRAINT "FK_648e16dbfd237e647b9050c4fc7" FOREIGN KEY ("solicitationUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3"`);
        await queryRunner.query(`ALTER TABLE "update" DROP CONSTRAINT "FK_648e16dbfd237e647b9050c4fc7"`);
        await queryRunner.query(`ALTER TABLE "update" DROP CONSTRAINT "FK_901cceeb151df7c3d5220d94ca9"`);
        await queryRunner.query(`ALTER TABLE "preferences" DROP CONSTRAINT "FK_eb2de5fbaa61832e982f53d9716"`);
        await queryRunner.query(`ALTER TABLE "preferences" DROP CONSTRAINT "FK_f3057d15cc08fb8f4ffb16c161d"`);
        await queryRunner.query(`ALTER TABLE "preferences" DROP CONSTRAINT "FK_dffde865022fc6b7f12e397d910"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_261f1322902ba3b21cf883ccddd"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_7a637e662f7c4b3a85001c53dfd"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "bankData" DROP CONSTRAINT "FK_fc59b65937d6d051bb801e7c64e"`);
        await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_76c04a353b3639752b096e75ec4"`);
        await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "FK_a1196a1956403417fe3a0343390"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "update"`);
        await queryRunner.query(`DROP TABLE "preferences"`);
        await queryRunner.query(`DROP TABLE "brand"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "bankData"`);
        await queryRunner.query(`DROP TABLE "code"`);
        await queryRunner.query(`DROP TABLE "logs"`);
    }

}
