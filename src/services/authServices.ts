import { Prisma } from "../../generated/prisma/client";
import { prismaClient } from "../lib/prisma";

export const getUserByEmail = async (email: string) => {
  return await prismaClient.user.findUnique({
    where: {email}
  });
}

export const getUserById = async (id: number) => {
  return await prismaClient.user.findUnique({
    where: { id }
  })
}

export const getOtpByEmail = async (email: string) => {
  return await prismaClient.otp.findUnique({
    where: { email },
  })
}

export const createOtp = async (otpData: Prisma.OtpCreateInput) => {
  return await prismaClient.otp.create({
    data: otpData,
  })
}

export const createUser = async (userData: Prisma.UserCreateInput) => {
  return await prismaClient.user.create({
    data: userData,
  })
}

export const updateOtp = async(id: number,otpData: Prisma.OtpUpdateInput) => {
  return await prismaClient.otp.update({
    where: { id },
    data: otpData
  })
}

export const updateUser = async(id: number, userData: any) => {
  return await prismaClient.user.update({
    where: {id},
    data: userData
  })
}