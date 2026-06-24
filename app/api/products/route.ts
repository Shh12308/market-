import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { stores: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const store = user.stores[0]; // ⚠️ assumes 1 store per user

    if (!store) {
      return NextResponse.json(
        { error: "No store found for user" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,

        type: body.productType || null,
        tags: body.tags || null,

        price: Number(body.price),
        currency: "USDT",
        quantity: body.inventory ? Number(body.inventory) : 1,

        imageUrl: body.thumbnail || null,

        inventory: body.inventory ? Number(body.inventory) : null,
        weight: body.weight ? Number(body.weight) : null,
        shippingCost: body.shippingCost ? Number(body.shippingCost) : null,
        shipsFrom: body.shipsFrom || null,

        storeId: store.id,
        status: "ACTIVE",
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
