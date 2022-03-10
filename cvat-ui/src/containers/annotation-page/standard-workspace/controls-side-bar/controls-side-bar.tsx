// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { connect } from 'react-redux';

import { Canvas } from 'cvat-canvas-wrapper';
import {
    mergeObjects,
    groupObjects,
    splitTrack,
    redrawShapeAsync,
    rotateCurrentFrame,
    repeatDrawShapeAsync,
    pasteShapeAsync,
    resetAnnotationsGroup,
} from 'actions/annotation-actions';
import ControlsSideBarComponent from 'components/annotation-page/standard-workspace/controls-side-bar/controls-side-bar';
import { ActiveControl, CombinedState, Rotation } from 'reducers/interfaces';
import { KeyMap } from 'utils/mousetrap-react';
import {
    uploadJobAnnotationsAsync,
    saveAnnotationsAsync,
    setForceExitAnnotationFlag as setForceExitAnnotationFlagAction,
    removeAnnotationsAsync as removeAnnotationsAsyncAction,
} from 'actions/annotation-actions';

interface StateToProps {
    canvasInstance: Canvas;
    rotateAll: boolean;
    activeControl: ActiveControl;
    keyMap: KeyMap;
    normalizedKeyMap: Record<string, string>;
    labels: any[];
    annotationFormats: any;
    jobInstance: any;
}

interface DispatchToProps {
    mergeObjects(enabled: boolean): void;
    groupObjects(enabled: boolean): void;
    splitTrack(enabled: boolean): void;
    rotateFrame(angle: Rotation): void;
    resetGroup(): void;
    repeatDrawShape(): void;
    pasteShape(): void;
    redrawShape(): void;
    loadAnnotations(job: any, loader: any, file: File): void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        annotation: {
            canvas: { instance: canvasInstance, activeControl },
            job: { instance: jobInstance,labels },
        },
        settings: {
            player: { rotateAll },
        },
        formats: { annotationFormats },
        shortcuts: { keyMap, normalizedKeyMap },
    } = state;



    return {
        rotateAll,
        canvasInstance,
        activeControl,
        labels,
        normalizedKeyMap,
        keyMap,
        annotationFormats,
        jobInstance,
    };
}

function dispatchToProps(dispatch: any): DispatchToProps {
    return {
        loadAnnotations(job: any, loader: any, file: File): void {
            dispatch(uploadJobAnnotationsAsync(job, loader, file));
        },
        mergeObjects(enabled: boolean): void {
            dispatch(mergeObjects(enabled));
        },
        groupObjects(enabled: boolean): void {
            dispatch(groupObjects(enabled));
        },
        splitTrack(enabled: boolean): void {
            dispatch(splitTrack(enabled));
        },
        rotateFrame(rotation: Rotation): void {
            dispatch(rotateCurrentFrame(rotation));
        },
        repeatDrawShape(): void {
            dispatch(repeatDrawShapeAsync());
        },
        pasteShape(): void {
            dispatch(pasteShapeAsync());
        },
        resetGroup(): void {
            dispatch(resetAnnotationsGroup());
        },
        redrawShape(): void {
            dispatch(redrawShapeAsync());
        },
    };
}

export default connect(mapStateToProps, dispatchToProps)(ControlsSideBarComponent);
