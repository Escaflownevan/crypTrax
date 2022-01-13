const ipcRenderer = window.require('electron').ipcRenderer;

(function() {
    const script = document.createElement("script");
    script.src = './tray/js/jquery.min.js';
    script.type = 'text/javascript';
    script.addEventListener('load', () => {
        console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);
        $(".myIcon img").click(function() {
            ipcRenderer.send('request-action-toggleMainWindow');
        })
    });
    document.head.appendChild(script);

})();

let data = []; //"myCoins" main window data

ipcRenderer.on('action-update-label', (event, arg) => {
    data = arg;

    renderCoins();
});

function checkOverflow() {
    if ($(window).width() < $("#coinList").width()) {
        if (!$("#scrollLeft").length) {
            $(".window-content").append('<button id="scrollLeft" type="button" name="button"><</button>')
            $(".window-content").append('<button id="scrollRight" type="button" name="button">></button>')

            $('#scrollRight').click(function(event) {
                event.preventDefault();
                $('.window-content').animate({
                    scrollLeft: "+=300px"
                }, "slow");
            });

            $('#scrollLeft').click(function(event) {
                event.preventDefault();
                $('.window-content').animate({
                    scrollLeft: "-=300px"
                }, "slow");
            });
        }
    } else {
        $("#scrollLeft").remove();
        $("#scrollRight").remove();

    }
}

let totalAll = 0
let plAll = 0

function renderCoins() {
    totalAll = 0;
    plAll = 0;
    $('#coinList').html("");
    data[0].forEach((item, i) => {
        let change1 = Math.round(item.time1h * 100) / 100
        let change2 = Math.round(item.time1d * 100) / 100
        let change3 = Math.round(item.time7d * 100) / 100
        let bought = data[2];
        let show
        let total = 0
        let pl = 0

        bought[i].purchases.forEach((item2) => {
            total = parseFloat(item2[0]) * parseFloat(item.price);
            let ammount = parseFloat(item2[0]);
            let boughtPrice = parseFloat(item2[1]);
            if (ammount > 0) {
                if (boughtPrice == 0) {
                    let total = ammount * parseFloat(item.price);
                    if (data[3].taxes.active && total > 0) {
                        pl = total - (data[3].taxes.percentage / 100) * total;
                    } else {
                        pl = total;
                    }

                } else {
                    let a = ammount * boughtPrice;
                    let b = ammount * parseFloat(item.price);
                    pl = b - a;
                    if (data[3].taxes.active && pl > 0) {
                        pl = pl - (data[3].taxes.percentage / 100) * pl;
                    }
                }
            }
        });

        pl = pl.toFixed(2)
        plAll += parseFloat(pl);
        total = total.toFixed(2)
        totalAll += parseFloat(total)
        if (total == 0) {
            show = "hidden"
        }

        let completeTitle = '<div class="menuIcon"><h3>Rank<p>' + item.rank + '</p></h3></div>' +
            '<div class="menuIcon"><h3>1H<p>' + change1 + ' %</p></h3></div>' +
            '<div class="menuIcon"><h3>24H<p>' + change2 + ' %</p></h3></div>' +
            '<div class="menuIcon"><h3>7D<p>' + change3 + ' %</p></h3></div>' +
            '<div class="menuIcon ' + show + '"><h3>Total<p>' + total + ' ' + checkFiat(data[1]) + '</p></h3></div>' +
            '<div class="menuIcon ' + show + '"><h3>P/L<p>' + pl + ' ' + checkFiat(data[1]) + '</p></h3></div>' +
            '<div class="menuIcon"><h3>ATH<p>' + item.high + ' ' + checkFiat(data[1]) + '</p></h3></div>'
        $('#coinList').append(
            '<li id="tool-' + item.id + '" class="listItem">' +
            '<img src="' + item.logo_url + '" width="24" height="24" />' +
            '<span class="coinName">' + item.id.charAt(0).toUpperCase() + item.id.slice(1) + '</span>' +
            '<span class="coinPrice"> ' + item.price + ' ' + checkFiat(data[1]) + '</span></li>' +
            '<li class="tooltip hidden">' + completeTitle + '</li>');

    });
    if (totalAll != 0) {
        $(".totalAll p").html(totalAll.toFixed(2) + ' ' + checkFiat(data[1]))
        $(".plAll p").html(plAll.toFixed(2) + ' ' + checkFiat(data[1]))
        $(".totalAll").removeClass("hidden")
        $(".plAll").removeClass("hidden")
        $(".myIcon").addClass("showAll")
    } else {
        $(".totalAll").addClass("hidden")
        $(".plAll").addClass("hidden")
        $(".myIcon").removeClass("showAll")
    }

    $(".listItem").click(function() {
        $(this).next(".tooltip").toggleClass("hidden");
        if ($(this).next(".tooltip").is(':last-child')) {
            $('.window-content').animate({
                scrollLeft: "+=400px"
            }, "slow");
        }
        checkOverflow();

    })

    checkOverflow()
}

function checkFiat(data) {
    if (data == "EUR") {
        return "€ ";
    } else {
        return "$ ";
    }
}

function colorCheck(inputNumber) {
    if (inputNumber < 0) {
        return "red"
    } else {
        return "green"
    }
}
