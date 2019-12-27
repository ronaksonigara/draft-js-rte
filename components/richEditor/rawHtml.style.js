import styled from "@emotion/styled";
import HexRgb from "hex-rgb";

export default styled.div`
  &.raw-html {
    .editor-controls {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .control-group {
        flex: 0 0 20%;

        .rich-editor-style-button {
          padding: 4px 6px;
          cursor: pointer;
          border-radius: 2px;
          background: rgba(${props => HexRgb(props.theme.colors.textOnPageBackground).join()}, 0.2);

          svg {
            height: 18px;
            width: 18px;
            fill: ${props => props.theme.colors.textOnPageBackground};
          }
        }
      }
    }

    textarea {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      font-family: "menlo", monospace, sans-serif;
    }
  }
`;