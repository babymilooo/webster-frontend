import { useProjectStore } from '@/entities/project';

const ProjectLeftSidebar = () => {
    const setState = useProjectStore((state) => state.setState);
    const setImage = useProjectStore((state) => state.setSelectredImage);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;

            if (typeof data !== 'string') return;
            setImage(data);
            setState('SelectImage');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed z-10 h-full w-[80px] bg-green-500">
            <div className="mt-6 grid w-full grid-cols-2">
                <button onClick={() => setState('Drag')}>1</button>
                <button onClick={() => setState('CreateCircle')}>2</button>
                <button onClick={() => setState('CreateRect')}>3</button>
                <button onClick={() => setState('SelectionArea')}>4</button>
                <button onClick={() => setState('Drawing')}>5</button>
                <button onClick={() => setState('Erasing')}>6</button>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>
        </div>
    );
};

export default ProjectLeftSidebar;
