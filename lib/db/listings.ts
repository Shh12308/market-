import { prisma } from "@/lib/prisma";

export const fetchListingsFromDB = () =>
  prisma.product.findMany({ include: { images: true, store: true } });

export const createListing = (data: any) =>
  prisma.product.create({ data });
