/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { IW, ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, memo, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_BASE,
  FONT_SIZE_HEADING,
  INFO,
  SPACE_UNIT,
  YELLOW,
} from 'styles/StyleConstants';
import { Column } from '../../../slice/types';
import DataModelNode from './DataModelNode';

const DataModelBranch: FC<{
  node: Column;
  getPermissionButton: (name) => JSX.Element;
  onNodeTypeChange;
  onMoveToHierarchy: (node: Column) => void;
  onEditBranch;
  onDelete: (node: Column) => void;
}> = memo(
  ({
    node,
    getPermissionButton,
    onNodeTypeChange,
    onMoveToHierarchy,
    onEditBranch,
    onDelete,
  }) => {
    const t = useI18NPrefix('view.model');
    const [isHover, setIsHover] = useState(false);

    const renderNode = (node, isDragging) => {
      let icon = (
        <FolderOpenOutlined style={{ alignSelf: 'center', color: YELLOW }} />
      );

      return (
        <>
          <div
            className="content"
            onMouseEnter={() => {
              setIsHover(true);
            }}
            onMouseLeave={() => {
              setIsHover(false);
            }}
          >
            <IW fontSize={FONT_SIZE_HEADING}>{icon}</IW>
            <span>{node.name}</span>
            <div className="action">
              {isHover && !isDragging && (
                <Tooltip title={t('rename')}>
                  <ToolbarButton
                    size="small"
                    iconSize={FONT_SIZE_BASE}
                    className="suffix"
                    onClick={() => onEditBranch(node)}
                    icon={<EditOutlined style={{ color: INFO }} />}
                  />
                </Tooltip>
              )}
              {isHover && !isDragging && (
                <Tooltip title={t('delete')}>
                  <ToolbarButton
                    size="small"
                    iconSize={FONT_SIZE_BASE}
                    className="suffix"
                    onClick={() => onDelete(node)}
                    icon={<DeleteOutlined style={{ color: INFO }} />}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          <div className="children">
            {node?.children?.map(childNode => (
              <DataModelNode
                node={childNode}
                getPermissionButton={getPermissionButton}
                onMoveToHierarchy={onMoveToHierarchy}
                onNodeTypeChange={onNodeTypeChange}
              />
            ))}
          </div>
        </>
      );
    };
    const getListStyle = isDraggingOver => ({
      background: isDraggingOver ? 'lightblue' : 'grey',
      padding: 2,
      width: 250,
    });

    return (
      <Draggable key={node?.name} draggableId={node?.name} index={node?.index}>
        {(draggableProvided, draggableSnapshot) => (
          <StyledDataModelNode
            isDragging={draggableSnapshot.isDragging}
            style={draggableProvided.draggableProps.style}
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
          >
            <Droppable
              droppableId={node?.name}
              type="Branch"
              isDropDisabled={false}
              isCombineEnable={true}
            >
              {(droppableProvided, droppableSnapshot) => (
                <div
                  ref={droppableProvided.innerRef}
                  style={getListStyle(droppableSnapshot.isDraggingOver)}
                >
                  {renderNode(node, draggableSnapshot.isDragging)}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </StyledDataModelNode>
        )}
      </Draggable>
    );
  },
);

export default DataModelBranch;

const StyledDataModelNode = styled.div<{
  isDragging: boolean;
}>`
  line-height: 32px;
  margin: ${SPACE_UNIT};
  user-select: 'none';
  background: ${p =>
    p.isDragging ? p.theme.emphasisBackground : 'transparent'};
  font-size: ${FONT_SIZE_BASE};

  & .content {
    display: flex;
  }

  & .children {
    margin-left: 40px;
  }

  & .action {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    padding-right: ${FONT_SIZE_BASE}px;
  }
`;