$(function () {
  
  //todo check if exist already another persone with same criteria
  //todo add modify and delete for every person

  let count = 1,
    obj = { persons: [] };

  //! Reading instance and add it
  function addIt(name, surname, type, gender, partner, canBring) {
    let partenerTranslate, canBringTranslate


    let arr = [name, surname, type, gender, partner, canBring];

    //! Traslating true and false with Yes and No
    if(partner){
      partenerTranslate = 'Yes'
    } else{
      partenerTranslate = 'No'
    }
    if(canBring){
      canBringTranslate = 'Yes'
    } else {
      canBringTranslate = 'No'
    }

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
      .addClass("panel-body infoPadding")
      .html(
        `<b>Name:</b> ${name}<br><b>Surname:</b> ${surname}<br><b>Type:</b> ${type}<br><b>Sex:</b> ${gender}<br><b>Transport:</b> ${canBringTranslate}<br><b>Partner:</b> ${partenerTranslate}`
      );

    h5.append(a);
    div2.append(h5);
    div1.append(div2);
    div3.append(info);
    div1.append(div3);
    $("#accordion").append(div1);
    count++;
  }

  //! Get propreties on form button
  $("#btn-add").on("click", function () {
    //! confirm adding, animation
    $(".alert").slideToggle(300).attr("style", "display:block;");
    setTimeout(() => $(".alert").fadeOut(500), 1500);

    //! getting propreties
    let name = $("#nomePr").val();
    let surname = $("#cognomePr").val(),
      type = $("input[class='type']:checked").attr("id"),
      gender = $("input[class='gndr']:checked").attr("id"),
      partner = $("#sessoOpposto"),
      canBring = $('#canBring');

      let partnerChecked = partner[0].checked
      let canBringChecked = canBring[0].checked

    addIt(name, surname, type, gender, partnerChecked, canBringChecked);
  });

  //! Export File clicking on button
  $("#exportFile").on("click", function () {
    var a = document.createElement("a");
    content = JSON.stringify(obj);
    var file = new Blob([content], { type: "data/json" });
    urlFile = URL.createObjectURL(file);
    a.href = urlFile;
    a.download = "metti-questo-file-in-data.json";
    a.click();
  });

  //! Create a hidden file type input to import a file
  let inputFile = $('<input type="file" id="inputElement" accept="json"/>');

  //! On click trigger inputFile
  $("#importFile").on("click", function () {
    inputFile.click();
  });

  //! Read data from imported file and invoke addIt
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


