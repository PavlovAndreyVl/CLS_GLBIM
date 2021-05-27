// Generated by dts-bundle-generator v5.9.0

import { Observable } from 'rxjs';

export declare type MeshMergeType = "scene" | "model" | "model+" | null;
export declare type FastRenderType = "ch" | "aabb" | "ombb" | null;
export declare type CornerName = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export declare type MarkerType = "warn_0" | "warn_1" | "warn_2" | "warn_3" | "photo";
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
export interface MarkerInfo {
	id: string;
	description: string;
	position: Vec4DoubleCS;
	type: MarkerType;
}
export interface SnapPoint {
	meshId: string;
	position: Vec4DoubleCS;
}
declare class Vec4 {
	x: number;
	y: number;
	z: number;
	w: number;
	constructor(x: number, y: number, z: number, w?: number);
	static getDistance(start: Vec4, end: Vec4): Vec4;
}
export declare class Vec4DoubleCS {
	private _x;
	private _y;
	private _z;
	private _w;
	get x(): number;
	get w(): number;
	get y_Yup(): number;
	get z_Yup(): number;
	get y_Zup(): number;
	get z_Zup(): number;
	constructor(isZup?: boolean, x?: number, y?: number, z?: number, w?: number);
	static fromVector3(vec: {
		x: number;
		y: number;
		z: number;
	}, isZup?: boolean): Vec4DoubleCS;
	toVec4(isZup?: boolean): Vec4;
	equals(other: Vec4DoubleCS): boolean;
}
export declare class Distance {
	start: Vec4;
	end: Vec4;
	distance: Vec4;
	constructor(start: {
		x: number;
		y: number;
		z: number;
	}, end: {
		x: number;
		y: number;
		z: number;
	});
}
export declare class GltfViewerOptions {
	useAntialiasing: boolean;
	usePhysicalLights: boolean;
	ambientLightIntensity: number;
	hemiLightIntensity: number;
	dirLightIntensity: number;
	highlightingEnabled: boolean;
	highlightColor: number;
	selectionColor: number;
	isolationColor: number;
	isolationOpacity: number;
	meshMergeType: MeshMergeType;
	fastRenderType: FastRenderType;
	axesHelperEnabled: boolean;
	axesHelperPlacement: CornerName;
	axesHelperSize: number;
	basePoint: Vec4DoubleCS;
	selectionAutoFocusEnabled: boolean;
	cameraControlsDisabled: boolean;
	constructor(item?: object);
}
export declare type ViewerInteractionMode = "select_mesh" | "select_vertex" | "select_sprite" | "measure_distance";
export declare class GltfViewer {
	optionsChange$: Observable<GltfViewerOptions>;
	modeChange$: Observable<ViewerInteractionMode>;
	contextLoss$: Observable<boolean>;
	lastFrameTime$: Observable<number>;
	cameraPositionChange$: Observable<Vec4DoubleCS>;
	loadingStateChange$: Observable<boolean>;
	modelLoadingStart$: Observable<ModelLoadedInfo>;
	modelLoadingEnd$: Observable<ModelLoadedInfo>;
	modelLoadingProgress$: Observable<ModelLoadingInfo>;
	modelsOpenedChange$: Observable<ModelOpenedInfo[]>;
	meshesSelectionChange$: Observable<Set<string>>;
	meshesManualSelectionChange$: Observable<Set<string>>;
	snapPointsHighlightChange$: Observable<SnapPoint>;
	snapPointsManualSelectionChange$: Observable<SnapPoint[]>;
	markersChange$: Observable<MarkerInfo[]>;
	markersHighlightChange$: Observable<MarkerInfo>;
	markersSelectionChange$: Observable<MarkerInfo[]>;
	markersManualSelectionChange$: Observable<MarkerInfo[]>;
	distanceMeasureChange$: Observable<Distance>;
	private _subscriptions;
	private _container;
	private _containerResizeObserver;
	private _options;
	private _interactionMode;
	private _cameraService;
	private _loaderService;
	private _scenesService;
	private _renderService;
	private _pickingService;
	private _highlightService;
	private _selectionService;
	private _coloringService;
	private _hudService;
	private _pointerEventHelper;
	private _selectionFrame;
	private _modeChange;
	private _optionsChange;
	private _contextLoss;
	private _lastFrameTime;
	constructor(containerSelector: string, dracoDecoderPath: string, options: GltfViewerOptions);
	destroy(): void;
	updateOptionsAsync(options: GltfViewerOptions): Promise<GltfViewerOptions>;
	setInteractionMode(value: ViewerInteractionMode): void;
	openModelsAsync(modelInfos: ModelFileInfo[]): Promise<ModelLoadedInfo[]>;
	closeModelsAsync(modelGuids: string[]): Promise<void>;
	getOpenedModels(): ModelOpenedInfo[];
	colorItems(coloringInfos: ColoringInfo[]): void;
	selectItems(ids: string[]): void;
	isolateItems(ids: string[]): void;
	zoomToItems(ids: string[]): void;
	getSelectedItems(): Set<string>;
	setMarkers(markers: MarkerInfo[]): void;
	selectMarkers(ids: string[]): void;
	private initObservables;
	private closeSubjects;
	private clearDownPoint;
	private onRendererPointerDown;
	private onRendererPointerMove;
	private onRendererPointerUp;
	private onRendererContextLoss;
	private onRendererContextRestore;
	private initLoaderService;
	private initCameraService;
	private initPickingService;
	private initHighlightService;
	private initSelectionService;
	private initColoringService;
	private initScenesService;
	private initHudService;
	private initRenderService;
}

export {};
