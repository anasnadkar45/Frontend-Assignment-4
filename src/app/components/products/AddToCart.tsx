'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { addToCart, State } from '../../../../action';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

interface AddToCartProps {
    productId: string;
    text: string;
}

const AddToCart = ({ productId, text }: AddToCartProps) => {
    const initialState: State = { message: "", status: undefined };
    const [state, formAction] = useFormState(addToCart, initialState);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (state.status === "success") {
            toast.success(state.message);
            setIsSubmitting(false);
        } else if (state.status === "error") {
            toast.error(state.message);
            setIsSubmitting(false);
        }
    }, [state]);

    const handleIncrease = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const handleDecrease = () => {
        setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleAddToCart = () => {
        if (!isSubmitting) {
            setIsSubmitting(true);
        }
    };

    return (
        <div className="grid grid-cols-2 items-center space-x-1">
            <div className='flex justify-between items-center'>
                <Button
                    type="button"
                    variant={'outline'}
                    size={'icon'}
                    onClick={handleDecrease}
                    className="px-2 py-1 border rounded"
                    disabled={isSubmitting}
                >
                    <Minus size={16} />
                </Button>
                <span>{quantity}</span>
                <Button
                    type="button"
                    variant={'outline'}
                    size={'icon'}
                    onClick={handleIncrease}
                    className="px-2 py-1 border rounded"
                    disabled={isSubmitting}
                >
                    <Plus size={16} />
                </Button>
            </div>
            <form action={formAction}>
                <input type="hidden" name="productId" value={productId} />
                <input type="hidden" name="quantity" value={quantity} />
                <Button
                    type="submit"
                    onClick={handleAddToCart}
                    variant={"outline"}
                    className="bg-accent w-full"
                >
                    <ShoppingCart /> {text}
                </Button>
            </form>
        </div>
    );
};


export default AddToCart;
