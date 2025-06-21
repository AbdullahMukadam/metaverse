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



interface DialogParams {
    isDialogOpen: boolean;
    setisDialogOpen: (open: boolean) => void;
}


export function CharacterDialog({ isDialogOpen, setisDialogOpen }: DialogParams) {


    return (
        <Dialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
            <DialogContent className="sm:max-w-[425px] font-michroma bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2]">
                <DialogHeader>
                    <DialogTitle>Select Character</DialogTitle>
                    <DialogDescription>
                        Select necessary information about your metaverse character.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full p-2 bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2]">

                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <button>Cancel</button>
                    </DialogClose>
                    <button>submit</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
