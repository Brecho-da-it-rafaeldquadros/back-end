import AppDataSource from "../data-source";
import Address from "../entities/address.entity";
import BankData from "../entities/bankData.entity";
import Brand from "../entities/brand.entity";
import Cart from "../entities/cart.entity";
import Categories from "../entities/categories.entity";
import Code from "../entities/code.entity";
import Logs from "../entities/logs.entity";
import Orders from "../entities/orders.entity";
import Preferences from "../entities/preferences.entity";
import Products from "../entities/products.entity";
import Update from "../entities/update.entity";
import Users from "../entities/users.entity";

export default class Repository {
  static users = AppDataSource.getRepository(Users);
  static logs = AppDataSource.getRepository(Logs);
  static code = AppDataSource.getRepository(Code);
  static bankData = AppDataSource.getRepository(BankData);
  static preferences = AppDataSource.getRepository(Preferences);
  static address = AppDataSource.getRepository(Address);
  static cart = AppDataSource.getRepository(Cart);
  static orders = AppDataSource.getRepository(Orders);
  static product = AppDataSource.getRepository(Products);
  static categories = AppDataSource.getRepository(Categories);
  static update = AppDataSource.getRepository(Update);
  static brand = AppDataSource.getRepository(Brand);
}
