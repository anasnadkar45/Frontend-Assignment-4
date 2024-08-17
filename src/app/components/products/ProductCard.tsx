import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface ProductDetailsProp {
    product: {
        id: string;
        name: string;
        description: string;
        image: string;
        price: string;
    }
}

export default function ProductCard({ product }: ProductDetailsProp) {
    return (
        <div className="p-4 rounded-2xl border">
            <Image
                alt="Product image"
                src={product.image}
                width={300}
                height={200}
                className="rounded-lg border w-full hover:scale-105 transition-all duration-75"
            />
            <div className="flex justify-between items-center mt-2">
                <h1 className="font-semibold text-xl line-clamp-1">{product.name}</h1>
                <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset  ring-primary/10">
                    ${product.price}
                </h3>
            </div>
            <p className="line-clamp-1 text-sm">{product.description}</p>
            <p className="font-semibold">₹{product.price}/-</p>
            <div className="flex justify-between items-center mt-2">
                <Button className="w-full mr-2">
                    <Link href={`product/${product.id}`}>Read More</Link>
                </Button>
                <Button size={"icon"} variant={"outline"} className="px-2">
                    <ShoppingCart />
                </Button>
            </div>
        </div>
    );
}
