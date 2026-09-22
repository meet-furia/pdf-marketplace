import ProductCard from './ProductCard'

function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-xl font-black text-slate-950">No products yet</h2>
        <p className="mt-2 text-sm text-slate-600">
          Published digital products will appear here once sellers add them.
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}

export default ProductGrid
