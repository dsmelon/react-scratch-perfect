import React, { PureComponent } from 'react';
import './index.less';
interface props {
    clear?: boolean;
    color?: string;
    className?: string;
    size?: number;
    onSuccess?: () => void;
    onChange?: (p: number) => void;
    imgRepeat?: "width" | "height" | "repeat";
    round?: number[];
    img?: string;
    mode?: "move" | "end";
    percentage?: number;
}
interface state {
    ch: number;
    cw: number;
    isSuccess: boolean;
    visible: boolean;
}
export default class extends PureComponent<props, state> {
    state: {
        ch: number;
        cw: number;
        isSuccess: boolean;
        visible: boolean;
    };
    image: HTMLImageElement;
    wrap: HTMLDivElement;
    canvas: HTMLCanvasElement;
    ptg: number;
    size: number;
    round: number[];
    cells: boolean[];
    roundX: number[];
    roundY: number[];
    cellX: number;
    cellY: number;
    sum: number;
    roundLen: number;
    offsetLeft: number;
    offsetTop: number;
    preX: number;
    preY: number;
    ctx: CanvasRenderingContext2D;
    componentDidMount(): void;
    init: (bol: boolean) => void;
    down: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> & React.TouchEvent<Element>) => void;
    move: (e: MouseEvent & TouchEvent) => void;
    up: (e: TouchEvent & MouseEvent, bol?: boolean) => void;
    addRound: (preX: number, preY: number, curX: number, curY: number) => void;
    handleRound: (curX: number, curY: number) => void;
    checkRound: (e: TouchEvent & MouseEvent) => void;
    render(): JSX.Element;
}
export {};
