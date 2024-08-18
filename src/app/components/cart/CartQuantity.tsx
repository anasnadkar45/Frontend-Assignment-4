"use client"
import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom';
import { addToCart, State } from '../../../../action';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface CartQuantityProps {
    quantity: number;
    productId: string;
}
const CartQuantity = ({ quantity, productId }: CartQuantityProps) => {
    const initialState: State = { message: "", status: undefined };
    const [state, formAction] = useFormState(addToCart, initialState);
    const [quant, setQuant] = useState(quantity);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (state.status === "success") {
            toast.success(state.message);
            setIsSubmitting(false); // Re-enable button after success
        } else if (state.status === "error") {
            toast.error(state.message);
            setIsSubmitting(false); // Re-enable button after error
        }
    }, [state]);

    const handleIncrease = () => {
        setQuant((prevQuantity) => prevQuantity + 1);
    };

    const handleDecrease = () => {
        setQuant((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleAddToCart = () => {
        if (!isSubmitting) {
            setIsSubmitting(true);
        }
    };
    return (
        <form action={formAction}>
            <input type="hidden" name='productId' value={productId}/>
            <div className='flex gap-2 items-center'>
                <Button
                    type="submit"
                    variant={'outline'}
                    size={'icon'}
                    onClick={handleDecrease}
                    className="px-2 py-1 border rounded"
                    disabled={isSubmitting}
                >
                    <Minus size={16} />
                </Button>
                <span>{quant}</span>
                <Button
                    type="submit"
                    variant={'outline'}
                    size={'icon'}
                    onClick={handleIncrease}
                    className="px-2 py-1 border rounded"
                    disabled={isSubmitting}
                >
                    <Plus size={16} />
                </Button>
            </div>
        </form>
    )
}

export default CartQuantity