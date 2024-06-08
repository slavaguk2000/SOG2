import React from 'react';

import { v4 as uuidv4 } from 'uuid';

import PsalmChordsEdit from '../components/psalmChordsEdit';
import EditableChordsDataProvider from '../components/psalmChordsEdit/editableChordsDataProvider';
import { MusicalKey } from '../utils/gql/types';

const testData = {
  psalm: {
    id: 'dc3320e3-9ffb-40db-a26d-982632da2149',
    name: 'ОН ЗДЕСЬ',
    psalmNumber: '007',
    coupletsOrder: null,
    defaultTonality: MusicalKey.E,
  },
  couplets: [
    {
      id: 'e3aa3e9f-af2d-4c0e-9a7f-73feb5684c44',
      initialOrder: 0,
      marker: '1. ',
      coupletContent: [
        {
          id: '5a304740-4208-43d7-a334-8dfe375e2678',
          text: 'Он зд',
          line: 0,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 0,
          },
        },
        {
          id: '5a304740-4208-43d7-a334-8dfe375e2679',
          text: 'есь,',
          line: 0,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$m',
            rootNote: 2,
          },
        },
        {
          id: '5a304740-4208-43d7-a334-8dfe375e2680',
          text: ' Он зд',
          line: 0,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$7',
            rootNote: 7,
          },
        },
        {
          id: '5a304340-4208-43d7-a334-8dfe375e2681',
          text: 'есь! ',
          line: 0,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 0,
          },
        },
        {
          id: '5a304740-4208-43d7-a334-8dfe375e2681',
          text: 'Ищет встр',
          line: 1,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 0,
          },
        },
        {
          id: '5a304740-4208-43d7-a334-8dfe375e2682',
          text: 'ечи Он с тоб',
          line: 1,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 5,
          },
        },
        {
          id: '5a304740-4208-43d7-a334-8dfe375e2683',
          text: 'ой, ',
          line: 1,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$7',
            rootNote: 7,
          },
        },
        {
          id: '5a304740-4208-43d7-a334-8dfe375e2694',
          text: 'Он зд',
          line: 2,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$7',
            rootNote: 7,
          },
        },
        {
          id: '5a304740-4208-43d7-a334-8dfe375e2684',
          text: 'есь. ',
          line: 2,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 0,
          },
        },
        {
          id: '5a304740-4208-43d7-a334-8dfe375e2284',
          text: '**Ищет встр',
          line: 3,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 0,
          },
        },
        {
          id: '5a304740-4208-43d7-a334-8dfe375e1684',
          text: 'ечи Он с тоб',
          line: 3,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 5,
          },
        },
        {
          id: '1a304740-4208-43d7-a334-8dfe375e2684',
          text: 'ой, ',
          line: 3,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 7,
          },
        },
        {
          id: '2a304740-4208-43d7-a334-8dfe375e2684',
          text: 'Чтобы д',
          line: 4,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 7,
          },
        },
        {
          id: '3a304740-4208-43d7-a334-8dfe375e2684',
          text: 'ать душе пок',
          line: 4,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$m',
            rootNote: 4,
          },
        },
        {
          id: '4a304740-4208-43d7-a334-8dfe375e2684',
          text: 'ой, ',
          line: 4,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$m',
            rootNote: 9,
          },
        },
        {
          id: '6a304740-4208-43d7-a334-8dfe375e2684',
          text: 'Двери с',
          line: 5,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$m',
            rootNote: 9,
          },
        },
        {
          id: '67304740-4208-43d7-a334-8dfe375e2684',
          text: 'ердца ты откр',
          line: 5,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$m7',
            rootNote: 2,
          },
        },
        {
          id: '5a304790-4208-43d7-a334-8dfe375e2684',
          text: 'ой, ',
          line: 5,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$7',
            rootNote: 7,
          },
        },
        {
          id: '5a304740-4208-43d7-a334-8dfe275e2684',
          text: 'ты откр',
          line: 6,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$7',
            rootNote: 7,
          },
        },
        {
          id: '5a304140-4208-43d7-a334-8dfe375e2684',
          text: 'ой.',
          line: 6,
          chord: {
            id: '0f80f49e-d158-45db-9a7c-3b17c26f8cdf',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 0,
          },
        },
      ],
      slide: {
        id: 'e3aa3e9f-af2d-4c0e-9a7f-73feb5684c44',
        content:
          'Он здесь, Он здесь! Ищет встречи Он с тобой, Он здесь. **Ищет встречи Он с тобой, Чтобы дать душе покой, Двери сердца ты открой, ты открой.',
        searchContent:
          'Он здесь, Он здесь! Ищет встречи Он с тобой, Он здесь. **Ищет встречи Он с тобой, Чтобы дать душе покой, Двери сердца ты открой, ты открой.',
        location: [
          'fc7dda59-7730-4dfa-a92a-bf7e9af7e54b',
          'dc3320e3-9ffb-40db-a26d-982632da2149',
          'e3aa3e9f-af2d-4c0e-9a7f-73feb5684c44',
          '1.',
        ],
      },
    },
    {
      id: 'f66da212-780b-44cc-91d4-9d3cc4e8f39b',
      initialOrder: 1,
      marker: '2. ',
      coupletContent: [
        {
          id: '02e2ec20-2db0-46c2-aa0d-c0a70c1138c9',
          text: 'Он здесь, Он здесь! Слава, Всемогущий Бог, что Ты здесь! **Пред Тобой, о, мой Господь, Преклоняясь, предстоим. Слава, Всемогущий Бог, что Ты здесь, что Ты здесь!',
          line: 0,
          chord: {
            id: 'fb45371b-3b44-4ba7-9d36-eaa288219f05',
            bassNote: null,
            chordTemplate: '$',
            rootNote: 0,
          },
        },
      ],
      slide: {
        id: 'f66da212-780b-44cc-91d4-9d3cc4e8f39b',
        content:
          'Он здесь, Он здесь! Слава, Всемогущий Бог, что Ты здесь! **Пред Тобой, о, мой Господь, Преклоняясь, предстоим. Слава, Всемогущий Бог, что Ты здесь, что Ты здесь!',
        searchContent:
          'Он здесь, Он здесь! Слава, Всемогущий Бог, что Ты здесь! **Пред Тобой, о, мой Господь, Преклоняясь, предстоим. Слава, Всемогущий Бог, что Ты здесь, что Ты здесь!',
        location: [
          'fc7dda59-7730-4dfa-a92a-bf7e9af7e54b',
          'dc3320e3-9ffb-40db-a26d-982632da2149',
          'f66da212-780b-44cc-91d4-9d3cc4e8f39b',
          '2.',
        ],
      },
    },
  ].map((couplet) => ({
    ...couplet,
    coupletContent: couplet.coupletContent.map((content) => ({
      ...content,
      chord: {
        ...content.chord,
        id: uuidv4(),
      },
    })),
  })),
};

const PsalmChordEditPage = () => {
  return (
    <EditableChordsDataProvider initialData={testData}>
      <PsalmChordsEdit />
    </EditableChordsDataProvider>
  );
};

export default PsalmChordEditPage;
