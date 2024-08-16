import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./lib/db";
import { unstable_noStore } from "next/cache";
import Image from "next/image";
import CreateProduct from "./(main)/forms/CreateProduct";

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
    <main className="min-h-screen w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex justify-center">
      {/* <Navbar /> */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="max-w-[1380px] w-full mx-auto mb-10 z-10 px-3 md:px-0 space-y-5">
        <div className="flex justify-between items-center">
          <h1>Ecommerce</h1>
          <CreateProduct />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {
            productData.map((product) => (
              <div key={product.id}>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <div className="block relative h-[230px]">
                  <Image
                    alt="Project image"
                    src={product.image}
                    layout="fill"
                    className="object-cover w-full rounded-lg border"
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </main>
  );
}
