import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./lib/db";
import { unstable_noStore } from "next/cache";
import CreateProduct from "./(main)/forms/CreateProduct";
import Navbar from "./components/common/Navbar";
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
    <main className="w-full">
      <div className="max-w-[1380px] w-full mx-auto mb-10 z-10 px-3 space-y-5 py-3">
        <div className="flex justify-between items-center">
          <h1>Ecommerce</h1>
          {
            user?.email === "anasnadkar23@gmail.com" && (
              <CreateProduct />
            )
          }
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {
            productData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          }
        </div>
      </div>
    </main>
  );
}
