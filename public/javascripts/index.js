$(function ready() {
  // Initialize form validation on the registration form.
  // It has the name attribute "registration"

  $.getJSON("/data/menu.json", function(data) {
    data.forEach(function(item, i) {
      let block = "";
      let category = "<h4><b>" + item.category + "</h4></h3>";
      let type = item.multipleAllowed ? "checkbox" : "radio";
      let checked = item.multipleAllowed ? "" : "checked";

      var options = item["options"]; //options array
      options.forEach(function(i) {
        let arr = Object.keys(i);
        var option = arr.toString();
        let mediumPrice = parseFloat(i["price"]);
        let largePrice = parseFloat(i["surcharge"] + mediumPrice);
        block += `<div class="checkbox">
            <label for="${i.name}"><input type="${type}" value="${
          i.name
        }" name="${item.category}" ${checked}>
             ${i.name}
             </label>
             <span class="medium-price"> ${mediumPrice}</span>
             <span class="large-price" style="display: none"> ${largePrice}</span>
            </div>`;
      });

      $("#menu").append('<div class="col-sm-4">' + category + block + "</div>");
    });
  });

  var setPrices = function() {
    var x = document.getElementById("size").value;
    let mediumPrice = document.getElementsByClassName("medium-price");
    let largePrice = document.getElementsByClassName("large-price");

    if (x == 0) {
      for (let i = 0; i < mediumPrice.length; i++) {
        mediumPrice[i].style.display = "inline-block";
        largePrice[i].style.display = "none";
      }
    } else {
      let price = document.getElementsByClassName("large-price");
      for (let i = 0; i < largePrice.length; i++) {
        mediumPrice[i].style.display = "none";
        largePrice[i].style.display = "inline-block";
      }
    }
  };
  var sizeSelect = document.getElementById("size");
  sizeSelect.onchange = setPrices;

  $("#tel").keyup(function() {
    let num = $(this)
      .val()
      .replace(/\D/g, "");
    $(this).val(
      num.substring(0, 3) +
        "-" +
        num.substring(3, 6) +
        "-" +
        num.substring(6, 10)
    );
  });

  $("#submitForm").submit(function(event) {
    event.preventDefault();
    let choices = checkbox;
    var checkbox = $("#menu input:checkbox:checked")
      .map(function() {
        let choice = {
          name: $(this).attr("name"),
          value: $(this).val()
        };
        return choice;
      })
      .get();

    var radio = $("#menu input:radio:checked")
      .map(function() {
        let choice = {
          name: $(this).attr("name"),
          value: $(this).val()
        };
        checkbox.push(choice);
      })
      .get();

    var orderInfo = JSON.stringify({
      name: $("#name").val(),
      address: $("#address").val(),
      tel: $("#tel").val(),
      orderDetail: checkbox,
      qty: $("#qty").val(),
      size: $("#size").val()
    });


    $.ajax({
      url: "/api/orders",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: orderInfo,
      success: function(json, status, request) {
        $("#statusMsg").removeClass();
        $("#statusMsg").addClass("alert alert-success");
        $("#statusMsg").html("Added the order");
      },
      error: function(request, status) {
        $("#statusMsg").removeClass();
        $("#statusMsg").addClass("alert alert-danger");
        $("#statusMsg").html("Error adding the order");
        console.log("Request failed : ", status);
      }
    });
  });
});
