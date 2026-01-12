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
import { Input } from "@/components/ui/input";
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
    const [step, setStep] = useState<1 | 2>(1);
    const [roomId, setRoomId] = useState("");
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

    const generateRoomId = () => {
        const randomId = `room-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
        setRoomId(randomId);
        toast.success("Room ID generated!");
    };

    const handleStepOne = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!roomId.trim()) {
            toast.error("Please enter or generate a Room ID");
            return;
        }
        
        setStep(2);
    };

    const handleFinalSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (deviceWidth < 700) {
            toast.error("Please use a laptop or a desktop computer");
            setIsDialogOpen(false);
            return;
        }

        dispatch(mapLoadingState({ character: selectedCharacter, roomId }));
        console.log("Selected character:", selectedCharacter, "Room ID:", roomId);
        router.push("/game");
        setIsDialogOpen(false);
        
        // Reset state for next time
        setStep(1);
        setRoomId("");
        setSelectedCharacter("Male");
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            // Reset to step 1 when dialog closes
            setStep(1);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[425px] font-michroma bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2]">
                {step === 1 ? (
                    <form onSubmit={handleStepOne}>
                        <DialogHeader>
                            <DialogTitle>Join or Create Room</DialogTitle>
                            <DialogDescription>
                                Enter an existing Room ID or generate a new one.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="roomId" className="text-sm font-medium">
                                    Room ID
                                </label>
                                <Input
                                    id="roomId"
                                    placeholder="Enter room ID..."
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    className="bg-white"
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs text-gray-600">or</span>
                            </div>
                            <button
                                type="button"
                                onClick={generateRoomId}
                                className="w-full p-2 border-2 border-black bg-blue-100 hover:bg-blue-200 cursor-pointer transition-colors"
                            >
                                Generate New Room ID
                            </button>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <button
                                    className="p-2 bg-red-500 border-2 border-black mr-2 cursor-pointer hover:bg-red-600 transition-colors"
                                    type="button"
                                >
                                    Cancel
                                </button>
                            </DialogClose>
                            <button
                                className="p-2 border-2 border-black bg-green-100 hover:bg-green-200 cursor-pointer transition-colors"
                                type="submit"
                            >
                                Next
                            </button>
                        </DialogFooter>
                    </form>
                ) : (
                    <form onSubmit={handleFinalSubmit}>
                        <DialogHeader>
                            <DialogTitle>Select Character</DialogTitle>
                            <DialogDescription>
                                Choose your character for the metaverse.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-2">
                            <div className="mb-2 p-2 bg-white/50 rounded border border-gray-300">
                                <span className="text-xs font-semibold">Room ID: </span>
                                <span className="text-xs">{roomId}</span>
                            </div>
                        </div>
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
                            <button
                                className="p-2 bg-gray-300 border-2 border-black mr-2 cursor-pointer hover:bg-gray-400 transition-colors"
                                type="button"
                                onClick={handleBack}
                            >
                                Back
                            </button>
                            <button
                                className="p-2 border-2 border-black bg-green-100 hover:bg-green-200 cursor-pointer transition-colors"
                                type="submit"
                            >
                                Join Game
                            </button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}