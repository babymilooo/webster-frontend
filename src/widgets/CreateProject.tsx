import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';

const CreateProject = () => {
    return (
        <Dialog>
            <DialogTrigger className="rounded-lg px-4 py-2 text-center hover:bg-secondary">
                new
            </DialogTrigger>
            <DialogContent className="w-3/5">
                <DialogTitle>Create Project</DialogTitle>
                <div className="flex flex-col gap-4">
                    <button className="rounded-lg px-4 py-2 text-center hover:bg-secondary">
                        Create Project with image
                    </button>
                    <button className="rounded-lg px-4 py-2 text-center hover:bg-secondary">
                        Create Project with background image
                    </button>
                </div>
                <DialogClose>
                    <Button>Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProject;
