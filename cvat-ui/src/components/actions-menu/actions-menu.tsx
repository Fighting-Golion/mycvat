// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useCallback } from 'react';
import Menu from 'antd/lib/menu';
import Modal from 'antd/lib/modal';
import { LoadingOutlined } from '@ant-design/icons';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MenuInfo } from 'rc-menu/lib/interface';

import LoadSubmenu from './load-submenu';
import { DimensionType } from '../../reducers/interfaces';

import { Form, Input, Button, Checkbox } from 'antd';

interface Props {
    taskID: number;
    taskMode: string;
    bugTracker: string;
    loaders: any[];
    dumpers: any[];
    loadActivity: string | null;
    inferenceIsActive: boolean;
    taskDimension: DimensionType;
    onClickMenu: (params: MenuInfo) => void;
    onUploadAnnotations: (format: string, file: File,bands:string) => void;
    exportIsActive: boolean;
}

export enum Actions {
    LOAD_TASK_ANNO = 'load_task_anno',
    EXPORT_TASK_DATASET = 'export_task_dataset',
    DELETE_TASK = 'delete_task',
    RUN_AUTO_ANNOTATION = 'run_auto_annotation',
    MOVE_TASK_TO_PROJECT = 'move_task_to_project',
    OPEN_BUG_TRACKER = 'open_bug_tracker',
    EXPORT_TASK = 'export_task',
}

function ActionsMenuComponent(props: Props): JSX.Element {
    const {
        taskID,
        bugTracker,
        inferenceIsActive,
        loaders,
        onClickMenu,
        onUploadAnnotations,
        loadActivity,
        taskDimension,
        exportIsActive,
    } = props;

    const onClickMenuWrapper = useCallback(
        (params: MenuInfo) => {
            if (!params) {
                return;
            }

            if (params.key === Actions.DELETE_TASK) {
                Modal.confirm({
                    title: `The task ${taskID} will be deleted`,
                    content: 'All related data (images, annotations) will be lost. Continue?',
                    className: 'cvat-modal-confirm-delete-task',
                    onOk: () => {
                        onClickMenu(params);
                    },
                    okButtonProps: {
                        type: 'primary',
                        danger: true,
                    },
                    okText: 'Delete',
                });
            } else {
                onClickMenu(params);
            }
        },
        [taskID],
    );

    const onFinish = (values: any) => {
        console.log('Success:', values);
        console.log(values.band1);
        console.log(values.band2);
        let Blobdata:BlobPart[] = ["000","000"]
        let file:File = new File(Blobdata,'0.txt');
        const bands:string = values.band1 + values.band2 + values.band3;
        console.log(bands);
        onUploadAnnotations("My mask 1.1",file,bands);
      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <Menu selectable={false} className='cvat-actions-menu' onClick={onClickMenuWrapper}>
            {LoadSubmenu({
                loaders,
                loadActivity,
                onFileUpload: (format: string, file: File): void => {
                    if (file) {
                        Modal.confirm({
                            title: 'Current annotation will be lost',
                            content: 'You are going to upload new annotations to this task. Continue?',
                            className: 'cvat-modal-content-load-task-annotation',
                            onOk: () => {
                                onUploadAnnotations(format, file,"000");
                            },
                            okButtonProps: {
                                type: 'primary',
                                danger: true,
                            },
                            okText: 'Update',
                        });
                    }
                },
                menuKey: Actions.LOAD_TASK_ANNO,
                taskDimension,
            })}
            <Menu.Item key={Actions.EXPORT_TASK_DATASET}>Export task dataset</Menu.Item>
            {!!bugTracker && <Menu.Item key={Actions.OPEN_BUG_TRACKER}>Open bug tracker</Menu.Item>}
            <Menu.Item disabled={inferenceIsActive} key={Actions.RUN_AUTO_ANNOTATION}>
                Automatic annotation
            </Menu.Item>
            <Menu.Item
                key={Actions.EXPORT_TASK}
                disabled={exportIsActive}
                icon={exportIsActive && <LoadingOutlined id='cvat-export-task-loading' />}
            >
                Backup Task
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key={Actions.MOVE_TASK_TO_PROJECT}>Move to project</Menu.Item>
            <Menu.Item key={Actions.DELETE_TASK}>Delete</Menu.Item>
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="band1"
        name="band1"
        rules={[{ required: true, message: 'Please input the band1!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="band2"
        name="band2"
        rules={[{ required: true, message: 'Please input the band2!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="band3"
        name="band3"
        rules={[{ required: true, message: 'Please input the band3!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>save choices</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
            Modify bands
        </Button>
      </Form.Item>
    </Form>
        </Menu>
    );
}

export default React.memo(ActionsMenuComponent);
