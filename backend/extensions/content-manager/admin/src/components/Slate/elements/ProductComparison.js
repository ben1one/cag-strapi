import React, { useCallback, useMemo, useState } from 'react'
import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Node,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'
import { Button, Divider, Modal, Select, Tabs, Tree } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { ModulabTable } from '@cag/cag-components';
import * as R from 'ramda'
import { gql, useQuery } from '@apollo/client';

import 'antd/dist/antd.css';

const { TabPane } = Tabs;
const { Option } = Select;

const findById = (id, products) => {
    return R.find(R.propEq('id', id))(products.resultsPage.products);
}

const CC_QUERY = gql`
query GetCreditCards($language: String!, $list: String, $providers: [String], $needs: [String], $minAnnualSalary: Int, $timestamp: Long, $promotionalBanners: [String], $images: [String], $staticTextKeys: [String!]) {
    pageConfig(language: $language) {
      staticPageText {
        staticText: text(keys: $staticTextKeys) {
          key
          display(context: [COMMON, LOGIN])
          __typename
        }
        __typename
      }
      __typename
    }
    seoMetadata(language: $language, vertical: CC, list: $list) {
      ...SeoMetadata
      __typename
    }
    resultsPage: ccResultsPage(language: $language, providers: $providers, list: $list, needs: $needs, minAnnualSalary: $minAnnualSalary, timestamp: $timestamp) {
      ...CcResultsPage
      __typename
    }
    promotionalBanners: imageAndLink(language: $language, title: $promotionalBanners) {
      ...ImageAndLink
      __typename
    }
    customerProfile: customerProfile(language: $language) {
      ...CustomerProfile
      __typename
    }
    images: imageAndLink(language: $language, title: $images) {
      ...ImageAndLink
      __typename
    }
  }
  
  fragment SeoMetadata on SeoMetadata {
    title
    metaTitle
    metaDescription
    image {
      url
      description
      __typename
    }
    sitemap
    canonicalLink
    robotsMetaDirectives
    pagination {
      next
      prev
      __typename
    }
    seoTable {
      ...SeoTable
      __typename
    }
    __typename
  }
  
  fragment CcResultsPage on CcResultsPage {
    verticalName: name
    numberMoreResults
    numberInitialResults
    displayHeading
    latestNews {
      ...LatestNews
      __typename
    }
    video {
      ...Video
      __typename
    }
    faqs {
      ...Faqs
      __typename
    }
    faqSeoIndexes
    longFormContent {
      ...LongFormContent
      __typename
    }
    glossary {
      ...Glossary
      __typename
    }
    sortBy {
      ...SortBy
      __typename
    }
    filterPanel {
      ...FilterPanel
      __typename
    }
    subscription {
      ...Subscription
      __typename
    }
    products {
      id
      title
      updatedAt
      image {
        url
        __typename
      }
      imageOrientation
      promotional {
        type {
          key
          display
          __typename
        }
        text
        description {
          shortDescription
          longDescription
          __typename
        }
        countdown {
          ...Countdown
          __typename
        }
        flipBanner {
          ...FlipBanner
          __typename
        }
        productPageBanner {
          ...ProductPageBanner
          __typename
        }
        __typename
      }
      featured
      enableCountdown
      enableFlipBanner
      features {
        title
        pros
        cons
        __typename
      }
      documents {
        name
        url
        __typename
      }
      comparables {
        id
        title {
          key
          display
          __typename
        }
        sortValue
        displayValue
        description
        suffix
        prefix
        __typename
        ... on CompareElementSimple {
          tooltip
          __typename
        }
      }
      productName
      provider {
        id
        providerName
        title
        __typename
      }
      ctaButton {
        show
        label
        link {
          url
          linkClass
          __typename
        }
        __typename
      }
      features {
        pros
        cons
        __typename
      }
      fees(filter: ["ANNUAL_FEE", "FOREIGN_CURRENCY_TRANSACTION_FEE"]) {
        type {
          key
          display
          __typename
        }
        value
        description {
          longDescription
          shortDescription
          __typename
        }
        __typename
      }
      offers {
        id
        welcomeOffers: offers(filter: "WELCOME_OFFER") {
          type {
            key
            display
            __typename
          }
          description {
            shortDescription
            longDescription
            __typename
          }
          reward(filter: "CAG_EXCLUSIVE", invert: true) {
            title
            type {
              key
              display
              __typename
            }
            description {
              shortDescription
              longDescription
              tooltip
              __typename
            }
            tandc {
              shortDescription
              longDescrition
              __typename
            }
            __typename
          }
          __typename
        }
        exclusiveOffers: offers(filter: "WELCOME_OFFER") {
          type {
            key
            display
            __typename
          }
          description {
            shortDescription
            longDescription
            __typename
          }
          reward(filter: "CAG_EXCLUSIVE", invert: false) {
            title
            type {
              key
              display
              __typename
            }
            description {
              shortDescription
              longDescription
              tooltip
              __typename
            }
            tandc {
              shortDescription
              longDescrition
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      ...Apr
      eligibilityCriteria: eligibility {
        type {
          key
          display
          __typename
        }
        value
        description {
          longDescription
          shortDescription
          tooltip
          __typename
        }
        __typename
      }
      documents {
        name
        url
        __typename
      }
      description {
        shortDescription
        longDescription
        __typename
      }
      __typename
      functional {
        metaData {
          alias: urlAlias
          __typename
        }
        __typename
      }
    }
    __typename
  }
  
  fragment ImageAndLink on ImageAndLink {
    title
    image {
      url
      title
      description
      filename
      __typename
    }
    link {
      title
      href
      __typename
    }
    __typename
  }
  
  fragment CustomerProfile on CustomerProfile {
    loginState
    customer {
      ...Customer
      __typename
    }
    __typename
  }
  
  fragment SeoTable on SeoTable {
    tableHeading
    columnHeadings
    data {
      ba {
        list {
          products {
            comparables(context: [BA, COMMON]) {
              ...CompareElement
              __typename
            }
            provider {
              alias
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      cc {
        list {
          products {
            comparables(context: [COMMON]) {
              ...CompareElement
              __typename
            }
            functional {
              metaData {
                alias: urlAlias
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      hi {
        list {
          products {
            comparables(context: [COMMON]) {
              ...CompareElement
              __typename
            }
            provider {
              alias
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      hl {
        list {
          products {
            comparables(context: [HL, COMMON]) {
              ...CompareElement
              __typename
            }
            provider {
              alias
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      mi {
        list {
          products {
            comparables(context: [COMMON]) {
              ...CompareElement
              __typename
            }
            provider {
              alias
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      pl {
        list {
          products {
            comparables(context: [COMMON]) {
              ...CompareElement
              __typename
            }
            provider {
              alias
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      sa {
        list {
          products {
            comparables(context: [COMMON]) {
              ...CompareElement
              __typename
            }
            provider {
              alias
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      ti {
        list {
          products {
            comparables(context: [COMMON]) {
              ...CompareElement
              __typename
            }
            provider {
              alias
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    firstColumnIsProductLink
    __typename
  }
  
  fragment LatestNews on LatestNews {
    title
    heading
    subheading
    viewMoreCta {
      title
      href
      __typename
    }
    blogArticles {
      link
      title
      image {
        url
        description
        __typename
      }
      description
      __typename
    }
    __typename
  }
  
  fragment Video on Video {
    heading
    subheading
    link
    __typename
  }
  
  fragment Faqs on Faqs {
    desktopImage {
      contentType
      url
      description
      filename
      title
      __typename
    }
    mobileImage {
      contentType
      url
      description
      filename
      title
      __typename
    }
    heading
    subheading
    faqs {
      question
      answer
      __typename
    }
    viewAllCta {
      title
      href
      __typename
    }
    __typename
  }
  
  fragment LongFormContent on LongFormContent {
    description {
      shortDescription
      longDescription
      __typename
    }
    image {
      url
      __typename
    }
    __typename
  }
  
  fragment Glossary on Glossary {
    heading
    subheading
    glossaryCta {
      links {
        title
        href
        __typename
      }
      __typename
    }
    viewAllCta {
      title
      href
      __typename
    }
    desktopImage {
      contentType
      url
      __typename
    }
    mobileImage {
      contentType
      url
      __typename
    }
    __typename
  }
  
  fragment SortBy on EnumText {
    name: key
    value: display
    __typename
  }
  
  fragment FilterPanel on FilterPanel {
    filterBy {
      name {
        key
        display
        __typename
      }
      queryParam
      ... on SelectFilter {
        selectStyle
        defaultSelection
        tooltip {
          key
          display
          __typename
        }
        options {
          name: key
          value: display
          __typename
        }
        __typename
      }
      ... on AmountFilter {
        amountStyle
        minValue
        maxValue
        defaultValue
        step
        suffix
        prefix
        tooltip {
          key
          display
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  
  fragment Subscription on Subscription {
    emailSubscription {
      fieldLabel
      fieldPlaceholder
      subscribeCta
      terms
      __typename
    }
    facebookLikeCta
    heading
    separatorText
    subheading
    title
    __typename
  }
  
  fragment Countdown on Countdown {
    displayProductPage
    text
    date {
      startDate
      endDate
      __typename
    }
    __typename
  }
  
  fragment FlipBanner on FlipBanner {
    date {
      startDate
      endDate
      __typename
    }
    imageForDesktop {
      url
      __typename
    }
    imageForMobile {
      url
      __typename
    }
    period
    timeDelay
    __typename
  }
  
  fragment ProductPageBanner on ProductPageBanner {
    enableBanner
    imageForDesktop {
      url
      __typename
    }
    imageForMobile {
      url
      __typename
    }
    __typename
  }
  
  fragment Apr on CreditCard {
    apr: repayment(filter: ["MINIMUM_PAYMENT", "LATE_CHARGE", "RETAIL_APR", "CASH_APR", "INTEREST_FREE_PERIOD"]) {
      type {
        key
        display
        __typename
      }
      value
      description {
        longDescription
        shortDescription
        __typename
      }
      __typename
    }
    __typename
  }
  
  fragment Customer on Customer {
    firstName
    familyName
    email
    phoneNumber {
      countryCode
      phoneNumber
      __typename
    }
    __typename
  }
  
  fragment CompareElement on CompareElement {
    sortValue
    displayValue
    description
    suffix
    prefix
    ... on CompareElementSimple {
      tooltip
      __typename
    }
    ... on CompareElementWithSubValue {
      subValue
      tooltip
      __typename
    }
    ... on CompareElementPrice {
      originalPrice
      originalPriceLabel
      __typename
    }
    ... on CompareElementRichText {
      displayValue
      __typename
    }
    __typename
  }
    `;

// TO-DO: Move it to config
// They they should be 100% staticlly defined
// https://compareasia-group.atlassian.net/wiki/spaces/RA/pages/215089509/CC+Attributes+Sorting
let TRANSLATION = {
    'longDescription': 'Description',
    'shortDescription': 'Short Description',
    'productName': 'Product Name',
    'providerName': 'Provider Name',
}

export const ProductComparisonModal = ({ defaultValue, onOk, onCancel, visible, resetAfterOkOrCancel = false}) => {

    const [selectedProduct, setSelectedProduct] = useState(defaultValue.products||[]);
    const [selectedField, setSelectedField] = useState(defaultValue.fields||[]);

    // To-DO: make single query
    // To-DO: some comparible are N/A
    let cms_comparables_cc = new Set([]);
    let cms_product_cc;
  
    const { Option } = Select;
    const allProductsDropdown = [];
    const allComparablesDropdown = [];
  
    const { loading, error, data } = useQuery(CC_QUERY, {
      variables: {
        list: "all",
        language: "en-sg",
        timestamp: 1611060017479,
        promotionalBanners: [
            "CC_Results_Banner_Mobile",
            "CC_Results_Banner_Desktop"
        ]
      },
    });
    if (loading) return <p>Loading ...</p>;
    cms_product_cc = data;
    cms_product_cc?.resultsPage?.products.forEach( (v, k) => {
      allProductsDropdown.push(<Option value={v.id} key={v.id}>{v.productName}</Option>);
    });
  
    data.resultsPage.products.forEach( (v, k) => {
      v.comparables.forEach( (v2, k2) => {
        TRANSLATION[v2.title.key] = v2.title.display;
        cms_comparables_cc.add(v2.title.key);
      });
    });
    console.log(cms_comparables_cc);
  
    cms_comparables_cc.forEach( (v, k) => {
      allComparablesDropdown.push(<Option value={v} key={v}>{v}</Option>);
    });

    const resetState = () => {
        setSelectedProduct([]);
        setSelectedField([]);
    }

    return (
      <Modal 
      title="Insert Product Comparison Widget"
      visible={visible} 
      onOk={(ev)=>{
        onOk({selectedProduct, selectedField, ev});
        if(resetAfterOkOrCancel){
            resetState();
        }
      }}
      okButtonProps={
        {disabled: selectedProduct.length === 0 || selectedField.length === 0} 
      }
      onCancel={(ev)=>{
        if(resetAfterOkOrCancel){
            resetState();
        }else{
            setSelectedProduct(defaultValue.products);
            setSelectedField(defaultValue.fields);
        }
        onCancel(ev);
      }}>
      <Tabs defaultActiveKey="1" onChange={()=>console.log('hi')} tabPosition={'left'}>
        <TabPane tab="Credit Cards" key="1">
          Please select products:
          <Select
            mode="multiple"
            placeholder="Please select"
            defaultValue={defaultValue.products}
            optionFilterProp="children"
            onChange={(value)=> {
                console.log(value);
                setSelectedProduct(value);
            }}
            style={{ width: '100%' }}
            value={selectedProduct}
          >
            {allProductsDropdown}
          </Select>
          <br/><br/>
          Please select fields:
          <Select
            mode="multiple"
            placeholder="Please select"
            defaultValue={defaultValue.fields}
            onChange={(value)=> {
                console.log(value);
                setSelectedField(value);
            }}
            style={{ width: '100%' }}
            value={selectedField}
          >
            <Option value="longDescription" key="longDescription">LONG_DESCRIPTION</Option>
            <Option value="shortDescription" key="shortDescription">SHORT_DESCRIPTION</Option>
            <Option value="productName" key="productName">PRODUCT_NAME</Option>
            <Option value="providerName" key="providerName">PROVIDER_NAME</Option>
            {allComparablesDropdown}
          </Select>            
        </TabPane>
        <TabPane tab="Personal Loans" key="2">
          Coming soon...
        </TabPane>
      </Tabs>
    </Modal>
    )
  }

const ProductComparisonElement = props => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const { element, editor} = props;

    let cms_comparables_cc = new Set([]);
    let cms_product_cc;
    
    const { Option } = Select;
    let allProductsDropdown = [];
    const allComparablesDropdown = [];
 
   const { loading, error, data } = useQuery(CC_QUERY, {
     variables: {
       list: "all",
       language: "en-sg",
       timestamp: 1611060017479,
       promotionalBanners: [
           "CC_Results_Banner_Mobile",
           "CC_Results_Banner_Desktop"
       ]
     },
   });
   if (loading) return <p>Loading ...</p>;
   cms_product_cc = data;
   cms_product_cc?.resultsPage?.products.forEach( (v, k) => {
     allProductsDropdown.push(<Option value={v.id} key={v.id}>{v.productName}</Option>);
   });
 
 
   data.resultsPage.products.forEach( (v, k) => {
     v.comparables.forEach( (v2, k2) => {
        TRANSLATION[v2.title.key] = v2.title.display;
       cms_comparables_cc.add(v2.title.key);
     });
   });
   console.log(cms_comparables_cc);
 
   cms_comparables_cc.forEach( (v, k) => {
     allComparablesDropdown.push(<Option value={v} key={v}>{v}</Option>);
   });

    let productHeader = [{}];
    let dataRows = [];

    const getFieldValueByName = (name , product) => {
      switch (name) {
      case 'productName':
        return R.pathOr('N/A', ['productName'], product);
      case 'providerName':
        return R.pathOr('N/A', ['provider', 'providerName'], product);        
      case 'shortDescription':
        return R.pathOr('N/A', ['description', 'shortDescription', 0], product);        
      case 'longDescription':
        return R.pathOr('N/A', ['description', 'longDescription'], product) || 'N/A'; 
      case "MINIMUM_MONTHLY_SPEND":
      case "CASHBACK_DINING":
      case "CASHBACK_LOCAL":
      case "CASHBACK_ALL_SPENDING":
      case "AIRMILES_CONVERSION_FEE":
      case "AIRMILES_LOCAL":
      case "AIRMILES_OVERSEAS":
      case "MINIMUM_ANNUAL_INCOME":
      case "CASHBACK_RETAIL":
      case "CASHBACK_LOCAL_ONLINE_SHOPPING":
      case "AIRMILES_LOCAL_ONLINE_SHOPPING":
      case "CASHBACK_SUPERMARKET":
      case "CASHBACK_CAP_ALL_SPENDING":
      case "ANNUAL_FEE":
      case "CASHBACK_OVERSEAS":
      case "PROVIDER_REWARD_POINTS":
      case "OCTOPUS_MAXIMUM_TOP_UP_VALUE":
        const toReturn = R.filter(R.pathEq(['title', 'key'], name), product.comparables)?.[0];
        if(!toReturn) return 'N/A';
        return `${toReturn?.prefix}${toReturn?.displayValue}${toReturn?.suffix} ${toReturn?.description}`;         
      default:
        return name;
      }
    }

    element.fields.forEach( (v, k) => {
      const dataRow = [];
      dataRow.push({
        text: {
          children: TRANSLATION[v] || v,
        },
      });
      element.products.forEach( (v2, k2) => {
        const theProduct = findById(v2, cms_product_cc);
        console.log(theProduct);
        dataRow.push({
          text: {
            children: getFieldValueByName(v, theProduct),
          },
        });
      });
      dataRows.push({
        dataRow
      })
    });

    console.log(dataRows);

    element.products.forEach( (v, k) => {
      const theProduct = findById(v, cms_product_cc);
      console.log(theProduct);
      productHeader.push({
        image: {
          url: theProduct?.image?.url+'?width=200',
          title: '',
        },
        text: {
          children: theProduct.productName,
        },
        button: {
          children: 'Apply now',
          onClick: () => window.open(theProduct.ctaButton.link.url),
        },
      },);
    });

    let myData = {
      dataTable: [{
          dataRow: [{}, ...productHeader],
        },
        ...dataRows
      ],
      variant: 'card comparison',
    };
    console.log(dataRows);
    console.log(data.dataTable);
    console.log('myData', JSON.stringify(myData));

    return <span {...props.attributes}>
      <ModulabTable {...myData}/>
      <ProductComparisonModal 
      defaultValue={element} 
      visible={isModalVisible}
      onCancel={()=>{
        setIsModalVisible(false);
      }}
      onOk={({selectedProduct, selectedField})=>{
            console.log({selectedProduct, selectedField});
            const path = ReactEditor.findPath(editor, element)
            const newProperties = {
              products: selectedProduct,
              fields: selectedField,
            }
            Transforms.setNodes(editor, newProperties, { at: path });
            setIsModalVisible(false);
        }}/>
      <Button type="dashed" onClick={()=>{
        setIsModalVisible(true);
      }}>Edit</Button>
      {props.children}
    </span>
  }

export default ProductComparisonElement;