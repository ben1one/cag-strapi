import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components';


import { createEditor } from 'slate'
import {
    Transforms,
  } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import { CagThemeProvider } from '@cag/cag-components';

import ProductComparisonElement, {ProductComparisonModal} from './elements/ProductComparison'
import { Button } from 'antd';
import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    TableOutlined,
    CreditCardOutlined,
  } from '@ant-design/icons';

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
const client = new ApolloClient({
  uri: 'https://www.singsaver.com.sg/api/graphql',
  cache: new InMemoryCache()
});

const withProductComparison = (editor) => {
    const newEditor = editor;
    const { isVoid, isInline } = newEditor;
    newEditor.isVoid = (element) => isVoid(element) || element.type === 'product-comparison';
    newEditor.isInline = (element) => isInline(element) || element.type === 'product-comparison';
    newEditor.insertProductComparison = (products, fields) => {
      Transforms.insertNodes(
        editor,
        { type: 'product-comparison', products, fields, children: [{ text: '' }] },
      );
    };
    return newEditor;
  }

const Wrapper = styled.div`
    border:1px solid #ccc;
    padding:1em;
    height: 500px;
`;

const Editor = ({ onChange, name, value }) => {
    const [isProductComparisonModalVisible, setIsProductComparisonModalVisible] = useState(false);
    const [isProductDetailsPaneModalVisible, setIsProductDetailsPaneModalVisible] = useState(false);

    const editor = useMemo(() => withReact(withProductComparison(createEditor())), [])
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
    const [content, setContent] = useState(parsedValue);
    const Leaf = ({ attributes, children, leaf }) => {
        if (leaf.bold) {
          children = <strong>{children}</strong>
        }
      
        if (leaf.code) {
          children = <code>{children}</code>
        }
      
        if (leaf.italic) {
          children = <em>{children}</em>
        }
      
        if (leaf.underline) {
          children = <u>{children}</u>
        }
      
        return <span {...attributes}>{children}</span>
      }
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const DefaultElement = props => {
        return <p {...props.attributes}>{props.children}</p>
      }
    const renderElement = useCallback(props => {
        console.log('props', props);
        switch (props.element.type) {
          case 'product-comparison': 
            return <ProductComparisonElement editor={editor} {...props} />
          case 'product-details': 
            return <ProductDetailsPaneElement editor={editor} {...props} />        
          default:
            return <DefaultElement {...props} />
        }
      }, [editor]);

    return (
        <ApolloProvider client={client}>
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

                    <ProductComparisonModal 
                            onCancel={()=>setIsProductComparisonModalVisible(false)}
                            visible={isProductComparisonModalVisible} 
                            defaultValue={[]} 
                            resetAfterOkOrCancel
                            onOk={({selectedProduct, selectedField})=>{
                                console.log({selectedProduct, selectedField});
                                editor.insertProductComparison(selectedProduct, selectedField);
                                setIsProductComparisonModalVisible(false);
                            }}/>
                            <Button
                                // active={isMarkActive(editor, format)}
                                onMouseDown={event => {
                                setIsProductComparisonModalVisible(true)
                                // editor.insertProductComparison('new Cag Button');
                                }}
                            >
                                <TableOutlined />
                            </Button>
                        
                        <Editable 
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            placeholder="Enter some rich text…"
                            spellCheck
                            autoFocus
                        />
                    </Slate>               
                </CagThemeProvider>
            </Wrapper>
        </ApolloProvider>

    );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;