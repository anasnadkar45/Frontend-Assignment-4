"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import Image from "next/image";
import { FilePlus} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { addProduct, State } from "../../../../action"
import { UploadDropzone } from "@/app/lib/uploadthing"
import { SubmitButton } from "@/app/components/SubmitButtons"

export default function CreateProduct() {
    const initialState: State = { message: "", status: undefined };
    const [state, formAction] = useFormState(addProduct, initialState);
    const [image, setImage] = useState<string>();

    useEffect(() => {
        if (state.status === "success") {
            toast.success(state.message);
        } else if (state.status === "error") {
            toast.error(state.message);
        }
    }, [state]);


    return (
        <Sheet>
            <SheetTrigger asChild>
                {/* <div className="w-full h-40 border flex justify-center items-center rounded-lg bg-card">
                    <Plus size={10}/>
                </div> */}
                <Button variant="outline"><FilePlus className='mr-2' /> Add Project</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-full lg:max-w-[800px] max-h-[100vh] overflow-y-auto p-4">
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input required id="name" name="name" placeholder="Enter Product Name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Product Description</Label>
                        <Textarea required id="description" name="description" placeholder="Enter Product Details" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Product Price</Label>
                        < Input required type="number" id="price" name="price" placeholder="Enter the product price" />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <input required type="hidden" name="image" value={JSON.stringify(image)} />
                        <Label>Product Image</Label>
                        <UploadDropzone
                            className="border-accent"
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                const uploadedUrl = res[0].url;
                                setImage(uploadedUrl);
                                toast.success("Your images have been uploaded");
                            }}
                            onUploadError={(error: Error) => {
                                toast.error("Something went wrong, try again");
                            }}
                        />
                        {image && (
                            <div className="flex w-full justify-center">
                                <Image
                                    src={image}
                                    alt="Product Image"
                                    width={200}
                                    height={200}
                                    className="rounded"
                                />
                            </div>
                        )}
                    </div>

                    <SheetFooter className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-end">
                        <SheetClose asChild type="submit">
                            <SubmitButton text="Add Product" />
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet >
    )
}