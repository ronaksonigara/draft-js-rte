import Button from '../atoms/button';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import { css } from '@emotion/core';

const LinkPopover = ({ editorRef, editorState, editLink }) => {
  const editor = useRef(editorRef.editor.closest('.rich-text-editor'));

  const getLinkData = useCallback(() => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const blockKey = selectionState.getAnchorKey();
    const offset = selectionState.getAnchorOffset();
    const block = contentState.getBlockForKey(blockKey);
    const entityKey = block.getEntityAt(offset);
    let dataOffset;
    let count = 0;
    block.findStyleRanges(
      char => {
        const key = char.getEntity();
        if (key === entityKey) {
          dataOffset = count;
        }
        count++;
        return key && contentState.getEntity(key).get('type') === 'LINK';
      },
      () => {}
    );
    const elem = editor.current.querySelector(`span[data-offset-key='${blockKey}-0-${dataOffset}']`);
    let { left, bottom } = (elem && elem.getBoundingClientRect()) || {};
    const editorPosition = editor.current.getBoundingClientRect();
    if (bottom > editorPosition.bottom || bottom < editorPosition.top) {
      left = -1000;
    }
    const { url } = contentState.getEntity(entityKey).getData();
    return { left, bottom, url };
  }, [editorState]);

  const [linkState, setLinkState] = useState(getLinkData());

  useEffect(() => {
    setLinkState(getLinkData());
  }, [editorState, getLinkData]);

  useEffect(() => {
    document.onscroll = throttle(function (event) {
      setLinkState(getLinkData());
    }, 14);
    const body = document.getElementById('body');
    if (body) {
      body.onscroll = throttle(function (event) {
        setLinkState(getLinkData());
      }, 14);
    }
    const editorBox = editor.current;
    editorBox.onscroll = throttle(function (event) {
      setLinkState(getLinkData());
    }, 14);
    return () => {
      document.onscroll = null;
      editorBox.onscroll = null;
      if (body) {
        body.onscroll = null;
      }
    };
  }, [editorState, getLinkData]);

  const style = theme => css`
    padding: 6px;
    border: 1px solid ${theme.colors.border};
    border-radius: 3px;
    background: ${theme.colors.pageBackground};
    z-index: 1;
    font-size: 14px;
    box-shadow: 2px 2px 12px -6px ${theme.colors.shadowOnPage};

    :before {
      content: '';
      position: absolute;
      border-style: solid;
      border-width: 5px;
      border-color: transparent transparent ${theme.colors.pageBackground} transparent;
      filter: drop-shadow(0 -1px 0 ${theme.colors.border});
      top: -10px;
      left: 5px;
    }
  `;

  return (
    <div css={theme => [{ position: 'fixed', left: linkState.left, top: linkState.bottom + 5 }, style(theme)]}>
      <a
        css={{
          maxWidth: 300,
          display: 'inline-block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        href={linkState.url}
        target='_blank'
      >
        {linkState.url}
      </a>
      <span css={{ marginLeft: 3 }}>
        <Button type='tertiary' size='sm' onClick={editLink}>
          Edit
        </Button>
      </span>
    </div>
  );
};

export default LinkPopover;
