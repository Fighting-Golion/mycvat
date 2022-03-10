// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Menu from 'antd/lib/menu';
import Upload from 'antd/lib/upload';
import Button from 'antd/lib/button';
import Text from 'antd/lib/typography/Text';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { DimensionType } from '../../reducers/interfaces';

interface Props {
    menuKey: string;
    loaders: any[];
    loadActivity: string | null;
    onFileUpload(format: string, file: File): void;
    taskDimension: DimensionType;
}

export default function LoadSubmenu(props: Props): JSX.Element {
    const {
        menuKey, loaders, loadActivity, onFileUpload, taskDimension,
    } = props;
    function LoadMyMask():void{
        let Blobdata:BlobPart[] = ["000","000"]
        let file:File = new File(Blobdata,'0.txt');
        console.log(loaders);
        onFileUpload("My mask 1.1", file);
    }
    return (
        <Menu.SubMenu key={menuKey} title='Upload annotations'>
            {loaders
                .sort((a: any, b: any) => a.name.localeCompare(b.name))
                .filter((loader: any): boolean => loader.dimension === taskDimension)
                .map(
                    (loader: any): JSX.Element => {
                        const accept = loader.format
                            .split(',')
                            .map((x: string) => `.${x.trimStart()}`)
                            .join(', '); // add '.' to each extension in a list
                        const pending = loadActivity === loader.name;
                        const disabled = !loader.enabled || !!loadActivity;
                        const format = loader.name;
                        return (
                            <Menu.Item key={format} disabled={disabled} className='cvat-menu-load-submenu-item'>
                                {loader.name !== "My mask 1.1" && (    
                                <Upload
                                    accept={accept}
                                    multiple={false}
                                    showUploadList={false}
                                    beforeUpload={(file: File): boolean => {
                                        onFileUpload(format, file);
                                        return false;
                                    }}
                                >
                                
                                    <Button
                                        block
                                        type='link'
                                        disabled={disabled}
                                        className='cvat-menu-load-submenu-item-button'
                                    >
                                        <UploadOutlined />
                                        <Text>{loader.name}</Text>
                                        {pending && <LoadingOutlined style={{ marginLeft: 10 }} />}
                                    </Button>
                                </Upload>
                                )}
                                {loader.name === "My mask 1.1" && (    
                                    <Button
                                        block
                                        type='link'
                                        disabled={disabled}
                                        className='cvat-menu-load-submenu-item-button'
                                        onClick={LoadMyMask}
                                    >
                                        <UploadOutlined />
                                        <Text>{loader.name}</Text>
                                        {pending && <LoadingOutlined style={{ marginLeft: 10 }} />}
                                    </Button>

                                )}
                            </Menu.Item>
                        );
                    },
                )}
        </Menu.SubMenu>
    );
}
