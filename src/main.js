import Controller from './scripts/controller';
import Model from './scripts/model';
import View from '@/scripts/view';

const controller = new Controller(new Model(), new View());

const nextActionBtn = document.querySelector('#next-action');


nextActionBtn.addEventListener('click', function () {

    const canvas = document.querySelector('#canvas');
    canvas.requestFullscreen();
});