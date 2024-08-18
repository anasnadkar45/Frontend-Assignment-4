import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./lib/db";
import { unstable_noStore } from "next/cache";
import ProductCard from "./components/products/ProductCard";

async function getProducts() {
  const data = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      price: true,
    }
  });

  return data;
}

export default async function Home() {
  unstable_noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const productData = await getProducts();
  return (
    <div className="max-w-[1250px] w-full mx-auto mb-10 z-10 px-3 space-y-5 py-3 mt-20">
      <div className="max-w-[1000px] mx-auto mt-2 text-center">
        <h1 className="text-4xl font-bold">Upgrade Your Lifestyle with Premium Products</h1>
        <p className="text-muted">Whether you're looking for the latest gadgets or timeless fashion, our store has everything you need in one place.</p>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {
          productData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        }
      </div>
    </div>
  );
}
