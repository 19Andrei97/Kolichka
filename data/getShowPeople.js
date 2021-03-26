$(function () {

  //todo aggiungere modifica ed elimina per ogni persona
  //todo finalizarre il form e le informazioni che servono

  let count = 1,
    obj = { persons: [] };

  //! Reading instance and add it
  function addIt(name, surname, type, gender) {
    let arr = [name, surname, type, gender];

    //! Setting obj with key/value
    obj.persons.push(arr);

    //! Building DOM
    let div1 = $("<div>").addClass("panel panel-default");
    let div2 = $("<div>").addClass("panel-heading procHead");
    let h5 = $("<h5>").addClass("panel-body");
    let a = $(
      '<a data-toggle="collapse" class="procHeadText" data-parent="#accordion"></a>'
    )
      .text(`${name} ${surname}`)
      .attr("href", `#${count}`);

    let div3 = $("<div>")
      .addClass("panel-collapse collapse procbody")
      .attr("id", `${count}`);

    let info = $("<div>")
      .addClass("panel-body")
      .html(
        `<b>Nome:</b> ${name}<br><b>Cognome:</b> ${surname}<br><b>Tipo:</b> ${type}<br><b>Sesso:</b> ${gender}`
      );

    h5.append(a);
    div2.append(h5);
    div1.append(div2);
    div3.append(info);
    div1.append(div3);
    $("#accordion").append(div1);
    count++;
  }

  $("#btn-add").on("click", function () {
    //! confirm adding, animation
    $(".alert").slideToggle(300).attr("style", "display:block;");
    setTimeout(() => $(".alert").fadeOut(500), 1500);

    //! getting propreties
    let name = $("#nomePr").val();
    let surname = $("#cognomePr").val(),
      type = $("input[class='type']:checked").attr("id"),
      gender = $("input[class='gndr']:checked").attr("id");

    addIt(name, surname, type, gender);
  });

  //! Export File
  $("#exportFile").on("click", function () {
    var a = document.createElement("a");
    content = JSON.stringify(obj);
    var file = new Blob([content], { type: "data/json" });
    urlFile = URL.createObjectURL(file);
    a.href = urlFile;
    a.download = "metti-questo-file-in-data.json";
    a.click();
  });

  //! Create a hidden file type input
  let inputFile = $('<input type="file" id="inputElement" accept="json"/>');

  //! On click trigger inputFile
  $("#importFile").on("click", function () {
    inputFile.click();
  });

  //! Read data and addIt
  inputFile.on("change", function (evt) {
    var files = evt.target.files; // FileList object

    // use the 1st file from the list
    f = files[0];
  
    var reader = new FileReader();
  
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return function (e) {
        let parsed = JSON.parse(e.target.result)
        parsed.persons.forEach((val) => {
          addIt(...val);
        });
      };
    })(f);
  
    // Read in the image file as a data URL.
    reader.readAsText(f);
  });
});


