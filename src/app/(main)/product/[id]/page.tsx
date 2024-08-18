import AddToCart from "@/app/components/products/AddToCart";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";

async function getData(id: string) {
    const data = await prisma.product.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
        },
    });
    return data;
}

export default async function ProductPage({
    params,
}: {
    params: { id: string };
}) {
    noStore();
    const data = await getData(params.id);
    if (!data) {
        return <div>Product not found</div>;
    }
    const price = parseFloat(data?.price || "0");
    const discountedPrice = Math.floor(price * 0.9);

    return (
        <section className="max-w-[1250px] w-full mx-auto mb-10 px-3 space-y-5 py-3 mt-20 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="block relative w-full h-[400px] md:h-[600px]">
                <Image
                    alt="Product image"
                    src={data?.image as string}
                    layout="fill"
                    className="object-cover w-full rounded-lg border"
                />
            </div>
            <div className="flex flex-col gap-4 justify-between rounded-md bg-white p-4 shadow-md">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 md:text-6xl">
                        {data?.name}
                    </h1>
                    <p className="mt-2 text-muted-foreground">{data?.description}</p>
                    <h1 className="text-xl font-bold">
                        <span className="line-through text-slate-500">₹{price}</span> ₹{discountedPrice}
                    </h1>
                </div>
                <div className="space-y-2 mt-5">
                    <AddToCart productId={data?.id as string} text="Add To Cart" />
                    <Button className="w-full">Checkout Now</Button>
                </div>
            </div>
        </section>
    );
}
