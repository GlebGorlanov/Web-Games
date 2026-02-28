let div = document.querySelectorAll('.grid>div');
let box = document.querySelectorAll('.box');

window.onload = function() {
    let arr = [0, 1, 2, 3, 4, 5, 6];
    let x = arr.sort(()=> Math.random()-0.5);

    for(let i=0; i<7; i++) {
        div[i].appendChild(box[x[i]]);
    }; 
};

function gameOver() {
    if(div[0].innerHTML==box[0].outerHTML&&
       div[1].innerHTML==box[1].outerHTML&&
       div[2].innerHTML==box[2].outerHTML&&
       div[3].innerHTML==box[3].outerHTML&&
       div[4].innerHTML==box[4].outerHTML&&
       div[5].innerHTML==box[5].outerHTML&&
       div[6].innerHTML==box[6].outerHTML&&
       div[7].innerHTML==box[7].outerHTML&&
       div[8].innerHTML=='') {
        setTimeout(createBox9, 300);
    };
};

function createBox9() {
    let box9 = document.createElement('div');
    box9.classList.add('box');
    box9.classList.add('box9');
    box9.innerHTML = '9';
    box9.style.position = 'absolute';
    box9.style.bottom = '27px';
    box9.style.left = '80px';
    document.body.appendChild(box9);

    box9.onclick = function() {
        box9.style.position = '';
        box9.classList.remove('box9');
        div[8].appendChild(box9);
        box = document.querySelectorAll('.box');
        backColor();
        setTimeout(divBlock, 5000);
    };
};

let x = 0;
function backColor() {
    setInterval(function() {
        if(x < box.length) {
            box[x].style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            box[x].style.color = 'rgba(187, 216, 243, 1)';
            box[x].style.borderColor = 'rgba(255, 255, 255, 0.8)';
            box[x].style.cursor = 'auto';
        } else {
            for(let i=0; i<box.length; i++) {
                box[i].style.opacity = '0';
                box[i].style.transition = '3s';
            };
            return;
        };
        x++;
    }, 300);
};

function divBlock() {
    let divBlock = document.createElement('div');
    divBlock.classList.add('block');
    divBlock.innerHTML = '<p>Next Game?</p>';
    document.body.appendChild(divBlock);
    
    let btn1 = document.createElement('button');
    btn1.classList.add('btn');
    btn1.innerHTML = 'Yes';
    divBlock.appendChild(btn1);

    let btn2 = document.createElement('button');
    btn2.classList.add('btn');
    btn2.innerHTML = 'No';
    divBlock.appendChild(btn2);

    btn1.onclick = function() {
        document.body.removeChild(divBlock);
        window.location.reload();
    };

    btn2.onclick = function() {
        document.body.removeChild(divBlock);
        window.location.reload();
    };
};

box.forEach(function(item, i) {
    item.addEventListener('click', function() {
        if(div[0].innerHTML==item.outerHTML) {
            if(div[1].innerHTML=='') {
                div[1].appendChild(item);
            } else if(div[3].innerHTML=='') {
                div[3].appendChild(item);
            };
        } else if(div[1].innerHTML==item.outerHTML) {
            if(div[0].innerHTML=='') {
                div[0].appendChild(item);
            } else if(div[2].innerHTML=='') {
                div[2].appendChild(item);
            } else if(div[4].innerHTML=='') {
                div[4].appendChild(item);
            };
        } else if(div[2].innerHTML==item.outerHTML) {
            if(div[1].innerHTML=='') {
                div[1].appendChild(item);
            } else if(div[5].innerHTML=='') {
                div[5].appendChild(item);
            };
        } else if(div[3].innerHTML==item.outerHTML) {
            if(div[0].innerHTML=='') {
                div[0].appendChild(item);
            } else if(div[4].innerHTML=='') {
                div[4].appendChild(item);
            } else if(div[6].innerHTML=='') {
                div[6].appendChild(item);
            };
        } else if(div[4].innerHTML==item.outerHTML) {
            if(div[1].innerHTML=='') {
                div[1].appendChild(item);
            } else if(div[3].innerHTML=='') {
                div[3].appendChild(item);
            } else if(div[5].innerHTML=='') {
                div[5].appendChild(item);
            } else if(div[7].innerHTML=='') {
                div[7].appendChild(item);
            };
        } else if(div[5].innerHTML==item.outerHTML) {
            if(div[2].innerHTML=='') {
                div[2].appendChild(item);
            } else if(div[4].innerHTML=='') {
                div[4].appendChild(item);
            } else if(div[8].innerHTML=='') {
                div[8].appendChild(item);
            };
        } else if(div[6].innerHTML==item.outerHTML) {
            if(div[3].innerHTML=='') {
                div[3].appendChild(item);
            } else if(div[7].innerHTML=='') {
                div[7].appendChild(item);
            };
        } else if(div[7].innerHTML==item.outerHTML) {
            if(div[4].innerHTML=='') {
                div[4].appendChild(item);
            } else if(div[6].innerHTML=='') {
                div[6].appendChild(item);
            } else if(div[8].innerHTML=='') {
                div[8].appendChild(item);
            };
        } else {
            if(div[5].innerHTML=='') {
                div[5].appendChild(item);
            } else if(div[7].innerHTML=='') {
                div[7].appendChild(item);
                gameOver();
            };
        };
    });
});