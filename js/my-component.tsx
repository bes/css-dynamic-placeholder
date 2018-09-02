import React from "react";
import {
    Button,
    Col,
    Grid, Modal,
    Nav,
    Navbar, NavItem,
} from "react-bootstrap";
import * as Row from "react-bootstrap/lib/Row";
import fscreen from "fscreen";
import style from "./my-component.module.less";

interface Props {
    // Empty
}

interface State {
    showModal: boolean;
    targetId: string;
    target: HTMLElement | null;
}

function totalOffsetTop(element: HTMLElement): number {
    let el: Element | undefined = element;
    let offsetTop = 0;
    while (el instanceof HTMLElement) {
        offsetTop += el.offsetTop;
        el = el.offsetParent;
    }
    return offsetTop;
}

function totalOffsetLeft(element: HTMLElement): number {
    let el: Element | undefined = element;
    let offsetLeft = 0;
    while (el instanceof HTMLElement) {
        offsetLeft += el.offsetLeft;
        el = el.offsetParent;
    }
    return offsetLeft;
}

class MyComponent extends React.Component<Props, State> {

    private renderActive = false;

    private src?: HTMLDivElement;

    private fullscreenDiv?: HTMLDivElement;

    private animationFrameId?: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            showModal: false,
            targetId: "target1",
            // tslint:disable-next-line:no-null-keyword
            target: null,
        };
    }

    componentDidMount() {
        const target = document.getElementById(this.state.targetId);
        this.setState({ target });
        this.startUpdateElementPositionLoop();
        this.registerFscreenCallbacks();
    }

    componentWillUnmount() {
        this.stopUpdateElementPositionLoop();
        this.unregisterFscreenCallbacks();
    }

    // tslint:disable-next-line:no-unused
    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.state.targetId !== prevState.targetId) {
            this.updateTarget();
        }
    }

    private updateTarget = () => {
        const target = document.getElementById(this.state.targetId);
        if (target) {
            this.setState({ target });
        }
    };

    private showModal = () => {
        this.setState({
            showModal: true,
            targetId: "target2",
        });
    };

    private onHideModal = () => {
        this.setState({
            showModal: false,
            targetId: "target1",
        });
    };

    private mountSource = (src: HTMLDivElement) => {
        this.src = src;
    };

    private startUpdateElementPositionLoop = () => {
        if (!this.renderActive) {
            this.renderActive = true;
            this.updateElementPositionLoop();
        }
    };

    private stopUpdateElementPositionLoop = () => {
        if (this.renderActive) {
            this.renderActive = false;
            if (this.animationFrameId) {
                window.cancelAnimationFrame(this.animationFrameId);
            }
        }
    };

    private updateElementPositionLoop = () => {
        this.fixRenderElementPosition();
        if (this.renderActive) {
            this.animationFrameId = window.requestAnimationFrame(this.updateElementPositionLoop);
        }
    };

    private enterFullscreen = () => {
        this.setState({
            targetId: "fullscreen",
        }, () => {
            if (this.fullscreenDiv) {
                fscreen.requestFullscreen(this.fullscreenDiv);
            }
        });
    };

    private mountFullscreenDiv = (fullscreenDiv: HTMLDivElement) => {
        this.fullscreenDiv = fullscreenDiv;
    };

    private registerFscreenCallbacks = () => {
        fscreen.addEventListener("fullscreenchange", this.onFullScreenChange);
    };

    private unregisterFscreenCallbacks = () => {
        fscreen.removeEventListener("fullscreenchange", this.onFullScreenChange);
    };

    private fixRenderElementPosition = () => {
        const { target, targetId } = this.state;
        const { src } = this;

        if (target && src) {
            const targetPos = target.getBoundingClientRect();
            switch (targetId) {
                case "target1": {
                    const top = totalOffsetTop(target);
                    const left = totalOffsetLeft(target);
                    src.style.top = `${top}px`;
                    src.style.left = `${left}px`;
                    src.style.width = `${targetPos.width}px`;
                    src.style.height = `${targetPos.height}px`;
                    break;
                }
                case "target2": {
                    const sourcePos = src.getBoundingClientRect();
                    if (targetPos.top !== sourcePos.top) {
                        src.style.top = `${targetPos.top}px`;
                    }
                    if (targetPos.left !== sourcePos.left) {
                        src.style.left = `${targetPos.left}px`;
                    }
                    if (targetPos.width !== sourcePos.width) {
                        src.style.width = `${targetPos.width}px`;
                    }
                    if (targetPos.height !== sourcePos.height) {
                        src.style.height = `${targetPos.height}px`;
                    }
                    break;
                }
                case "fullscreen": {
                    src.style.top = "0px";
                    src.style.left = "0px";
                    src.style.width = `${targetPos.width}px`;
                    src.style.height = `${targetPos.height}px`;
                    break;
                }
            }
        }
    };

    private onFullScreenChange = () => {
        const isFullScreen = (fscreen.fullscreenElement !== null);
        if (!isFullScreen) {
            this.setState({ targetId: "target1" });
        }
    };

    render() {
        let display = "none";
        let zIndex: ("auto" | number) = "auto";
        let position: "fixed" | "absolute" = "absolute";

        if (this.src && this.state.target) {
            display = "block";

            if (this.state.targetId === "target2") {
                zIndex = 2001;
                position = "fixed";
            }
        }

        return (
            <React.Fragment>
                <Grid>
                    <Navbar collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                Title
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav>
                                <NavItem>
                                    Item 1
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Row>
                        <Col xs={12}>
                            <div id="target1" style={{ width: "100%", height: "20vh", background: "red" }}/>

                            <Button
                                onClick={this.showModal}
                            >
                                Show modal
                            </Button>
                            <Button
                                onClick={this.enterFullscreen}
                            >
                                Enter fullscreen
                            </Button>

                            <p>
                                Imagine a canvas that can be placed in multiple locations, and is therefore not suitable as
                                a child of any specific DOM node, but rather lives its own life in the "root" of the react DOM.
                            </p>

                            <p>
                                Try using this site in "mobile" mode and expand the menu - yet another case that is tricky
                                even with absolute positioning, without using a requestAnimationFrame loop.
                            </p>

                            <p>
                                Using such loops to position elements that render OpenGL stuff or videos inevitably leads
                                to glitches and / or bad performance.
                            </p>

                            <div style={{ height: "150vh", background: "grey" }}>
                                There is a lot of content on this page.
                            </div>
                        </Col>
                    </Row>
                </Grid>
                <Modal show={this.state.showModal} onHide={this.onHideModal}>
                    <Modal.Header closeButton>
                        A modal
                    </Modal.Header>
                    <Modal.Body>
                        <div
                            id="target2"
                            ref={this.updateTarget}
                            style={{ width: "100%", height: "50vh", background: "red" }}
                        />

                        <p>
                            This bootstrap modal has fixed positioning externally, and we can't position the canvas
                            properly without using a loop.
                        </p>

                        <div style={{ height: "150vh", background: "grey" }}>
                            This modal has a lot of content and is scrollable.
                        </div>

                    </Modal.Body>
                </Modal>
                <div id="fullscreen" ref={this.mountFullscreenDiv} className={style.fullScreenWrap}>
                    <div
                        ref={this.mountSource}
                        className={`${style.surface} ${style.sourceCanvas}`}
                        style={{ display, zIndex, position, background: "blue" }}
                    >
                        I'm a "Canvas"
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export {
    MyComponent,
};
