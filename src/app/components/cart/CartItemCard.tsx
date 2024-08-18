import React from 'react'
import DeleteFromCart from './DeleteFromCart'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react';
import CartQuantity from './CartQuantity';

interface productItemProps {
    id: string;
    quantity: number;
    Product: {
        id: string;
        image: string;
        name: string;
        price: string;
        description: string;
    } | null;
}
const CartItemCard = ({ id, quantity, Product }: productItemProps) => {
    return (
        <div key={id} className='bg-white rounded-md border p-2 flex gap-2'>
            <div>
                <Image
                    src={Product?.image as string}
                    alt={Product?.name as string}
                    width={150}
                    height={200}
                />
            </div>
            <div className='w-full flex justify-between'>
                <div className='flex flex-col justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold'>{Product?.name}</h1>
                        <p className='text-sm text-muted'>{Product?.description}</p>
                    </div>
                    <CartQuantity quantity={quantity as number} productId={Product?.id as string}/>
                </div>
                <div className='flex flex-col justify-between items-end'>
                    <DeleteFromCart productId={Product?.id as string} />
                    <h1 className='text-2xl'>₹{Product?.price}</h1>
                </div>

            </div>
        </div>
    )
}

export default CartItemCard