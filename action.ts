"use server"

import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { z } from "zod";

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

export async function addProduct(prevState: any, formData: FormData){
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    if (!user) {
        throw new Error('Something went wrong');
    }

    const role = await getUserRole(user.id);

    if(role !== Role.ADMIN){
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
        data:{
            userId: user.id,
            name: validateFields.data.name,
            description: validateFields.data.description,
            price: validateFields.data.price,
            image: validateFields.data.image
        }
    })
}