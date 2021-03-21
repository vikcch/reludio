import render from '@/scripts/eases/view/render/index';

const tableRect = render.rects.table;

export default {

    navigation: {

        previousHand: {
            x: 470 + tableRect.x,
            y: 464 + tableRect.y,
            width: 50, height: 28
        },
        previousAction: {
            x: 525 + tableRect.x,
            y: 464 + tableRect.y,
            width: 50, height: 28
        },
        play: {
            x: 580 + tableRect.x,
            y: 464 + tableRect.y,
            width: 50, height: 28
        },
        nextAction: {
            x: 635 + tableRect.x,
            y: 464 + tableRect.y,
            width: 50, height: 28
        },
        nextHand: {
            x: 690 + tableRect.x,
            y: 464 + tableRect.y,
            width: 50, height: 28
        }
    },

    chat: {
        x: 3 + tableRect.x,
        y: 442 + tableRect.y,
        width: 329, height: 108
    },

    handsList: {
        x: 0, y: 0,
        width: 96, height: 595 - 44
    },

    showBigBlinds: {
        x: 99, y: 462,
        width: 10, height: 14
    },

    searchHand: {
        x: 0, y: 595 - 44,
        width: 96, height: 44
    },

    clearHandFilter: {
        x: 66, y: 565,
        width: 28, height: 28
    }
};