import { API_URL } from '@/entities/project';
import { useUserStore } from '@/entities/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
const userAvatarURL = `${API_URL}/user/my-avatar`;

export const UserCard = () => {
    const user = useUserStore((state) => state.user);
    return (
        <div className="flex select-none items-center">
            <Avatar>
                <AvatarImage
                    src={userAvatarURL}
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
