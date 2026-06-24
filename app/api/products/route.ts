import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        type: body.productType,
        price: Number(body.price),
        thumbnail: body.thumbnail || "",
        tags: body.tags || "",
        inventory: body.inventory ? Number(body.inventory) : null,
        weight: body.weight ? Number(body.weight) : null,
        shippingCost: body.shippingCost
          ? Number(body.shippingCost)
          : null,
        shipsFrom: body.shipsFrom || null,
        userId: user.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
