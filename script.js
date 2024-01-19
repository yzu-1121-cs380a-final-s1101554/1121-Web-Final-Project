let spinning = false;

main();

function main() {
    drawWheelNumbers();
    drawBetAreaBG();
    drawBetAreaFG();
}

function addMsg(msg) {
    let msgTextArea = document.getElementById('msg-textarea');
    msgTextArea.readOnly = false;
    msgTextArea.innerHTML += msg + '\n';
    msgTextArea.scrollTop = msgTextArea.scrollHeight;
    msgTextArea.readOnly = true;
}

function countResult() {
    let wheel = document.getElementById("wheel-spinning-part");
    let table = document.getElementById('bet-area-fg');
    let moneyLabel = document.getElementById('money-label');
    let n = Math.round(parseInt(getRotateDegree(wheel))/10)%36;
    let earnings = 0;
    if (n === 0) {
        if (table.children[0].children[0].children.length !== 0) {
            let zeroCell = table.children[0].children[0];
            earnings = 35*parseInt(zeroCell.children[0].children[0].innerHTML);
            moneyLabel.innerHTML = parseInt(moneyLabel.innerHTML) + earnings;
        }
    }
    else {

        let row;
        if (n % 3 === 0) {
            row = table.children[1];
        }
        if (n % 3 === 2) {
            row = table.children[2];
        }
        if (n % 3 === 1) {
            row = table.children[3];
        }

        // single number
        {
            let cell = row.children[Math.floor(n / 3)];
            let odds = parseInt(cell.innerHTML);
            if (cell.children.length !== 0) {
                earnings = odds * parseInt(cell.children[0].children[0].innerHTML);
            }
        }

        // 2 to 1
        {
            let cell = row.children[12];
            let odds = parseInt(cell.innerHTML);
            if (cell.children.length !== 0) {
                earnings += odds * parseInt(cell.children[0].children[0].innerHTML);
            }
        }

        // 12s
        {
            row = table.children[4];
            let cell = table.children[4].children[Math.floor(n / 12)];
            let odds = parseInt(cell.innerHTML);
            if (cell.children.length !== 0) {
                earnings += odds * parseInt(cell.children[0].children[0].innerHTML);
            }
        }

        // 2 colspan
        {
            row = table.children[5];
            let cell;
            if (n <= 18) {
                cell = row.children[1];
            }
            else {
                cell = row.children[3];
            }
            let odds = parseInt(cell.innerHTML);
            if (cell.children.length !== 0) {
                earnings += odds * parseInt(cell.children[0].children[0].innerHTML);
            }
        }

        // even and odd
        {
            row = table.children[5];
            let cell;
            if (n % 2 === 0) {
                cell = row.children[2];
            }
            else {
                cell = row.children[4];
            }
            let odds = parseInt(cell.innerHTML);
            if (cell.children.length !== 0) {
                earnings += odds * parseInt(cell.children[0].children[0].innerHTML);
            }
        }
    }

    moneyLabel.innerHTML = parseInt(moneyLabel.innerHTML) + earnings;
    addMsg(`The pin indexed on ${n}\nYou earned ${earnings}\n`);
    reDrawBetAreaFG();
}

function wheelOnTransitioned() {
    let spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = false;

    let resetBtn = document.getElementById('reset-chips-btn');
    resetBtn.disabled = false;

    let input = document.getElementById('bet-money-input-text');
    input.disabled = false;

    spinning = false;
    countResult();
}

function onSpinDisable() {
    let spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;

    let resetBtn = document.getElementById('reset-chips-btn');
    resetBtn.disabled = true;

    let input = document.getElementById('bet-money-input-text');
    input.disabled = true;

    spinning = true;
}

function getRotateDegree(element) {
    let t = element.style.transform;
    if (t === '')
        return '0';
    return t.split('(')[1].split('d')[0];
}

function spin(degree, duration) {
    onSpinDisable();

    let wheel = document.getElementById("wheel-spinning-part");
    let currentDeg = parseInt(getRotateDegree(wheel));
    wheel.style.transform = `rotate(${currentDeg+degree}deg)`;
    wheel.style.transition = `transform ${duration}s ease-out`;

    wheel.ontransitionend = wheelOnTransitioned;
}

function drawWheelNumbers() {
    let wheel = document.getElementById("wheel-spinning-part");
    for (let i = 0; i <= 35; i++) {
        const element = document.createElement("span");
        element.textContent = i.toString();
        element.className = "wheel-numbers";
        element.style.rotate = `${i * -10}deg`;
        wheel.appendChild(element);
    }
}

function drawBetAreaBG() {
    let bg = document.getElementById('bet-area-bg');

    createZeroCell();
    createSingleNumberCells();
    create12sCells();
    create2ColspanCells();

    function createZeroCell() {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerHTML = `0`;
        td.rowSpan = 4;
        td.className = "bet-area-bg-cell zero-cell";
        td.style.width = `5%`;
        tr.appendChild(td);
        bg.appendChild(tr);
    }

    function createSingleNumberCells() {
        for (let i = 0; i < 3; i++) {
            let tr = document.createElement('tr');
            tr.style.height = `22.5%`;
            for (let j = 0; j < 12; j++) {
                let td = document.createElement('td');
                let label = ((3-i)+j*3);
                td.className = "bet-area-bg-cell single-number-cell";
                td.innerHTML = `${label}`;
                td.style.width = `7.5%`;
                td.style.backgroundColor = (label%2 === 0) ? "#ce2e2e" : "#3a3a3a";
                tr.appendChild(td);
            }
            let td = document.createElement('td');
            td.className = "bet-area-bg-cell two-to-one-cell";
            td.innerHTML = `2<br>to<br>1`;
            td.style.width = `5%`;
            tr.appendChild(td);

            bg.appendChild(tr);
        }
    }

    function create12sCells() {
        let tr = document.createElement('tr');
        tr.style.height = `16.5%`;
        let td = document.createElement('td');
        td.className = "bet-area-bg-cell ordinal-12s-cell";
        td.innerHTML = " ";
        td.style.visibility = `hidden`;
        tr.appendChild(td);

        td = document.createElement('td');
        td.className = "bet-area-bg-cell ordinal-12s-cell";
        td.innerHTML = `1st 12`;
        td.colSpan = 4;
        tr.appendChild(td);

        td = document.createElement('td');
        td.className = "bet-area-bg-cell ordinal-12s-cell";
        td.innerHTML = `2nd 12`;
        td.colSpan = 4;
        tr.appendChild(td);

        td = document.createElement('td');
        td.className = "bet-area-bg-cell ordinal-12s-cell";
        td.innerHTML = `3rd 12`;
        td.colSpan = 4;
        tr.appendChild(td);

        bg.appendChild(tr);
    }

    function create2ColspanCells() {
        let tr = document.createElement('tr');
        tr.style.height = `16%`;

        let td = document.createElement('td');
        td.className = "bet-area-bg-cell btm-cell";
        td.innerHTML = " ";
        td.style.visibility = `hidden`;
        tr.appendChild(td);

        td = document.createElement('td');
        td.className = "bet-area-bg-cell btm-cell";
        td.innerHTML = `1 to 18`;
        td.colSpan = 3;
        tr.appendChild(td);

        td = document.createElement('td');
        td.className = "bet-area-bg-cell btm-cell";
        td.innerHTML = `EVEN`;
        td.style.backgroundColor = `#ce2e2e`;
        td.colSpan = 3;
        tr.appendChild(td);

        td = document.createElement('td');
        td.className = "bet-area-bg-cell btm-cell";
        td.innerHTML = `ODD`;
        td.style.backgroundColor = `#3a3a3a`;
        td.colSpan = 3;
        tr.appendChild(td);

        td = document.createElement('td');
        td.className = "bet-area-bg-cell btm-cell";
        td.innerHTML = `19 to 36`;
        td.colSpan = 3;
        tr.appendChild(td);

        bg.appendChild(tr);
    }
}

function betAreaCellOnclick() {
    if (spinning) {
        return;
    }

    let betMoney = parseInt(document.getElementById('bet-money-input-text').value);
    if (betMoney === 0) {
        return;
    }

    let leftMoney = 0;
    if (this.children.length !== 0) {
        leftMoney = parseInt(this.children[0].children[0].innerHTML);
        this.removeChild(this.children[0]);
    }

    let d = document.createElement('div');
    d.className = `chip-on-bet-area`;

    let text = document.createElement('span');
    text.innerHTML = (leftMoney+parseInt(betMoney)).toString();
    text.style.color = 'white';
    text.style.fontSize = '1rem';
    text.zIndex = 100;
    text.style.position = 'absolute';
    text.style.backgroundColor = 'black';
    text.style.color = `yellow`;
    d.appendChild(text);
    this.appendChild(d);

    let moneyLabel = document.getElementById('money-label');
    moneyLabel.innerHTML = (parseInt(moneyLabel.innerHTML) - betMoney).toString();
    betMoneyOnChange();
}

function drawBetAreaFG() {
    let fg = document.getElementById('bet-area-fg');
    let tr, td, label;

    createZeroCell();
    createSingleNumberCells();
    create12sCells();
    create2ColspanCells();

    // 0
    function createZeroCell() {
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.innerHTML = `35`;
        td.style.fontSize = `0`;
        td.rowSpan = 4;
        td.className = "bet-area-fg-cell";
        td.style.width = `5%`;
        td.addEventListener("click", betAreaCellOnclick);
        tr.appendChild(td);
        fg.appendChild(tr);
    }

    function createSingleNumberCells() {
        for (let i = 0; i < 3; i++) {
            tr = document.createElement('tr');
            tr.style.height = `22.5%`;

            // single number
            for (let j = 0; j < 12; j++) {
                td = document.createElement('td');
                td.className = "bet-area-fg-cell";
                td.innerHTML = `35`;
                td.style.fontSize = `0`;
                td.style.width = `7.5%`;
                td.addEventListener("click", betAreaCellOnclick);
                // td.addEventListener("mouseleave", cellOffHover);
                tr.appendChild(td);
            }

            // 2 to 1
            td = document.createElement('td');
            td.className = "bet-area-fg-cell";
            td.innerHTML = `2`;
            td.style.width = `5%`;
            td.style.fontSize = `0`;
            td.style.height = `22.5%`;
            td.addEventListener("click", betAreaCellOnclick);
            tr.appendChild(td);

            fg.appendChild(tr);
        }
    }

    function create12sCells() {
        tr = document.createElement('tr');
        tr.style.height = `16.5%`;

        td = document.createElement('td');
        td.className = "bet-area-fg-cell";
        td.innerHTML = null;
        td.style.fontSize = `0`;
        td.style.height = `16.5%`;
        td.style.visibility = `hidden`;
        tr.appendChild(td);


        for (let i = 0; i < 3; i++) {
            td = document.createElement('td');
            td.className = "bet-area-fg-cell";
            td.innerHTML = `2`;
            td.style.fontSize = `0`;
            td.colSpan = 4;
            td.style.height = `16.5%`;
            td.addEventListener("click", betAreaCellOnclick);
            tr.appendChild(td);
        }

        fg.appendChild(tr);
    }

    function create2ColspanCells() {
        tr = document.createElement('tr');
        tr.style.height = `16%`;

        td = document.createElement('td');
        td.className = "bet-area-fg-cell";
        td.innerHTML = null;
        td.style.fontSize = `0`;
        td.style.visibility = `hidden`;
        td.style.height = `16%`;
        tr.appendChild(td);

        for (let i = 0; i < 4; i++) {
            td = document.createElement('td');
            td.className = "bet-area-fg-cell";
            td.style.fontSize = `0`;
            td.innerHTML = `1`;
            td.colSpan = 3;
            td.style.height = `16%`;
            td.addEventListener("click", betAreaCellOnclick);
            tr.appendChild(td);
        }

        fg.appendChild(tr);
    }
}

function betMoneyOnChange() {
    let betMoney = document.getElementById('bet-money-input-text');
    let betMoneyValue = parseInt(betMoney.value);
    let money = document.getElementById('money-label');
    let moneyValue = parseInt(money.innerHTML);
    if (betMoneyValue > moneyValue) {
        betMoney.value = moneyValue;
    }
    if (betMoneyValue < 0 || isNaN(betMoneyValue)) {
        betMoney.value = 0;
    }
    betMoney.value = parseInt(betMoney.value);
}

function reDrawBetAreaFG() {
    let table = document.getElementById('bet-area');
    let fg = document.getElementById('bet-area-fg');
    table.removeChild(fg);
    fg = document.createElement('table');
    fg.id = 'bet-area-fg';
    table.appendChild(fg);
    drawBetAreaFG();
}

function resetChipsOnClick() {
    let table = document.getElementById('bet-area');
    let fg = document.getElementById('bet-area-fg');
    let moneyLabel = document.getElementById('money-label');
    let money = parseInt(moneyLabel.innerHTML);

    Array.from(fg.children).forEach(tr => {
        Array.from(tr.children).forEach(td => {
            if (td.children.length !== 0) {
                money += parseInt(td.children[0].children[0].innerHTML);
            }
        });
    });
    moneyLabel.innerHTML = money;

    reDrawBetAreaFG();
}

function spinOnClick() {
    const turns = Math.round(Math.random()*3+2);
    const deg = Math.random()*360;
    spin(turns*360+deg, 3);
}
