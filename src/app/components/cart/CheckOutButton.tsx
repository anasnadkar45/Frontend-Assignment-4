"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { toast } from 'sonner'

const CheckOutButton = () => {
    return (
        <Button className="w-full mt-4" onClick={() => {
            toast.success('Your checkout was successful!')
        }}>
            Checkout
        </Button>
    )
}

export default CheckOutButton