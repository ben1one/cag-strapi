import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components';


import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import { CagThemeProvider } from '@cag/cag-components';

const Wrapper = styled.div`
    border:1px solid #ccc;
    padding:1em;
    height: 500px;
`;

const Editor = ({ onChange, name, value }) => {
    const [isProductComparisonModalVisible, setIsProductComparisonModalVisible] = useState(false);
    const [isProductDetailsPaneModalVisible, setIsProductDetailsPaneModalVisible] = useState(false);

    const editor = useMemo(() => withReact(createEditor()), [])
    let parsedValue
    try {
        parsedValue = JSON.parse(value);
    } catch (error) {
        parsedValue = [
            {
              type: 'paragraph',
              children: [{ text: 'Parse Error!' }],
            },
          ];
    }
    const [content, setContent] = useState(parsedValue)
    return (
        <Wrapper>
            <CagThemeProvider ssr={{
                isTablet: false,
                isMobile: false
            }}>
                <Slate
                    editor={editor}
                    value={content}
                    onChange={
                        newValue => {
                            setContent(newValue);
                            onChange({ target: { name, value: JSON.stringify(newValue) } });
                        }
                    }
                >
                    <Editable />
                </Slate>               
            </CagThemeProvider>
        </Wrapper>
    );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;