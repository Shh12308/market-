import { NextResponse } from "next/server";

export async function GET() {
  const listings = await fetchListingsFromDB();

  return NextResponse.json(listings);
}

export async function POST(req: Request) {
  const body = await req.json();

  const listing = await createListing(body);

  return NextResponse.json(listing);
}
