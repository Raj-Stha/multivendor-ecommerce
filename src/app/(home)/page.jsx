export default function Home() {
  const rectangles = Array.from({ length: 100 }, (_, i) => i); // [0..19]

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Rectangles Grid</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {rectangles.map((item) => (
          <div
            key={item}
            className="w-full h-24 bg-blue-500 rounded shadow-md flex items-center justify-center text-white font-bold"
          >
            #{item + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
