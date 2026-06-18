async function getItem(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/listings/${id}`
  );

  return res.json();
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await getItem(id);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-96 object-cover"
      />

      <h1 className="text-4xl font-bold mt-4">
        {item.title}
      </h1>

      <p className="text-green-600 text-2xl">
        {item.price} {item.crypto}
      </p>
    </div>
  );
}
