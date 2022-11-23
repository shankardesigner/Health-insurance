import React from 'react';

const nodeStyle = {
    background: '#EFEFF0',
    borderRadius: '100px',
    color: '#333',
    border: '0px solid #222138',
}

const onChange = () => { }
const initBgColor = '#EFEFF0';

export default [
    {
        id: '1',
        type: 'input',
        data: {
            label: (
                <>
                    <strong>Non-visible haematuria</strong>
                </>
            ),
        },
        position: { x: 250, y: 0 },
        style: {
            ...nodeStyle,
            width: 170
        },
    },
    {
        id: '0',
        type: 'input',
        data: {
            label: (
                <>
                    <strong>Visible haematuria</strong>
                </>
            ),
        },
        position: { x: 535, y: 0 },
        style: {
            ...nodeStyle,
        },
    },
    {
        id: '2',
        data: {
            label: (
                <>
                    <strong>Asymptomatic</strong>
                </>
            ),
        },
        position: { x: 100, y: 100 },
        style: {
            ...nodeStyle,
        },
    },
    {
        id: '3',
        data: {
            label: (
                <>
                    <strong>Symptomatic</strong>
                </>
            ),
        },
        position: { x: 400, y: 100 },
        style: {
            ...nodeStyle,
            width: 180,
        },
    },
    {
        id: '4',
        position: { x: 10, y: 200 },
        data: {
            label: '< 40 years',
        },
        style: {
            ...nodeStyle,
        },
    },
    {
        id: '5',
        position: { x: 190, y: 200 },
        data: {
            label: '> 40 years',
        },
        style: {
            ...nodeStyle,
        },
    },
    {
        id: '6',
        position: { x: 10, y: 365 },
        data: {
            label: 'Ultrasound',
        },
        style: {
            ...nodeStyle,
        },
    },
    {
        id: '7',
        position: { x: 295, y: 365 },
        data: {
            label: (
                <>
                    <strong>Urinary tract imaging</strong> where direct access permits: e.g. Intravenous urogram (IVU), Ultrasound, CTU
                </>
            ),
        },
        style: {
            ...nodeStyle,
            width: 400
        },
    },
    {
        id: '8',
        position: { x: 10, y: 275 },
        data: {
            label: (
                <>
                    Consider nephrological causes of haematuria
                    Measure blood pressure (BP). Test creatinine (eGFR), ACR/PCR.
                    Request urine microscopy to detect dysmorphic RBCs and urinary casts
                </>
            ),
        },
        style: {
            ...nodeStyle,
            width: 600,
            background: '#3D3E64',
            borderRadius: '20px',
            color: '#ffffff'
        },
    },
    {
        id: '9',
        position: { x: -35, y: 540 },
        type: 'selectorNode',
        data: { onChange: onChange, color: initBgColor },
    },
    {
        id: '10',
        position: { x: 475, y: 560 },
        data: {
            label: 'No Cause Found',
        },
        style: {
            ...nodeStyle,
        },
    },
    {
        id: '11',
        position: { x: 660, y: 560 },
        data: {
            label: 'Cause Found',
        },
        style: {
            ...nodeStyle,
        },
    },
    {
        id: '12',
        type: 'multiNodeHandle',
        position: { x: 175, y: 455 },
        data: {
            label: 'Age > 40 years or Positive Urine Cytology?',
            idLeft: '12Left',
            idRight: '12right',
            idBottom: '12Bottom'
        },
        style: {
            ...nodeStyle,
            width: 200
        },
    },
    {
        id: '13',
        type: 'multiNodeHandle',
        position: { x: 535, y: 455 },
        data: {
            label: (
                <>
                    Cystoscopy/urology  
                    Referral
                </>
            ),
            idLeft: '13Left',
            idRight: '13right',
            idBottom: '13Bottom'
        },
        style: {
            ...nodeStyle,
        },
    },
    { id: 'e1-2', source: '1', target: '2'},
    { id: 'e1-3', source: '1', target: '3' },
    {
        id: 'e2-4',
        source: '2',
        target: '4',
    },
    {
        id: 'e2-5',
        source: '2',
        target: '5',
    },
    {
        id: 'e4-6',
        source: '4',
        target: '6',
    },
    {
        id: 'e3-7',
        source: '3',
        target: '7',
    },
    {
        id: 'e6-9',
        source: '6',
        target: '9',
    },
    {
        id: 'e5-12',
        source: '5',
        target: '12',
        label: 'Negative' 
    },
    {
        id: 'e0-13',
        source: '0',
        target: '13',
        label: 'Positive' 
    },
    {
        id: '12Bottom-descTop',
        source: '12',
        sourceHandle: '12Bottom',
        target: '9',
        targetHandle: 'descTop',
        label: 'No' 
    },
    {
        id: '12Right-descTop',
        source: '12',
        sourceHandle: '12Bottom',
        target: '9',
        targetHandle: 'descTop',
    },
    {
        id: '13Bottom-10',
        source: '13',
        sourceHandle: '13Bottom',
        target: '10',
    },
    {
        id: '13Bottom-11',
        source: '13',
        sourceHandle: '13Bottom',
        target: '11',
    },
    {
        source: "12",
        sourceHandle: "12right",
        target: "13",
        targetHandle: "13Left",
        id: "reactflow__edge-1212right-1313Left",
        type: "default",
        label: 'Yes' 
      }
];