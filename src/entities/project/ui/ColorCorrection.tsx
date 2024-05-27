import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/dialog';

export const ColorCorrection = ({SelectedShape}: {SelectedShape: any}) => {
    const src = SelectedShape?.getAttr('src');
    if (!src) return null;

    return (
        <Dialog>
            <DialogTrigger className="py-2 px-4 rounded-lg text-center hover:bg-secondary">
                Color Correction
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit your photo</DialogTitle>
                    <DialogDescription>
                        <img src={src} alt="preview" className="w-full" />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
