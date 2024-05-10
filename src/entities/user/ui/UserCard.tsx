import { useUserStore } from '@/entities/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

export const UserCard = () => {
    const user = useUserStore((state) => state.user);
    return (
        <div className="flex items-center select-none">
            <Avatar>
                <AvatarImage
                    src={user?.profilePicture}
                    alt="@avatar"
                    className="w-10"
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="ml-2 text-foreground">
                <p>{user?.userName}</p>
            </div>
        </div>
    );
};
