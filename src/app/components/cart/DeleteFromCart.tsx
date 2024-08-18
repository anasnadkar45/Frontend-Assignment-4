"use client"
import React, { useEffect } from 'react'
import { deleteFromCart, State } from '../../../../action';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Cross, Trash } from 'lucide-react';

interface deleteCartProps {
    productId: string;
}
const DeleteFromCart = ({ productId }: deleteCartProps) => {
    const initialState: State = { message: "", status: undefined };
    const [state, formAction] = useFormState(deleteFromCart, initialState);

    useEffect(() => {
        if (state.status === "success") {
            toast.success(state.message);
        } else if (state.status === "error") {
            toast.error(state.message);
        }
    }, [state]);
    return (
        <div>
            <form action={formAction}>
                <input type="hidden" name="productId" value={productId} />
                <Button type="submit" size={'icon'} className='rounded-full w-6 h-6 p-1'>
                    <Cross size={20} className='rotate-45 text-white' />
                </Button>
            </form>
        </div>
    )
}

export default DeleteFromCart