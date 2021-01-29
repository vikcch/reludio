// import { assert } from 'chai';
import { testables } from '@/scripts/eases/pokerhand/create-history';
import { Delimiters } from '@/scripts/units/delimiters';

const assert = require('assert');

describe('ease-pokerhand-create-history', function () {

    describe('# 1 getActivityLines', function () {

        const fn = testables.getActivityLines;

        it('should return only activity lines', function () {

            const lines = [
                '*** HOLE CARDS ***',
                'Dealt to vik [Ad As]',
                'Dealted to rita [4d 6s]',
                'Dealted to joana [6s 3d]',
                'Dealted to sasdfasdf [2s 6s]',
                'sasdfasdf: folds',
                'vik: calls 5',
                'rita: calls 3',
                'joana: checks',
                '*** FLOP *** [Ad As Ad]'
            ];

            const anticipate = [
                { value: 'sasdfasdf: folds', index: 5 },
                { value: 'vik: calls 5', index: 6 },
                { value: 'rita: calls 3', index: 7 },
                { value: 'joana: checks', index: 8 },
            ];

            const delimiters = Delimiters();

            assert.deepStrictEqual(fn(lines, delimiters), anticipate);
        });
    });

    describe('# 2 getActivityLines', function () {

        const fn = testables.getActivityLines;

        it('should return only activity lines', function () {

            const lines = [
                '*** HOLE CARDS ***',
                'Dealt to vikcch [Ah 5c]',
                'ruipinho1: calls €0.01',
                'vikcch: checks ',
                '*** FLOP *** [Qs 4c Th]',
            ];

            const anticipate = [
                { value: 'ruipinho1: calls €0.01', index: 2 },
                { value: 'vikcch: checks ', index: 3 },
            ];

            const delimiters = Delimiters();

            assert.deepStrictEqual(fn(lines, delimiters), anticipate);

            // console.log('asddas');
            // console.log(fn(lines));
        });
    });

});