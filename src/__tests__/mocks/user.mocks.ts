import {
  ICreateUser,
  IInitSessioneUser,
  IUpdateUser,
} from "../../interface/users.interface";

import "dotenv/config";

export const mockedCreateLevelOneFirst: ICreateUser = {
  fullName: "CreateLevelOneFirst",
  email: "CreateLevelOneFirst@email.com",
  isTermsAccepted:true,
  authorizationLevel: 1,
  password: "123",
  phone: "00911111111",
};

export const mockedCreateLevelOneSecond: ICreateUser = {
  fullName: "CreateLevelOneSecond",
  email: "CreateLevelOneSecond@email.com",
  isTermsAccepted:true,
  authorizationLevel: 1,
  password: "123",
  phone: "00911111111",
};

export const mockedCreateLevelOneDefault: ICreateUser = {
  fullName: process.env.DEFAULT_USER_FULLNAME,
  email: process.env.DEFAULT_USER_EMAIL,
  isTermsAccepted:true,
  authorizationLevel: 1,
  password: process.env.DEFAULT_USER_PASS,
  phone: process.env.DEFAULT_USER_PHONE,
};

export const mockedCreateLevelTreeFirst: ICreateUser = {
  fullName: "CreateLevelTreeFirst",
  email: "CreateLevelTreeFirst@email.com",
  isTermsAccepted:true,
  password: "123",
  phone: "00911111111",
};

export const mockedCreateLevelTreeSecond: ICreateUser = {
  fullName: "CreateLevelTreeSecond",
  email: "CreateLevelTreeSecond@email.com",
  isTermsAccepted:true,
  authorizationLevel: 1,
  password: "123",
  phone: "00911111111",
};

export const mockedCreateLevelTreeThird: ICreateUser = {
  fullName: "CreateLevelTreeThird",
  email: "CreateLevelTreeThird@email.com",
  isTermsAccepted:true,
  authorizationLevel: 1,
  password: "123",
  phone: "00911111111",
};

export const mockedSessionLevelOneFirst: IInitSessioneUser = {
  email: "CreateLevelOneFirst@email.com",
  password: "123",
};

export const mockedSessionLevelOneFirstInvalidPassword: IInitSessioneUser = {
  email: "CreateLevelOneFirstUpdate@email.com",
  password: "123",
};

export const mockedSessionLevelOneAfterRetrieveAccount: IInitSessioneUser = {
  email: "CreateLevelOneFirstUpdate@email.com",
  password: "retrieve",
};

export const mockedSessionLevelOneSecond: IInitSessioneUser = {
  email: "CreateLevelOneSecond@email.com",
  password: "123",
};

export const mockedSessionLevelOneDefault: IInitSessioneUser = {
  email: process.env.DEFAULT_USER_EMAIL,
  password: process.env.DEFAULT_USER_PASS,
};

export const mockedSessionLevelTreeFirst: IInitSessioneUser = {
  email: "CreateLevelTreeFirst@email.com",
  password: "123",
};

export const mockedSessionLevelTreeSecond: IInitSessioneUser = {
  email: "CreateLevelTreeSecond@email.com",
  password: "123",
};

export const mockedUpdateMyAccountiImmediate: IUpdateUser = {
  fullName: "CreateLevelOneFirstUpdated",
};

export const mockedUpdateMyAccountiImediateAndAwaiting: IUpdateUser = {
  fullName: "CreateLevelOneFirstUpdated2",
  email: "CreateLevelOneFirstUpdate@email.com",
  password: "123update",
  phone: "00955555555",
};

export const mockedUpdateOtherUserLevel3: IUpdateUser = {
  fullName: "updateUserLevel3PerLevel1",
  email: "updateUserLevel3PerLevel1@email.com",
  authorizationLevel: 1,
  password: "123",
  phone: "00933333333",
  isActive: true,
};

export const mockedUpdateMyEmailBeLevel3: IUpdateUser = {
  email: "error@email.com",
};

export const mockedRetrieveNotFoundAccount = {
  email: "sdasdasd@email.com",
  newPassword: "retrieve",
};

export const mockedRetrieveMyAccount = {
  email: "CreateLevelOneFirstUpdate@email.com",
  newPassword: "retrieve",
};
