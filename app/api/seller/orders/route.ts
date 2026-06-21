import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface OrderRow {
  id: string;
  item: { name: string; image: string | null };
  buyer: { name: string | null };
  amount: { crypto: string; usd: string; usdRaw: number };
  status: string;
  date: string;
  txHash: string | null;
}

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

    // Build where clause
    const where: any = {};
    if (status !== 'all') {
      where.status = status;
    }

    // Build orderBy
    const orderBy: any = {};
    if (sort === 'date') {
      orderBy.createdAt = dir;
    } else if (sort === 'amount') {
      orderBy.totalUsd = dir;
    } else {
      orderBy.createdAt = dir;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          buyer: { select: { name: true } },
          items: {
            include: { product: { select: { name: true, images: true } } },
            take: 1,
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const rows: OrderRow[] = orders.map((order) => {
      const firstItem = order.items[0];
      const usdRaw = order.totalUsd ?? 0;
      const currency = order.cryptoCurrency || 'ETH';
      const rate = CRYPTO_RATES[currency] || 3360;
      const cryptoAmount =
        currency === 'USDC'
          ? usdRaw.toFixed(2)
          : (usdRaw / rate).toFixed(currency === 'BTC' ? 6 : 4);

      // Use first product image, or null
      const productImage = firstItem?.product?.images
        ? (Array.isArray(firstItem.product.images)
            ? firstItem.product.images[0]
            : firstItem.product.images)
        : null;

      // Build full image URL if it's a relative path
      const image = productImage
        ? productImage.startsWith('http')
          ? productImage
          : `/uploads/${productImage}`
        : null;

      return {
        id: order.id.startsWith('ORD-') ? order.id : `ORD-${order.id.substring(0, 6).toUpperCase()}`,
        item: {
          name: firstItem?.product?.name || 'Deleted Product',
          image,
        },
        buyer: {
          name: order.buyer?.name || 'Unknown',
        },
        amount: {
          crypto: `${cryptoAmount} ${currency}`,
          usd: `$${usdRaw.toLocaleString()}`,
          usdRaw,
        },
        status: order.status.toLowerCase(),
        date: order.createdAt.toISOString(),
        txHash: order.txHash || null,
      };
    });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      orders: rows,
      total,
      totalPages,
      page,
    });
  } catch (error: any) {
    console.error('Orders fetch error:', error);

    // If Prisma fields don't match schema, return helpful error
    if (error?.code === 'P2025' || error?.code === 'P2021') {
      return NextResponse.json(
        { error: 'Database schema mismatch — check model field names in route.ts' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
