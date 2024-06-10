import { clearAllSelection, useProjectStore } from '@/entities/project';
import { EyeNoneIcon } from '@radix-ui/react-icons';
import Konva from 'konva';
import { EyeIcon } from 'lucide-react';
import { FC, useState } from 'react';

export const LayerButton: FC<{ layer: Konva.Layer; index?: number }> = ({
    layer,
    index,
}) => {
    const toggleLayersSwitch = useProjectStore(
        (state) => state.toggleLayersSwitch,
    );
    const setSelectedLayer = useProjectStore((state) => state.setSelectedLayer);
    const selectedLayer = useProjectStore((state) => state.selectedLayer);
    const setUpdatePreview = useProjectStore((state) => state.setUpdatePreview);
    const setSelectredShape = useProjectStore(
        (state) => state.setSelectredShape,
    );
    const [toggle, setToggle] = useState(true);
    if (layer.getAttr('hidden')) return null;

    const handleToggleVisibility = () => {
        layer.getChildren().forEach((shape) => {
            shape.visible(!shape.visible());
        });
        setUpdatePreview();
        toggleLayersSwitch();
        setToggle(!toggle);
    };

    return (
        <div
            className={`flex h-10 w-full justify-between p-2 ${
                layer == selectedLayer ? ' bg-secondary' : ''
            }`}
            onClick={() => {
                clearAllSelection();
                setSelectedLayer(layer);
                setSelectredShape(null);
            }}
        >
            <span className="flex items-center justify-center align-middle">
                Layer {layer.getAttr('creationIndex')}
            </span>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => {
                        layer.moveUp();
                        toggleLayersSwitch();
                        setUpdatePreview();
                    }}
                >
                    Up
                </button>
                <button
                    type="button"
                    onClick={() => {
                        layer.moveDown();
                        toggleLayersSwitch();
                        setUpdatePreview();
                    }}
                >
                    Down
                </button>
                <div className="flex items-center">
                    {toggle ? (
                        <EyeIcon
                            className="h-7 w-7"
                            onClick={handleToggleVisibility}
                        />
                    ) : (
                        <EyeNoneIcon
                            className="h-7 w-7"
                            onClick={handleToggleVisibility}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
