import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import '../styles/styleTest.css';

const ItemType = 'BLOCK';
const titulo = "Viagem à Lua";

const Block = ({ block, index, moveBlock, handleVoiceChange, handleTextChange, handleDeleteBlock, handleColorChange }) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (item, monitor) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();

            if (!clientOffset) {
                return;
            }

            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveBlock(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { type: ItemType, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`block ${isDragging ? 'isDragging' : ''}`}
            style={{ backgroundColor: block.color }}
        >
            <div className='block-inputs'>
                <div className='block-inputs-select'>
                    <select
                        value={block.voice}
                        onChange={(event) => handleVoiceChange(index, event)}
                    >
                        <option value="">Escolha a voz...</option>
                        <option value="voz1">Voz 1</option>
                        <option value="voz2">Voz 2</option>
                        <option value="voz3">Voz 3</option>
                    </select>
                    <select
                        value={block.color}
                        onChange={(event) => handleColorChange(index, event)}
                    >
                        <option value="#007BFF">Azul</option>
                        <option value="#28A745">Verde</option>
                        <option value="#DC3545">Vermelho</option>
                        <option value="#FFC107">Amarelo</option>
                        <option value="#6C757D">Cinza</option>
                    </select>
                </div>
                <textarea
                    value={block.text}
                    onChange={(event) => handleTextChange(index, event)}
                    placeholder="Digite o texto narrado..."
                />
            </div>
            <div className='remover'>
                <button onClick={() => handleDeleteBlock(index)}>Remover Bloco</button>
            </div>
        </div>
    );
};

const App = () => {
    const [blocks, setBlocks] = useState([{ voice: '', text: '', color: '#007BFF' }]);

    const handleAddBlock = () => {
        setBlocks([...blocks, { voice: '', text: '', color: '#007BFF' }]);
    };

    const handleDeleteBlock = (index) => {
        const updatedBlocks = [...blocks];
        updatedBlocks.splice(index, 1);
        setBlocks(updatedBlocks);
    };

    const handleVoiceChange = (index, event) => {
        const { value } = event.target;
        const updatedBlocks = [...blocks];
        updatedBlocks[index].voice = value;
        setBlocks(updatedBlocks);
    };

    const handleTextChange = (index, event) => {
        const { value } = event.target;
        const updatedBlocks = [...blocks];
        updatedBlocks[index].text = value;
        setBlocks(updatedBlocks);
    };

    const handleColorChange = (index, event) => {
        const { value } = event.target;
        const updatedBlocks = [...blocks];
        updatedBlocks[index].color = value;
        setBlocks(updatedBlocks);
    };

    const moveBlock = (fromIndex, toIndex) => {
        const updatedBlocks = update(blocks, {
            $splice: [
                [fromIndex, 1],
                [toIndex, 0, blocks[fromIndex]],
            ],
        });
        setBlocks(updatedBlocks);
    };

    const getBlocksStructure = () => {
        return blocks;
    };

    return (
        <div>
            <div className='exemploNavBar'></div>
            <div className="main-container">
                <nav className='nav-container'>
                    <div className='nav-item'>
                        <label>ICON</label>
                        <p>Cadastrar Roteiro</p>
                    </div>
                    <div className='nav-item selected'>
                        <label>ICON</label>
                        <p>Editor de Roteiro</p>
                    </div>
                </nav>
                <div className='section-title'>
                    <div className='title'>
                        <h2>{titulo}</h2>
                    </div>
                </div>
                <DndProvider backend={HTML5Backend}>
                    <div className="app-container">
                        {blocks.map((block, index) => (
                            <Block
                                key={index}
                                index={index}
                                block={block}
                                moveBlock={moveBlock}
                                handleVoiceChange={handleVoiceChange}
                                handleTextChange={handleTextChange}
                                handleDeleteBlock={handleDeleteBlock}
                                handleColorChange={handleColorChange}
                            />
                        ))}
                        <button onClick={handleAddBlock}>Adicionar Bloco</button>
                        <button onClick={() => console.log(getBlocksStructure())}>Mostrar Estrutura dos Blocos</button>
                    </div>
                </DndProvider>
            </div>
        </div>
    );
};

export default App;
