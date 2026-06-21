import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CRYPTO_RATES: Record<string, number> = {
  ETH: 3360,
  BTC: 67500,
  USDC: 1,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const sort = searchParams.get('sort') || 'date';
    const dir = searchParams.get('dir') || 'desc';
    const pageSize = 8;

    const where: any = {};
    if (status !== 'all') {
      where.status = status;
    }

    const orderBy: any =
      sort === 'amount'
        ? { totalUsd: dir }
        : { createdAt: dir };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          buyer: true,
          items: {
            include: { product: true },
            take: 1,
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const rows = orders.map((order: any) => {
      const firstItem = order.items?.[0];
      const product = firstItem?.product;
      const usdRaw = order.totalUsd ?? order.total ?? order.amount ?? 0;
      const currency = order.cryptoCurrency ?? order.currency ?? 'ETH';
      const rate = CRYPTO_RATES[currency] || 3360;
      const cryptoAmount =
        currency === 'USDC'
          ? Number(usdRaw).toFixed(2)
          : (Number(usdRaw) / rate).toFixed(currency === 'BTC' ? 6 : 4);

      // Safely get image — handles string, string[], or missing
      let image: string | null = null;
      const imgRaw = product?.image ?? product?.images ?? product?.coverImage ?? product?.thumbnail ?? null;
      if (imgRaw) {
        const imgStr = Array.isArray(imgRaw) ? imgRaw[0] : imgRaw;
        image = typeof imgStr === 'string'
          ? imgStr.startsWith('http') ? imgStr : `/uploads/${imgStr}`
          : null;
      }

      // Safely get product name
      const productName = product?.title ?? product?.name ?? product?.productName ?? 'Product';

      // Safely get buyer name
      const buyerName = order.buyer?.name ?? order.buyer?.username ?? order.buyer?.email ?? 'Unknown';

      return {
        id: order.id.startsWith('ORD-') ? order.id : `ORD-${order.id.substring(0, 6).toUpperCase()}`,
        item: { name: productName, image },
        buyer: { name: buyerName },
        amount: {
          crypto: `${cryptoAmount} ${currency}`,
          usd: `$${Number(usdRaw).toLocaleString()}`,
          usdRaw: Number(usdRaw),
        },
        status: (order.status ?? 'pending').toLowerCase(),
        date: (order.createdAt ?? new Date()).toISOString(),
        txHash: order.txHash ?? order.transactionHash ?? null,
      },
    });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({ orders: rows, total, totalPages, page });
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', detail: error.message },
      { status: 500 }
    );
  }
}
