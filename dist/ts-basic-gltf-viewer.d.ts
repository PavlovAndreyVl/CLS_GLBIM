// Generated by dts-bundle-generator v5.3.0

import { Observable } from 'rxjs';

export interface ModelFileInfo {
	url: string;
	guid: string;
	name: string;
}
export interface ModelLoadedInfo {
	url: string;
	guid: string;
	error?: Error;
}
export interface ModelLoadingInfo {
	url: string;
	guid: string;
	progress: number;
}
export interface ModelOpenedInfo {
	guid: string;
	name: string;
	handles: Set<string>;
}
export interface ColoringInfo {
	color: number;
	opacity: number;
	ids: string[];
}
export declare type MeshMergeType = "scene" | "model_uncapped" | "model_capped" | null;
export declare class GltfViewerOptions {
	dracoDecoderEnabled: boolean;
	dracoDecoderPath: string;
	highlightingEnabled: boolean;
	highlightColor: number;
	selectionColor: number;
	isolationColor: number;
	isolationOpacity: number;
	physicalLights: boolean;
	ambientLight: boolean;
	ambientLightIntensity: number;
	hemiLight: boolean;
	hemiLightIntensity: number;
	dirLight: boolean;
	dirLightIntensity: number;
	useAntialiasing: boolean;
	meshMergeType: MeshMergeType;
	constructor(item?: object);
}
export declare class GltfViewer {
	loadingStateChange$: Observable<boolean>;
	modelLoadingStart$: Observable<ModelLoadedInfo>;
	modelLoadingEnd$: Observable<ModelLoadedInfo>;
	modelLoadingProgress$: Observable<ModelLoadingInfo>;
	openedModelsChange$: Observable<ModelOpenedInfo[]>;
	selectionChange$: Observable<Set<string>>;
	manualSelectionChange$: Observable<Set<string>>;
	private _loadingStateChange;
	private _modelLoadingStart;
	private _modelLoadingEnd;
	private _modelLoadingProgress;
	private _openedModelsChange;
	private _selectionChange;
	private _manualSelectionChange;
	private _subscriptions;
	private _container;
	private _containerResizeSensor;
	private _renderer;
	private _lights;
	private _loader;
	private _colorRgbRmoUtils;
	private _cameraControls;
	private _renderMeshMergeType;
	private _renderScene;
	private _renderGeometries;
	private _renderGeometryIndexBySourceMesh;
	private _sourceMeshesByRenderGeometryIndex;
	private _sourceMeshesNeedColorUpdate;
	private _renderGeometryIndicesNeedSort;
	private _renderMeshBySourceMesh;
	private _pointerEventHelper;
	private _pickingScene;
	private _queuedColoring;
	private _queuedSelection;
	private _highlightedMesh;
	private _selectedMeshes;
	private _isolatedMeshes;
	private _coloredMeshes;
	private _loadingInProgress;
	private _loadingQueue;
	private _loadedModels;
	private _loadedModelsByGuid;
	private _loadedModelsArray;
	private _loadedMeshes;
	private _loadedMeshesById;
	private _loadedMeshesArray;
	constructor(containerId: string, options: GltfViewerOptions);
	destroy(): void;
	openModelsAsync(modelInfos: ModelFileInfo[]): Promise<ModelLoadedInfo[]>;
	closeModelsAsync(modelGuids: string[]): Promise<void>;
	colorItems(coloringInfos: ColoringInfo[]): void;
	selectItems(ids: string[]): void;
	isolateItems(ids: string[]): void;
	getOpenedModels(): ModelOpenedInfo[];
	getSelectedItems(): Set<string>;
	private initObservables;
	private closeSubjects;
	private _onCanvasPointerDown;
	private _onCanvasPointerUp;
	private _onCanvasMouseMove;
	private addCanvasEventListeners;
	private initLights;
	private initRenderer;
	private resizeRenderer;
	private updateRenderSceneAsync;
	private groupModelMeshesByMergeType;
	private buildRenderGeometryAsync;
	private updateMeshRenderMaterials;
	private sortRenderGeometriesIndicesByOpacity;
	private updateRenderGeometriesColors;
	private updateRenderGeometryColors;
	private render;
	private initLoader;
	private processLoadingQueueAsync;
	private loadModel;
	private onModelLoadingStart;
	private onModelLoadingProgress;
	private onModelLoadingEnd;
	private addModelToLoaded;
	private removeModelFromLoaded;
	private updateModelsDataArrays;
	private emitOpenedModelsChanged;
	private runQueuedColoring;
	private resetSelectionAndColorMeshes;
	private colorMeshes;
	private removeColoring;
	private getMeshAt;
	private runQueuedSelection;
	private findAndSelectMeshes;
	private findMeshesByIds;
	private removeSelection;
	private removeIsolation;
	private selectMeshAtPoint;
	private addToSelection;
	private removeFromSelection;
	private selectMeshes;
	private isolateSelectedMeshes;
	private emitSelectionChanged;
	private highlightMeshAtPoint;
	private highlightItem;
	private removeHighlighting;
}

export {};
