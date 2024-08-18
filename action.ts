"use server"

import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { parse } from "path";
import { date, z } from "zod";

export type State = {
    status: 'error' | 'success' | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null
}

async function getUserRole(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            role: true
        }
    });

    return user?.role;
}

const productSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'The name has to be minimum character length of 3' }),
    description: z
        .string()
        .min(3, { message: 'The name has to be minimum character length of 3' }),
    image: z
        .string()
        .min(1, { message: "Image is required" }),
    price: z
        .string()
        .min(1, { message: 'Price is required' }),
});

export async function addProduct(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
        throw new Error('Something went wrong');
    }

    const role = await getUserRole(user.id);

    if (role !== Role.ADMIN) {
        const state: State = {
            status: "error",
            message: "You do not have the necessary permissions to create a Product.",
        };

        console.log(state);
        return state;
    }

    const validateFields = productSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        image: JSON.parse(formData.get("image") as string),
        price: formData.get('price'),
    });

    if (!validateFields.success) {
        const state: State = {
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "Oops, I think there is a mistake with your inputs.",
        };

        console.log(state);
        return state;
    }

    const data = await prisma.product.create({
        data: {
            userId: user.id,
            name: validateFields.data.name,
            description: validateFields.data.description,
            price: validateFields.data.price,
            image: validateFields.data.image
        }
    });

    revalidatePath('/');
    if (data) {
        return {
            status: "success",
            message: "Your Product has been Added successfully",
        };

    }

    const state: State = {
        status: "success",
        message: "Your product has been added successfully",
    };

    return state;
}

// Add to cart
const addToCartSchema = z.object({
    productId: z.string().min(1, { message: 'Product ID is required' }),
    quantity: z.number().min(1).optional(),
});

export async function addToCart(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
        throw new Error('User not authenticated');
    }

    const productId = formData.get('productId') as string;
    const additionalQuantity = formData.get('quantity')
        ? parseInt(formData.get('quantity') as string)
        : 1;

    const validateFields = addToCartSchema.safeParse({
        productId,
        quantity: additionalQuantity,
    });

    if (!validateFields.success) {
        const state: State = {
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "There was an issue with your input.",
        };
        console.log(state);
        return state;
    }

    let cart = await prisma.cart.findFirst({
        where: {
            userId: user.id,
        }
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId: user.id,
            }
        });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId: productId,
        }
    });

    if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + additionalQuantity;
        await prisma.cartItem.update({
            where: {
                id: existingCartItem.id,
            },
            data: {
                quantity: newQuantity,
            }
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: productId,
                quantity: additionalQuantity,
            }
        });
    }

    revalidatePath('/cart');

    const state: State = {
        status: "success",
        message: "Product added to cart successfully",
    };
    return state;
}

const deleteFromCartSchema = z.object({
    productId: z.string().min(1, { message: 'Product ID is required' }),
});

export async function deleteFromCart(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
        throw new Error('User not authenticated');
    }

    const productId = formData.get('productId') as string;

    const validateFields = deleteFromCartSchema.safeParse({
        productId,
    });

    if (!validateFields.success) {
        const state: State = {
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "There was an issue with your input.",
        };
        console.log(state);
        return state;
    }

    const cart = await prisma.cart.findFirst({
        where: {
            userId: user.id,
        }
    });

    if (!cart) {
        const state: State = {
            status: "error",
            message: "No cart found for the user.",
        };
        console.log(state);
        return state;
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
            productId: productId,
        }
    });

    revalidatePath('/cart');

    const state: State = {
        status: "success",
        message: "Product removed from cart successfully",
    };
    return state;
}
