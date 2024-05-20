import Konva from 'konva';
import { clearAllSelection, useProjectStore } from '@/entities/project';
import { setOffDragable } from '../setDragable';

export class TextInstrument {
    isDrawing: boolean = false;
    text: Konva.Text | null = null;

    applyTextToStage() {
        const stage = useProjectStore.getState().stage;

        if (stage) {
            setOffDragable();
            stage.off('click');
            stage.on('click', this.onClick);
        }
    }

    onClick = () => {
        const layer = useProjectStore.getState().selectedLayer;
        const stage = useProjectStore.getState().stage;
        if (!layer || !stage) return;

        const transformer = layer.findOne('Transformer') as Konva.Transformer;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        const newText = new Konva.Text({
            x: pos.x,
            y: pos.y,
            text: 'Editable text',
            fontSize: 20,
            draggable: true,
            width: 200,
        });

        newText.on('transform', () => {
            newText.setAttrs({
                width: newText.width() * newText.scaleX(),
                height: newText.height() * newText.scaleY(),
                scaleX: 1,
                scaleY: 1,
            });
        });

        newText.on('dblclick', () => {
            this.editText(newText, layer, transformer);
            transformer.nodes([newText]);
            transformer.show();
            layer.batchDraw();
        });

        layer.add(newText);
        layer.batchDraw();

        // Update transformer to allow only horizontal and vertical scaling
        transformer.nodes([newText]);
        layer.add(transformer);
    };

    editText = (textNode: Konva.Text, layer: Konva.Layer, transformer: Konva.Transformer) => {
        const stage = useProjectStore.getState().stage;
        if (!stage) return;

        clearAllSelection(stage);
        transformer.nodes([textNode]);
        transformer.show();
        layer.batchDraw();

        textNode.hide();
        transformer.hide();

        const textPosition = textNode.absolutePosition();
        const areaPosition = {
            x: stage.container().offsetLeft + textPosition.x,
            y: stage.container().offsetTop + textPosition.y,
        };

        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = `${areaPosition.y}px`;
        textarea.style.left = `${areaPosition.x}px`;
        textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
        textarea.style.height = `${textNode.height() - textNode.padding() * 2 + 5}px`;
        textarea.style.fontSize = `${textNode.fontSize()}px`;
        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = textNode.lineHeight().toString();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        const rotation = textNode.rotation();
        let transform = '';
        if (rotation) {
            transform += `rotateZ(${rotation}deg)`;
        }

        let px = 0;
        const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isFirefox) {
            px += 2 + Math.round(textNode.fontSize() / 20);
        }
        transform += `translateY(-${px}px)`;

        textarea.style.transform = transform;

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight + 3}px`;

        textarea.focus();

        const removeTextarea = () => {
            if (textarea.parentNode) {
                textarea.parentNode.removeChild(textarea);
            }
            window.removeEventListener('click', handleOutsideClick);
            textNode.show();
            transformer.show();
            transformer.forceUpdate();
            layer.batchDraw();
        };

        const setTextareaWidth = (newWidth: number) => {
            if (!newWidth) {
                newWidth = textNode.text().length * textNode.fontSize();
            }
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isSafari || isFirefox) {
                newWidth = Math.ceil(newWidth);
            }

            const isEdge = document.DOCUMENT_NODE || /Edge/.test(navigator.userAgent);
            if (isEdge) {
                newWidth += 1;
            }
            textarea.style.width = `${newWidth}px`;
        };

        textarea.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                textNode.text(textarea.value);
                removeTextarea();
            }
            if (e.key === 'Escape') {
                removeTextarea();
            }
        });

        textarea.addEventListener('keydown', () => {
            const scale = textNode.getAbsoluteScale().x;
            setTextareaWidth(textNode.width() * scale);
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight + textNode.fontSize()}px`;
        });

        const handleOutsideClick = (e: MouseEvent) => {
            if (e.target !== textarea) {
                textNode.text(textarea.value);
                removeTextarea();
            }
        };
        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
        });
    };
}
