import ReactFlow, {
    removeElements,
    addEdge,
    MiniMap,
    Controls,
    Background,
    isNode,
    getIncomers,
    getOutgoers,
    isEdge,
} from 'react-flow-renderer';
import React, { useState, useCallback, useEffect } from 'react';
import initialElements from './initial-elements';
import DescriptionNode from './DescriptionNode';
import MultiHandleNode from './MultiHandleNode';
import styles from './questionmap.module.css';

const onLoad = (reactFlowInstance) => {
    
    reactFlowInstance.fitView();
};

const getNodeId = () => `randomnode_${+new Date()}`;

export default function QuestionMap(props) {
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements);
    const [selectedNode, setSelectedNode] = useState(null);
    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));
    const onConnect = (params) => setElements((els) => addEdge(params, els));

    const onNodeDragStop = (evt, node) => {
        
        onSave();
    }

    const nodeTypes = {
        selectorNode: DescriptionNode,
        multiNodeHandle: MultiHandleNode
    };

    const onLoad = useCallback(
        (rfi) => {
            if (!reactflowInstance) {
                setReactflowInstance(rfi);
                
            }
        },
        [reactflowInstance]
    );

    const onSave = useCallback(() => {
        if (reactflowInstance) {
            const flow = reactflowInstance.toObject();
            // localforage.setItem(flowKey, flow);
            
        }
    }, [reactflowInstance]);

    // const onRestore = useCallback(() => {
    //     const restoreFlow = async () => {
    //         const flow = await localforage.getItem(flowKey);

    //         if (flow) {
    //             const [x = 0, y = 0] = flow.position;
    //             setElements(flow.elements || []);
    //             transform({ x, y, zoom: flow.zoom || 0 });
    //         }
    //     };

    //     restoreFlow();
    // }, [setElements, transform]);

    const getAllIncomers = (node, elements) => {
        return getIncomers(node, elements).reduce(
            (memo, incomer) => [...memo, incomer, ...getAllIncomers(incomer, elements)],
            []
        )
    }

    const getAllOutgoers = (node, elements) => {
        return getOutgoers(node, elements).reduce(
            (memo, outgoer) => [...memo, outgoer, ...getAllOutgoers(outgoer, elements)],
            []
        )
    }

    const resetNodeStyles = () => {
        setElements((prevElements) => {
            return prevElements?.map((elem) => {
                if (isNode(elem)) {
                    elem.style = {
                        ...elem.style,
                        opacity: 1,
                    }
                } else {
                    elem.animated = false
                    elem.style = {
                        ...elem.style,
                        stroke: '#b1b1b7',
                        opacity: 1,
                    }
                }

                return elem
            })
        })
    }

    const highlightPath = (node, elements, selection) => {
        if (node && elements) {
            const allIncomers = getAllIncomers(node, elements)
            const allOutgoers = getAllOutgoers(node, elements)

            setElements((prevElements) => {
                return prevElements?.map((elem) => {
                    const incomerIds = allIncomers.map((i) => i.id)
                    const outgoerIds = allOutgoers.map((o) => o.id)

                    if (isNode(elem) && (allOutgoers.length > 0 || allIncomers.length > 0)) {
                        const highlight = elem.id === node.id || incomerIds.includes(elem.id) || outgoerIds.includes(elem.id)

                        elem.style = {
                            ...elem.style,
                            opacity: highlight ? 1 : 0.25,
                        }
                    }

                    if (isEdge(elem)) {
                        if (selection) {
                            const animated =
                                incomerIds.includes(elem.source) && (incomerIds.includes(elem.target) || node.id === elem.target)
                            elem.animated = animated

                            elem.style = {
                                ...elem.style,
                                stroke: animated ? "#ff0000" : '#b1b1b7',
                                opacity: animated ? 1 : 0.25,
                            }
                        } else {
                            elem.animated = false
                            elem.style = {
                                ...elem.style,
                                stroke: '#b1b1b7',
                                opacity: 1,
                            }
                        }
                    }

                    return elem
                })
            })
        }
    }

    return (
        <div className={styles.container}>
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                onLoad={onLoad}
                snapToGrid={true}
                snapGrid={[15, 15]}
                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}

                onNodeMouseEnter={(_event, node) => !selectedNode && highlightPath(node, elements)}
                onNodeMouseLeave={() => !selectedNode && resetNodeStyles()}
                onSelectionChange={(selectedElements) => {
                    
                    if (selectedElements) {
                        const node = selectedElements[0];
                        setSelectedNode(node)
                        highlightPath(node, elements, true);
                    }
                }}
                onPaneClick={() => {
                    resetNodeStyles()
                    setSelectedNode(undefined)
                }}
            >
                <MiniMap
                    nodeStrokeColor={(n) => {
                        if (n.style?.background) return n.style.background;
                        if (n.type === 'input') return '#0041d0';
                        if (n.type === 'output') return '#ff0072';
                        if (n.type === 'default') return '#1a192b';

                        return '#eee';
                    }}
                    nodeColor={(n) => {
                        if (n.style?.background) return n.style.background;

                        return '#fff';
                    }}
                    nodeBorderRadius={2}
                />
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
    );
}