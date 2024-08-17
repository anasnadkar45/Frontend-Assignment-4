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

interface priceProp {
    price: number;
}

export default async function ProductPage({
    params,
}: {
    params: { id: string };
}) {
    noStore();
    const data = await getData(params.id);
    const price = parseFloat(data?.price || "0");
    const discountedPrice = Math.floor(price * 0.9);

    return (
        <section className="max-w-[1380px] w-full mx-auto mb-10 px-3 space-y-5 py-3 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="block relative w-full h-[400px] md:h-[600px]">
                <Image
                    alt="Product image"
                    src={data?.image as string}
                    layout="fill"
                    className="object-cover w-full h-full rounded-lg border"
                />
            </div>
            <div className="flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                        {data?.name}
                    </h1>
                    <p className="mt-2 text-muted-foreground">{data?.description}</p>
                    <h1 className="text-xl font-bold">
                        <span className="line-through text-slate-500">₹{price}</span> ₹{discountedPrice}
                    </h1>
                </div>
                <div className="space-y-2 mt-5">
                    <Button className="w-full">Checkout Now</Button>
                    <Button variant={"outline"} className="w-full">Add To Cart</Button>
                </div>
            </div>
        </section>
    );
}
