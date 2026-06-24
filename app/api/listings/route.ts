import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const listings = await prisma.product.findMany({
    include: {
      images: true,
      store: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(listings);
}

export async function POST(req: Request) {
  const body = await req.json();

  const listing = await prisma.product.create({
    data: {
      title: body.title,
      description: body.description ?? "",
      category: body.category ?? "Other",

      price: Number(body.price),

      currency: body.currency ?? "USDT",
      quantity: Number(body.quantity ?? 1),

      imageUrl: body.imageUrl ?? null,

      storeId: body.storeId,

      status: body.status ?? "ACTIVE",
    },
  });

  return NextResponse.json(listing);
}
