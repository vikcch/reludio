import fns, { displayValue, head, pureValue } from '@/scripts/units/fns';
import { HistoryT } from '@/scripts/units/history';
import { PlayerT } from '@/scripts/units/player';
import View from '@/scripts/view';
import displayPositions from '@/scripts/units/display-positions';
import biz from '@/scripts/units/biz';
import enums from '@/scripts/units/enums';
import easeMiddlePot from './middle-pot';
import easeRender from '@/scripts/eases/view/render/index'

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {string} text 
 * @param {{x:number,y:number}} point 
 */
const drawTextCenter = function (context, text, color, point) {

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = color;

    context.fillText(text, point.x, point.y);
};

/**
 * @this {View}
 * @param {object} obj 
 * @param {boolean} obj.isPLO
 * @param {{x:number,y:number}} obj.point
 * @param {number} [obj.alpha=1]
 */
export const drawPlayerCards = function ({ isPLO, point, alpha }) {

    const offSetX = 15;
    const offSetY = 4;

    const outSetX = isPLO ? -offSetX : 0;
    const outSetY = isPLO ? -offSetY : 0;

    return (card, index) => {

        const { suit, value } = biz.getCardIndex(card);

        const image = this.images.deck[suit][value];

        const x = point.x + offSetX * index + outSetX;

        const y = point.y + offSetY * index + outSetY;

        this.context.globalAlpha = alpha;
        this.context.drawImage(image, x, y);
        this.context.globalAlpha = 1;
    };
};


/**
 * @this {View}
 * @param {number} value 
 */
const pot = function (value) {

    const amount = displayValue(value);
    const text = `Pot: ${amount}`;

    const textWidth = this.context.measureText(text).width;

    const { table: tableRect } = easeRender.rects;

    const center = tableRect.width / 2;
    const verticalPadding = 16;
    const boxWidth = textWidth + verticalPadding;
    const x = center - textWidth / 2 - verticalPadding / 2;

    this.context.fillStyle = '#ffffe1';
    this.context.fillRect(x, 8, boxWidth, 16);

    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'black';

    this.context.fillText(text, center, 16);
};

/**
 * @this {View}
 * @param {HistoryT} history 
 * @param {number} tableMax
 */
const players = function (history, tableMax) {

    const { players } = history

    const drawImage = (image, point, alpha = 1) => {

        this.context.globalAlpha = alpha;
        this.context.drawImage(image, point.x, point.y);
        this.context.globalAlpha = 1;
    };

    const isPLO = players.find(x => x.isHero).holeCards.length === 4;

    players.forEach(player => {

        const displayPosition = displayPositions(tableMax).find(x => player.seat === x.seatAjusted);

        const { emptySeat, status, dealer, inPlay } = this.images;

        const emptySeatAlpha = player.inPlay ? 1 : .4;
        drawImage(emptySeat, displayPosition.emptySeat, emptySeatAlpha);
        drawImage(status, displayPosition.status);

        drawTextCenter(this.context, player.name, 'white', displayPosition.name);
        drawTextCenter(this.context, player.mergedStack(), 'white', displayPosition.stack);

        if (player.isButton) {

            drawImage(dealer, displayPosition.dealer);
        }

        if (player.inPlay && !player.holeCards) {

            drawImage(inPlay, displayPosition.inPlay);

            if (isPLO) {

                const x = displayPosition.inPlay.x + 10;
                const y = displayPosition.inPlay.y + 4;
                drawImage(inPlay, { x, y });
            }
        }

        if (player.holeCards && player.inPlay) {

            const point = displayPosition.holeCards;

            const drawPlayerCardsAbsx = drawPlayerCards.call(this, { isPLO, point });

            player.holeCards.forEach(drawPlayerCardsAbsx);
        }
    });
}

/**
 * @this {View}
 * @param {HistoryT} history 
 * @param {number} tableMax 
 */
const action = function (history, tableMax) {

    if (!history.action) return;

    const { player } = history;

    const findPlayer = x => player.seat === x.seatAjusted;

    const displayPosition = displayPositions(tableMax).find(findPlayer);

    const { actions } = this.images;

    const index = biz.getActionIndex(history.action);

    const { x, y } = displayPosition.action;

    this.context.drawImage(actions[index], x, y);
};

/**
 * @this {View}
 * @param {number} value 
 * @param {number} tableMax
 */
const waitingToAct = function (history, tableMax) {

    if (!history.nextPlayer) return;

    const findPlayer = x => history.nextPlayer.seat === x.seatAjusted;

    const displayPosition = displayPositions(tableMax).find(findPlayer);

    const { statusHighlight: statusHighlightBare } = this.images;

    const { x, y } = displayPosition.statusHighlight;

    const { width, height } = statusHighlightBare;

    const { table: tableRect } = easeRender.rects;

    // NOTE:: Os metodos translate() e setTransform() não afectam
    // getImageData e putImageData
    const xReal = tableRect.x + x;
    const yReal = tableRect.y + y;

    const statusNormal = this.context.getImageData(xReal, yReal, width, height);

    let count = 0;

    const drawHighlight = () => {

        this.context.drawImage(statusHighlightBare, x, y);

        const { name, stack } = history.nextPlayer;

        drawTextCenter(this.context, name, 'black', displayPosition.name);
        drawTextCenter(this.context, stack, 'black', displayPosition.stack);

        return this.context.getImageData(xReal, yReal, width, height);
    };

    const drawStatus = () => {

        const isHighlight = count % 2 === 1;

        const statusImage = isHighlight ? statusHighlight : statusNormal;

        this.context.putImageData(statusImage, xReal, yReal);

        count++;
    };

    const statusHighlight = drawHighlight();

    this.inter = setInterval(drawStatus, 500);
};

/**
 * @this {View}
 * @param {PlayerT[]} players 
 * @param {number} tableMax
 */
const betChips = function (players, tableMax) {

    const { chips } = this.images;

    players.forEach(player => {

        if (!player.amountOnStreet) return;

        const findPlayer = x => player.seat === x.seatAjusted;

        const displayPosition = displayPositions(tableMax).find(findPlayer);

        let { x, y } = displayPosition.betChips;

        const value = player.amountOnStreet;

        const chipsIndexs = biz.getChips(value)
            .map(x => biz.getChipIndex(x));

        chipsIndexs.forEach(chipIndex => {

            const chip = chips[chipIndex];

            this.context.drawImage(chip, x, y);

            y -= 4;
        });
    });
};

/**
 * @this {View}
 * @param {PlayerT[]} players 
 * @param {number} tableMax
 */
const chipsValues = function (players, tableMax) {

    players.forEach(player => {

        if (!player.amountOnStreet) return;

        const findPlayer = x => player.seat === x.seatAjusted;

        const displayPosition = displayPositions(tableMax).find(findPlayer);

        let { x, y } = displayPosition.chipsValue;

        const { seatFixed } = displayPosition;

        const value = player.amountOnStreet;

        const text = displayValue(value);

        const textAlign = seatFixed >= 5 ? 'left' : 'right';

        this.context.textAlign = textAlign;
        this.context.textBaseline = 'bottom';
        this.context.fillStyle = 'white';

        this.context.fillText(text, x, y);
    });
};

/**
 * @this {View}
 * @param {string[]} streetCards 
 */
const streetCards = function (streetCards) {

    if (!streetCards) return;

    const { deck } = this.images;

    streetCards.forEach((card, index) => {

        const { suit, value } = biz.getCardIndex(card);

        const image = deck[suit][value];

        const x = 268 + image.width * index + (index * 4);

        const y = 152;

        this.context.drawImage(image, x, y);
    });
};

/**
 * @this {View}
 * @param {HistoryT} history 
 */
const middlePotValue = function (history) {

    const streetAmount = history.players.reduce((acc, cur) => acc + cur.amountOnStreet, 0);

    const value = pureValue(history.pot - streetAmount);

    if (value === 0) return;

    const point = { x: 400, y: 275 };

    drawTextCenter(this.context, value, 'white', point);
};

export default {

    /**
     * 
     * @this {View}
     * @param {HistoryT} history 
     * @param {number} tableMax 
     */
    render(history, tableMax) {

        // NOTE:: `inter` usado em `waitingToAct` e `middlePot`
        // Preciso do translate nos asyncs
        clearInterval(this.inter);

        const { width, height } = this.canvas;

        const { table: tableRect } = easeRender.rects;

        this.context.setTransform(1, 0, 0, 1, tableRect.x, tableRect.y);

        this.context.font = '11px Arial';

        this.context.clearRect(0, 0, width, height);

        this.context.drawImage(this.images.background, 0, 0);

        pot.call(this, history.pot);

        players.call(this, history, tableMax);

        action.call(this, history, tableMax);

        waitingToAct.call(this, history, tableMax);

        betChips.call(this, history.players, tableMax);

        chipsValues.call(this, history.players, tableMax);

        streetCards.call(this, history.streetCards);

        easeMiddlePot.call(this, history, tableMax);

        middlePotValue.call(this, history);

        console.log(history);
    }
}

// TODO:: Remover isto
export const testables = {

    middlePotValue,
    streetCards
};