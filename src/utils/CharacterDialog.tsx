"use client"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Choicebox,
    ChoiceboxItem,
    ChoiceboxItemContent,
    ChoiceboxItemDescription,
    ChoiceboxItemHeader,
    ChoiceboxItemIndicator,
    ChoiceboxItemTitle,
} from '@/components/ui/kibo-ui/choicebox';
import { useAppDispatch } from "@/lib/hooks";
import { mapLoadingState } from "@/lib/map/mapSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";


interface DialogParams {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
}

interface SelectOptions {
    id: string;
    label: string;
    url: string;
}

export function CharacterDialog({ isDialogOpen, setIsDialogOpen }: DialogParams) {
    const [selectedCharacter, setSelectedCharacter] = useState("Male");
    const dispatch = useAppDispatch();
    const router = useRouter();
    const options: SelectOptions[] = [
        {
            id: '1',
            label: 'Male',
            url: '/portraitshingshing-1.webp',
        },
        {
            id: '2',
            label: 'Female',
            url: '/train-conductor.webp',
        },
    ];

    const deviceWidth = window.innerWidth

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (deviceWidth < 700) {
            toast("Please use a laptop or a desktop computer")
            setIsDialogOpen(false);
            return
        }


        dispatch(mapLoadingState(selectedCharacter))
        console.log("Selected character:", selectedCharacter);
        router.push("/game")
        setIsDialogOpen(false);



    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px] font-michroma bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Select Character</DialogTitle>
                        <DialogDescription>
                            Select necessary information about your metaverse character.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full p-2 flex items-center justify-center bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2]">
                        <Choicebox
                            value={selectedCharacter}
                            onValueChange={setSelectedCharacter}
                            style={{
                                gridTemplateColumns: `repeat(${options.length}, 1fr)`,
                            }}
                        >
                            {options.map((option) => (
                                <ChoiceboxItem value={option.label} key={option.id}>
                                    <ChoiceboxItemHeader>
                                        <ChoiceboxItemTitle>{option.label}</ChoiceboxItemTitle>
                                        <ChoiceboxItemDescription className="w-full flex items-center justify-center">
                                            <Image
                                                src={option.url}
                                                height={350}
                                                width={200}
                                                alt={option.label}
                                                className="object-contain"
                                            />
                                        </ChoiceboxItemDescription>
                                    </ChoiceboxItemHeader>
                                    <ChoiceboxItemContent>
                                        <ChoiceboxItemIndicator />
                                    </ChoiceboxItemContent>
                                </ChoiceboxItem>
                            ))}
                        </Choicebox>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <button
                                className="p-2 bg-red-500 border-2 border-black mr-2 cursor-pointer"
                                type="button"
                            >
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            className="p-2 border-2 border-black cursor-pointer"
                            type="submit"
                        >
                            Submit
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}