export function TrustBar() {
  const stats = [
    { value: "10,000+", label: "Happy Clients" },
    { value: "Dermatologist", label: "Tested & Approved" },
    { value: "100%", label: "Cruelty-Free" },
    { value: "30-Day", label: "Money-Back Guarantee" },
  ];

  return (
    <section className="bg-neutral-50 border-y border-neutral-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-xl md:text-2xl font-bold text-primary-700">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}