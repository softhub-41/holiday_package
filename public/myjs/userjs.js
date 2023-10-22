function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /*loop through a collection of all HTML elements:*/
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain attribute:*/
        file = elmnt.getAttribute("data-include-html");
        if (file) {
            /*make an HTTP request using the attribute value as the file name:*/
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        elmnt.innerHTML = this.responseText;
                    }
                    if (this.status === 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                    /*remove the attribute, and call this function once more:*/
                    elmnt.removeAttribute("data-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /*exit the function:*/
            return;
        }
    }
}

function get_hotels() {
    fetch("/get-hotel-packages").then((response) => response.json())
        .then((value) => {
            if (value !== "no data") {
                var output = "";
                value.forEach((row) => {
                    output += '<div class="tab_inner_body full_width">' +
                        '                                                <div class="row">' +
                        '                                                    <div class="col-lg-12 col-md-12">' +
                        '                                                        <div class="tab_review_area"><img src="/' + row.coverphoto + '" alt="review image">' +
                        '                                                            <div class="review_content">' +
                        '                                                                <div class="top_head_bar">' +
                        '                                                                    <h4>' + row.hotel_name + '</h4>' +
                        '                                                                    <span class="country_span">' + row.name + ', ' + row.state + '</span>\n' +
                        '                                                                </div>\n' +

                        '                                                            </div>\n' +
                        '                                                        </div>\n' +
                        '                                                    </div>\n' +
                        '                                                    <div class="right_includes_hotel col-lg-3 col-md-3">\n' +
                        '                                                    </div>\n' +
                        '                                                </div>\n' +
                        '                                                <div class="inludes_hotel_booking">\n' +
                        '                                                    <div class="row">\n' +
                        '                                                        <div class="left_lists col-lg-6 col-md-6">\n' +
                        '                                                            <table>\n' +
                        '                                                                <tr>\n' +
                        '                                                                    <td class="label_list">Packages Available to book</td>' +
                        '                                                                    <td>-</td>' +
                        '                                                                    <td>Gold</td>' +
                        '                                                                    <td class="table-bold">&#X20b9; ' + row.gold + '</td>' +
                        '                                                                </tr>\n' +

                        '                                                                <tr>' +
                        '                                                                    <td class="label_list"></td>' +
                        '                                                                    <td>-</td>\n' +
                        '                                                                    <td>Silver</td>\n' +
                        '                                                                    <td class="table-bold">&#X20b9; ' + row.silver + '</td>' +
                        '                                                                </tr>\n' +
                        '                                                                <tr>\n' +
                        '                                                                    <td class="label_list"></td>\n' +
                        '                                                                    <td>-</td>\n' +
                        '                                                                    <td>Platinum</td>\n' +
                        '                                                                    <td class="table-bold">&#X20b9; ' + row.platinum + '</td>' +
                        '                                                                </tr>\n' +
                        '                                                            </table>\n' +
                        '                                                        </div>\n' +
                        '                                                        <div class="left_lists col-lg-6 col-md-6">\n' +
                        '                                                            <div class="table_bold">\n' +
                        '                                                                <table>\n' +
                        '                                                                    <tr>\n' +
                        '                                                                        <td class="bold"></td>' +
                        '                                                                        <td><button type="button" onclick="PayNow(`' + row.pck_id + '`,`gold`,' + row.gold + ')" class="btn_green proceed_buttton btns">proceed to book</button></td>' +
                        '                                                                    </tr>' +
                        '                                                                    <tr>\n' +
                        '                                                                        <td class="bold"></td>' +
                        '                                                                        <td><button type="button" onclick="PayNow(`' + row.pck_id + '`,`silver`,' + row.silver + ')" class="btn_green proceed_buttton btns">proceed to book</button></td>' +
                        '                                                                    </tr>' +
                        '                                                                    <tr>\n' +
                        '                                                                        <td class="bold"></td>' +
                        '                                                                        <td><button type="button" onclick="PayNow(`' + row.pck_id + '`,`platinum`,' + row.platinum + ')" class="btn_green proceed_buttton btns">proceed to book</button></td>' +
                        '                                                                    </tr>' +

                        '                                                                </table>' +
                        '                                                            </div>\n' +
                        '                                                        </div>\n' +
                        '                                                    </div>\n' +
                        '                                                </div>\n' +
                        '<div class="full_width t_align_c">\n' +
                        '                                        ' +
                        '                                    </div>' +
                        '                                                <!-- tab include area End -->\n' +
                        '                                            </div>';
                })
                document.getElementById("hotel_details").innerHTML = output;
            }
        })
}

const PayNow = (packid, pack_type, net_amt) => {
    let options = {
        key: "rzp_test_dRWiKHS7zr2Gki",
        amount: net_amt * 100,
        name: "Travelite",
        description: "Payment Gateway",
        image:
            "/assets/svg/logo.svg",
        handler: function (response) {
            RazorPayResponse(response, packid, pack_type, net_amt);
        },
        prefill: {
            name: "",
            email: "",
        },
        notes: {
            address: "",
        },
        theme: {
            color: "#942436",
        },
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
};
const RazorPayResponse = (response, packid, pack_type, net_amt) => {
    if (response.razorpay_payment_id !== "") {
        // let formdata = new FormData();
        // formdata.append("packid", packid);
        // formdata.append("pack_type", pack_type);
        // formdata.append("net_amt", net_amt);

        book_package(packid, pack_type, net_amt);

        // fetch("/booking", {
        //     method: "post",
        //     body: formdata
        // })
        //     .then((response) => response.text())
        //     .then((value) => {
        //         console.log(value);
        // if (value === "exists") {
        //     alert("You have already booked your package")
        // } else {
        // console.log(response.razorpay_payment_id);
        // book_package(packid, pack_type, net_amt);
        // }
        // })

    } else {
        alert("Payment Failed");
    }
}

function book_package(packid, pack_type, net_amt) {
    fetch('/book_package/' + packid + "/" + pack_type + "/" + net_amt).then((response) => response.text()).then((value) => {
        if (value === "exists") {
            alert("You have already booked a Package. If paid, You will get a refund soon.")
        } else {
            // alert("Booking Completed")
            window.location.href = "/booking-confirmation";
        }
    })
}


let my_bookings = () => {
    fetch("/fetch-my-bookings").then((response) => response.json())
        .then((value) => {
            console.log(value);
            var output = "";
            if (value.length > 0) {

                let i = 0;
                value.forEach((row) => {
                    output += "<tr>";
                    output += "<td>" + (++i) + "</td>";
                    output += "<td>" + row.hotel_name + "</td>";
                    output += "<td class='text-capitalize'>" + row.pack_type + "</td>";
                    output += "<td>" + row.book_date + "</td>";
                    // output += "<td>" + row.e_date + "</td>";
                    output += "<td> &#x20b9; " + row.book_amt + "</td>";
                    output += "<td class='text-capitalize'>" + row.bookstatus + "</td>";
                    output += "</tr>";
                })
            } else {
                output += "<tr>";
                output += "<td colspan='7'><h4 class='text-center text-danger'>No Booking(s done yet)</h4></td>";
                output += "</tr>";
            }
            // console.log(output);
            document.getElementById("tdata").innerHTML = output;
        })
}