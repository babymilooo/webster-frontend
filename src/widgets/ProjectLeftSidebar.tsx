import { useProjectStore } from "@/entities/project";

const ProjectLeftSidebar = () => {
    const setState = useProjectStore((state) => state.setState);
    return (
        <div className="fixed w-[80px] bg-green-500 h-full z-10">
            <div className="grid grid-cols-2 w-full mt-6">
                <button onClick={() => setState("Drag")}>1</button>
                <button onClick={() => setState("CreateCircle")}>2</button>
                <button onClick={() => setState("CreateRect")}>3</button>
                <button onClick={() => setState("SelectionArea")}>4</button>
                <button onClick={() => setState("Drawing")}>5</button>
                <button onClick={() => setState("Erasing")}>6</button>
            </div>
        </div>
    );
};

export default ProjectLeftSidebar;