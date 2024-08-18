"use client";  // This marks the component as a Client Component

import React, { useState } from 'react';

export default function CartItem({ productItem, handleQuantityUpdate }: any) {
    const [quantity, setQuantity] = useState(productItem.quantity);

    const increaseQuantity = async () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        await handleQuantityUpdate(productItem.id, newQuantity);
    };

    const decreaseQuantity = async () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            await handleQuantityUpdate(productItem.id, newQuantity);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <h1>{productItem.Product?.name}</h1>
            <button 
                onClick={decreaseQuantity} 
                disabled={quantity <= 1} 
                className="px-2 py-1 border rounded">
                -
            </button>
            <p>{quantity}</p>
            <button 
                onClick={increaseQuantity} 
                className="px-2 py-1 border rounded">
                +
            </button>
        </div>
    );
}
