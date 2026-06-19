import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
  });

  return <div>{/* render orders */}</div>;
}
