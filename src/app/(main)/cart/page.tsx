import CartItemCard from '@/app/components/cart/CartItemCard';
import CheckOutButton from '@/app/components/cart/CheckOutButton';
import prisma from '@/app/lib/db';
import { Button } from '@/components/ui/button';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { unstable_noStore } from 'next/cache';
import { toast } from 'sonner';

async function getCartData(userId: string) {
    const data = await prisma.cart.findMany({
        where: { userId },
        select: {
            id: true,
            items: {
                select: {
                    id: true,
                    quantity: true,
                    Product: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            price: true,
                            description: true,
                        }
                    }
                }
            }
        }
    });
    return data;
}

const page = async () => {
    unstable_noStore();
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const CartData = await getCartData(user?.id as string);

    const shippingCost = 10;
    const taxRate = 0.08;
    let subtotal = 0;

    CartData.forEach(cartItem => {
        cartItem.items.forEach(productItem => {
            const price = parseFloat(productItem.Product?.price ?? '0');
            subtotal += productItem.quantity * price;
        });
    });

    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;

    return (
        <div className="max-w-5xl mx-auto p-5 space-y-8">
            <h1 className="text-3xl font-semibold text-center">Your Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    {CartData.length ? (
                        CartData.map(cartItem => (
                            <div key={cartItem.id} className="space-y-4">
                                {cartItem.items.map(productItem => (
                                    <CartItemCard
                                        key={productItem.id}
                                        id={productItem.id}
                                        quantity={productItem.quantity}
                                        Product={productItem.Product}
                                    />
                                ))}
                            </div>
                        ))
                    ) : (
                        <p className="text-center">Your cart is empty.</p>
                    )}
                </div>
                <div className="lg:col-span-4 bg-white rounded-md border p-6 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-2 text-sm">
                        <p>Subtotal: <span className="font-medium">${subtotal.toFixed(2)}</span></p>
                        <p>Shipping: <span className="font-medium">${shippingCost.toFixed(2)}</span></p>
                        <p>Tax: <span className="font-medium">${tax.toFixed(2)}</span></p>
                        <hr className="my-4"/>
                        <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
                    </div>
                    <CheckOutButton />
                </div>
            </div>
        </div>
    );
};

export default page;
