export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        {username}
      </h1>
    </div>
  );
}
