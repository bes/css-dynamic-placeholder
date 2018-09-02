import React from "react";
import {
  Button,
  Col,
  Grid,
  Modal,
  Nav,
  Navbar,
  NavItem
} from "react-bootstrap";
import fscreen from "fscreen";
import * as Row from "react-bootstrap/lib/Row";
import style from "./my-component.module.less";

import ElementCache from "./element-cache";
interface Props {
  // Empty
}

enum CanvasMode {
  EMBED,
  MODAL,
  FULLSCREEN
}

interface State {
  showModal: boolean;
  canvasMode: CanvasMode;
  canvasEl?: HTMLElement;
}

const CANVAS_ID = "canvasEl";

class MyComponent extends React.Component<Props, State> {
  private fullscreenDiv?: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      canvasMode: CanvasMode.EMBED
    };
  }

  componentDidMount() {
    const canvasEl = document.getElementById(CANVAS_ID)!;
    this.setState({ canvasEl });
    // this.startUpdateElementPositionLoop();
    this.registerFscreenCallbacks();
  }

  componentWillUnmount() {
    this.unregisterFscreenCallbacks();
  }

  // tslint:disable-next-line:no-unused
  // componentDidUpdate(prevProps: Props, prevState: State) {
  //     if (this.state.targetId !== prevState.targetId) {
  //         this.updateTarget();
  //     }
  // }

  // private updateTarget = () => {
  //     const target = document.getElementById(this.state.targetId);
  //     if (target) {
  //         this.setState({ target });
  //     }
  // };

  private showModal = () => {
    this.setState({
      showModal: true,
      canvasMode: CanvasMode.MODAL
    });
  };

  private onHideModal = () => {
    this.setState({
      showModal: false,
      canvasMode: CanvasMode.EMBED
    });
  };

  // private mountSource = (src: HTMLDivElement) => {
  //     this.src = src;
  // };

  // private startUpdateElementPositionLoop = () => {
  //     if (!this.renderActive) {
  //         this.renderActive = true;
  //         this.updateElementPositionLoop();
  //     }
  // };

  // private stopUpdateElementPositionLoop = () => {
  //     if (this.renderActive) {
  //         this.renderActive = false;
  //         if (this.animationFrameId) {
  //             window.cancelAnimationFrame(this.animationFrameId);
  //         }
  //     }
  // };

  // private updateElementPositionLoop = () => {
  //     this.fixRenderElementPosition();
  //     if (this.renderActive) {
  //         this.animationFrameId = window.requestAnimationFrame(this.updateElementPositionLoop);
  //     }
  // };

  private enterFullscreen = () => {
    this.setState(
      {
        canvasMode: CanvasMode.FULLSCREEN
      },
      () => {
        if (this.fullscreenDiv) {
          fscreen.requestFullscreen(this.fullscreenDiv);
        }
      }
    );
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

  // private fixRenderElementPosition = () => {
  //     const { target, targetId } = this.state;
  //     const { src } = this;

  //     if (target && src) {
  //         const targetPos = target.getBoundingClientRect();
  //         switch (targetId) {
  //             case "target1": {
  //                 const top = totalOffsetTop(target);
  //                 const left = totalOffsetLeft(target);
  //                 src.style.top = `${top}px`;
  //                 src.style.left = `${left}px`;
  //                 src.style.width = `${targetPos.width}px`;
  //                 src.style.height = `${targetPos.height}px`;
  //                 break;
  //             }
  //             case "target2": {
  //                 const sourcePos = src.getBoundingClientRect();
  //                 if (targetPos.top !== sourcePos.top) {
  //                     src.style.top = `${targetPos.top}px`;
  //                 }
  //                 if (targetPos.left !== sourcePos.left) {
  //                     src.style.left = `${targetPos.left}px`;
  //                 }
  //                 if (targetPos.width !== sourcePos.width) {
  //                     src.style.width = `${targetPos.width}px`;
  //                 }
  //                 if (targetPos.height !== sourcePos.height) {
  //                     src.style.height = `${targetPos.height}px`;
  //                 }
  //                 break;
  //             }
  //             case "fullscreen": {
  //                 src.style.top = "0px";
  //                 src.style.left = "0px";
  //                 src.style.width = `${targetPos.width}px`;
  //                 src.style.height = `${targetPos.height}px`;
  //                 break;
  //             }
  //         }
  //     }
  // };

  private onFullScreenChange = () => {
    const isFullScreen = fscreen.fullscreenElement !== null;
    if (!isFullScreen) {
      this.setState({ canvasMode: CanvasMode.EMBED });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Grid>
          <Navbar collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>Title</Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <NavItem>Item 1</NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Row>
            <Col xs={12}>
              <div
                id="target1"
                style={{
                  width: "100%",
                  height: "20vh",
                  background: "red",
                  position: "relative"
                }}
              >
                {this.state.canvasMode === CanvasMode.EMBED ? (
                  <ElementCache cacheName="canvas">
                    <div
                      className={`${style.surface} ${style.sourceCanvas}`}
                      style={{
                        background: "blue",
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                      }}
                    >
                      I'm a "Canvas"
                    </div>
                  </ElementCache>
                ) : null}
              </div>

              <Button onClick={this.showModal}>Show modal</Button>
              <Button onClick={this.enterFullscreen}>Enter fullscreen</Button>

              <p>
                Imagine a canvas that can be placed in multiple locations, and
                is therefore not suitable as a child of any specific DOM node,
                but rather lives its own life in the "root" of the react DOM.
              </p>

              <p>
                Try using this site in "mobile" mode and expand the menu - yet
                another case that is tricky even with absolute positioning,
                without using a requestAnimationFrame loop.
              </p>

              <p>
                Using such loops to position elements that render OpenGL stuff
                or videos inevitably leads to glitches and / or bad performance.
              </p>

              <div style={{ height: "150vh", background: "grey" }}>
                There is a lot of content on this page.
              </div>
            </Col>
          </Row>
        </Grid>
        <Modal show={this.state.showModal} onHide={this.onHideModal}>
          <Modal.Header closeButton>A modal</Modal.Header>
          <Modal.Body>
            <div
              id="target2"
              style={{
                width: "100%",
                height: "50vh",
                background: "red",
                position: "relative"
              }}
            >
              {this.state.canvasMode === CanvasMode.MODAL ? (
                <ElementCache cacheName="canvas">
                  <div
                    className={`${style.surface} ${style.sourceCanvas}`}
                    style={{
                      background: "green",
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0
                    }}
                  >
                    I'm a "Canvas"
                  </div>
                </ElementCache>
              ) : null}
            </div>

            <p>
              This bootstrap modal has fixed positioning externally, and we
              can't position the canvas properly without using a loop.
            </p>

            <div style={{ height: "150vh", background: "grey" }}>
              This modal has a lot of content and is scrollable.
            </div>
          </Modal.Body>
        </Modal>
        <div
          id="fullscreen"
          ref={this.mountFullscreenDiv}
          className={style.fullScreenWrap}
          style={{ position: "relative" }}
        >
          {this.state.canvasMode === CanvasMode.FULLSCREEN ? (
            <ElementCache cacheName="canvas">
              <div
                className={`${style.surface} ${style.sourceCanvas}`}
                style={{
                  background: "hotpink",
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0
                }}
              >
                I'm a "Canvas"
              </div>
            </ElementCache>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export { MyComponent };
