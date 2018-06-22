$(function ready() {
  $.getJSON("/api/orders", function(data) {
    buildTable(data);
  });


  function buildTable(data) {
    var table;
    var options = {  
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  };
    data.forEach(function(item) {
      var detail = item.detail.map(item => {
        return item.value;
      });
      var date = new Date(item.createdOn);
      var row = `
            <tr>
            <td>${date.toLocaleString('en-us', options)}</td>
            <td>${item.name}</td>
            <td>${item.tel}</td>
            <td>${item.sum}</td>
            <td>${detail.toString().replace(/,/g, ', ')}</td>
            <td>${item.address}</td>
            </tr>
            `;
      table += row;
    });
    $("#orders").html(table);
  }
  //catch enter event
  $("input.search").keypress(function(e) {
    var key = e.which;
    if (key == 13) {
      // the enter key code
      search();
    }
  });
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
    //alert ("OK");
  });
  $("#search").on("click", search);
  function search() {
    let tel = $('input[name="tel"]').val();
    let address = $('input[name="address"]').val();
    let searchObj = {};

    if (address) {
      searchObj.address = address.trim();
    }
    if (tel) {
      searchObj.tel = tel.trim();
    }

    $.ajax({
      url: "/api/orders/search",
      type: "GET",
      contentType: "application/json",
      dataType: "json",
      data: searchObj,
      //    data: JSON.stringify(searchObj),
      success: function(json, status, request) {
        let data = json;
        if (data.length > 0) {
          $("#statusOrder").removeClass();
          buildTable(data);
        } else {
          $("#statusOrder").removeClass();
          $("#statusOrder").addClass("alert alert-info");
          $("#statusOrder").html("No record matching the request");
        }
      },
      error: function(request, status) {
        $("#statusOrder").removeClass();
        $("#statusOrder").addClass("alert alert-danger");
        $("#statusOrder").html("Error accessing the record");
        console.log("Request failed : ", status);
      }
    });
  }
});
